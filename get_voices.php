<?php
require __DIR__ . '/vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

use Google\ApiCore\ApiException;
use Google\Cloud\TextToSpeech\V1\TextToSpeechClient;

const LANGUAGES_DISPLAY = [
	'fr-FR' => 'Français (France)',
	'en-US' => 'English (United States)',
	'de-DE' => 'Deutsch (Deutschland)'
];

function get_language_text( string $language ) : string {
	if( !isset(LANGUAGES_DISPLAY[ $language ]) ) {
		return '';
	}
	return LANGUAGES_DISPLAY[ $language ];
}

function get_language_code( string $language_code ) : string {
	$languages_codes = array_flip(LANGUAGES_DISPLAY);
	if( !isset($languages_codes[ $language_code ]) ) {
		return '';
	}
	return $languages_codes[ $language_code ];
}


/**
 * Return array of available voices for provided languages
 *
 * @param array|string[]    $languages
 *
 * @return array|false
 */
function get_voices( array $languages = [ 'fr-FR', 'en-US', 'de-DE' ] ) {
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
                    if( $languageCode === $language && (strpos($voice->getName(), 'Wavenet') || strpos($voice->getName(), 'Neural2')) ) {
                        $language_text = get_language_text($language);
						$voices[$language_text][ $voice->getName() ] =
                            sprintf("%s (%s)",
                                    $voice->getName(),
                                    $ssmlVoiceGender[ $voice->getSsmlGender() ]
                            );
                    }
                }
            }
	        if( isset( $language_text ) && isset($voices[ $language_text ]) && is_array($voices[ $language_text ]) ) {
		        asort($voices[ $language_text ]);
	        }
        }

		return $voices;
        // return array_merge(...array_values($voices));
    }
    catch( ApiException $e ) {
        print_r($e->getMessage());
    } finally {
        $client->close();
    }
    return false;
}