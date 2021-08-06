<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

ob_start();

require __DIR__ . '/vendor/autoload.php';

session_start();
require( 'formkey.class.php' );
$formKey = new formKey();
$error   = 'No error';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Google\Cloud\TextToSpeech\V1\AudioConfig;
use Google\Cloud\TextToSpeech\V1\AudioEncoding;
use Google\Cloud\TextToSpeech\V1\SynthesisInput;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;
use Google\Cloud\TextToSpeech\V1\VoiceSelectionParams;

function synthesize_text( $text ) {
    // create client object
    $client = new TextToSpeechClient();

    $voice_name         = filter_var($_POST[ 'voice-name' ], FILTER_SANITIZE_SPECIAL_CHARS) ?? 'fr-FR-Wavenet-D';
    $language           = substr($voice_name, 0, 5);
    $root               = __DIR__ . '/audio/';
    $directory          = !empty($_COOKIE[ 't2s' ]) ? htmlspecialchars($_COOKIE[ 't2s' ]) : uniqid();
    $user_dir           = $root . $directory;
    $sanitized_filename = filter_var($_POST[ 'filename' ], FILTER_SANITIZE_STRING);
    $filename           = !empty($sanitized_filename) ? $sanitized_filename : uniqid();
    $filepath           = $user_dir . '/' . $filename . '.mp3';
    $relative_user_dir  = '/audio/' . $directory;
    $relative_filepath  = $relative_user_dir . '/' . $filename . '.mp3';
    $is_multiple        = false;
    $overwrite          = !empty($_POST[ 'overwrite' ]) ? htmlspecialchars($_POST[ 'overwrite' ]) : 'on';

    // note: the voice can also be specified by name
    // names of voices can be retrieved with $client->listVoices()
    $voice = ( new VoiceSelectionParams() )
        ->setLanguageCode($language)
        ->setName($voice_name);

    /**
     * We choose "LINEAR16" for encoding since it sounds
     * much better compared to MP3 as set in Google code examples.
     * It is the setting used in Cloud Text To Speech demo
     */
    $audioConfig = ( new AudioConfig() )
        ->setAudioEncoding(AudioEncoding::LINEAR16);

    // Create necessary folders
    if( !is_dir($root) ) {
        mkdir($root, 0777, true);
    }
    if( !is_dir($user_dir) ) {
        mkdir($user_dir, 0777, true);
    }

    $actual_name   = pathinfo($filepath, PATHINFO_FILENAME);
    $original_name = $actual_name;
    $extension     = pathinfo($filepath, PATHINFO_EXTENSION);

    /* If we choose to not overwrite, we create files with number after name. Ex: audio(1).mp3 */
    if( $overwrite != 'on' ) {
        $i = 1;
        while( file_exists($user_dir . '/' . $actual_name . "." . $extension) ) {
            $actual_name       = (string)$original_name . '(' . $i . ')';
            $name              = $actual_name . "." . $extension;
            $filepath          = $user_dir . '/' . $name;
            $relative_filepath = $relative_user_dir . '/' . $name;
            $i++;
        }
    }

    /* Check if multiple : we detect line breaks and split string into array */
    if( isset($_POST[ 'multiple' ], $_POST[ 'download' ]) && $_POST[ 'multiple' ] == 'on' && $_POST[ 'download' ] == 1 ) {
//        $text = str_replace('"', '', $text);
        $text  = rtrim($text, '&#13;&#10;');
        $text  = rtrim($text, '"');
        $text  = ltrim($text, '"');
        $text  = str_replace('<p>', "", $text);
        $text  = stripslashes(str_replace('</p>', "\r\n", $text));
        $text  = rtrim($text, "\r\n");
        $array = preg_split('/\r\n|[\r\n]/', $text);
        if( is_array($array) && count($array) > 1 ) {
            $is_multiple = true;
        }
    }

    /* If we choose to make multiple files, we iterate and return a zip file */
    if( $is_multiple ) {
        $i                   = 1;
        $zip                 = new ZipArchive();
        $zipfilename         = $original_name . ".zip";
        $zipfilepath         = $user_dir . '/' . $zipfilename;
        $relative_filepath   = $relative_user_dir . '/' . $zipfilename;
        $tempdir             = uniqid();
        $tempdirabsolutepath = $user_dir . '/' . $tempdir;

        // Make a temp folder
        mkdir($tempdirabsolutepath, 0777, true);

        // Create a zip archive
        $zip->open($zipfilepath, ZipArchive::CREATE);

        foreach( $array as $value ) {
            $name         = $original_name . '.' . $i . ".mp3";
            $filepath     = $tempdirabsolutepath . '/' . $name;
            $input_text   = ( new SynthesisInput() )->setSsml('<speak>' . $value . '</speak>');
            $response     = $client->synthesizeSpeech($input_text, $voice, $audioConfig);
            $audioContent = $response->getAudioContent();

            // Write audio to file
            file_put_contents($filepath, $audioContent, LOCK_EX);

            // Add file to zip
            $zip->addFile($filepath, $name);

            $i++;
        }
        $zip->close();

        // Delete temporary files and temporary folder
        array_map('unlink', glob("$tempdirabsolutepath/*.*"));
        rmdir($tempdirabsolutepath);
    }
    else { // We don't want to make multiple audio file, so let's just create one.
        $text         = rtrim($text, '&#13;&#10;');
        $text         = rtrim($text, '"');
        $text         = ltrim($text, '"');
        $text         = stripslashes(str_replace('&#13;&#10;', "", $text));
        $input_text   = ( new SynthesisInput() )->setSsml('<speak>' . $text . '</speak>');
        $response     = $client->synthesizeSpeech($input_text, $voice, $audioConfig);
        $audioContent = $response->getAudioContent();

        // Write audio to file
        file_put_contents($filepath, $audioContent, LOCK_EX);
    }

    $client->close();

    return compact('relative_user_dir', 'relative_filepath', 'text');
}

//Is request?
if( $_SERVER[ 'REQUEST_METHOD' ] == 'POST' ) {
    //Validate the form key   

    if( !isset($_POST[ 'form_key' ]) || !$formKey->validate() ) {
        echo json_encode([
                             'status'  => 'error',
                             'message' => 'Erreur de validation du formulaire'
                         ]);
        die();
    }
}

if( isset($_POST[ 'text' ]) ) {
    $sanitized_text = strip_tags($_POST[ 'text' ], [ '<p>', '<emphasis>', '<prosody>', '<say-as>', '<break>', '<br>' ]);
    $result         = synthesize_text($sanitized_text);
    echo json_encode([
                         'status'        => 'success',
                         'message'       => 'Fichier généré avec succès',
                         'user_dir'      => $result[ 'relative_user_dir' ],
                         'filepath'      => $result[ 'relative_filepath' ],
                         'original_text' => $sanitized_text,
                         'output_text'   => $result[ 'text' ],
                     ]);
}
else {
    echo json_encode([
                         'status'  => 'error',
                         'message' => 'Le texte est absent'
                     ]);
}

