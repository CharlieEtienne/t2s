<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Google\ApiCore\ApiException;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;

/**
 * Return array of available voices for provided languages
 *
 * @param array|string[]    $languages
 *
 * @return array|false
 */
function get_voices( array $languages = [ 'fr-FR', 'en-US' ] ) {
    // create client object
    $client = new TextToSpeechClient();

    try {
        // perform list voices request
        $available_voices = $client->listVoices()->getVoices();

        // init empty voices array
        $voices = [];

        // SSML voice gender values from TextToSpeech\V1\SsmlVoiceGender
        $ssmlVoiceGender = [ 'Genre inconnu', 'Homme', 'Femme', 'Neutre' ];
        foreach( $languages as $language ) {
            foreach( $available_voices as $voice ) {
                foreach( $voice->getLanguageCodes() as $languageCode ) {
                    if( $languageCode === $language && strpos($voice->getName(), 'Wavenet') ) {
                        $voices[$language][ $voice->getName() ] =
                            sprintf("%s (%s)",
                                    $voice->getName(),
                                    $ssmlVoiceGender[ $voice->getSsmlGender() ]
                            );
                    }
                }
            }
	        if( isset($voices[ $language ]) && is_array($voices[ $language ]) ) {
		        asort($voices[ $language ]);
	        }
        }

        return array_merge(...array_values($voices));
    }
    catch( ApiException $e ) {
        print_r($e->getMessage());
    } finally {
        $client->close();
    }
    return false;
}