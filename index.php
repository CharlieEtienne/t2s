<?php
    if(!isset($_COOKIE['t2s'])){
        setcookie('t2s', uniqid(), time() + 365*24*3600, null, null, false, true);
    }
    require_once 'get_voices.php';

    //Start the session
    session_start();
    //Require the class
    require_once 'rss_feed_to_html.php';
    require('formkey.class.php');
    //Start the class
    $formKey = new formKey();

    $error = 'No error';
?>

<!DOCTYPE html>
<html lang="fr-FR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>T2S</title>
    <meta name="description" content="Permet d'exporter en mp3 des pistes audios 🎧 générées à partir de texte via l'API de Google T2S.">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="application-name" content="T2S">
    <meta name="apple-mobile-web-app-title" content="T2S">
    <meta name="theme-color" content="#3e28a9">
    <meta name="msapplication-navbutton-color" content="#3e28a9">
    <meta name="apple-mobile-web-app-status-bar-style" content="#3e28a9">
    <meta name="msapplication-starturl" content="/">
    <link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
    <link rel="apple-touch-icon" type="image/png" sizes="192x192" href="icon-192.png">
    <link rel="manifest" href="manifest.json">
	<script src="sw.js"></script>

    <!--  STYLESHEETS  -->
	<style id="scheme"></style>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito&display=swap">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css">
    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
    <link rel="stylesheet" href="/assets/css/lity.min.css">
    <link rel="stylesheet" href="/assets/css/quill.snow.css">
    <link rel="stylesheet" href="assets/css/richVoiceEditor.css">
    <link rel="stylesheet" href="assets/css/material-palenight.css">
    <link rel="stylesheet" href="assets/css/one-light.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body class="pt-md-5 pt-3">
    <div class="container main-wrapper">

        <form id="t2s" method="POST" action="process.php">

            <header>
                <h1 class="h3 mb-5 mt-lg-5 font-weight-bold text-center main-title">
                    <img src="icon-192.png" class="mb-1 mr-3" style="width: 2rem;" alt="icon">
                    <span class="main-title-text">Google TextToSpeech 2 mp3</span>
                </h1>

                <div class="form-row header-options">

                    <div class="form-group col-md-5">
                        <label for="filename">Nom du fichier</label>
                        <div class="input-group">
                            <input id="filename" class="form-control" type="text" value="" name="filename" placeholder="<?php echo uniqid(); ?>" tabindex="1">
                            <div class="input-group-append">
                                <div class="input-group-text">.mp3</div>
                            </div>
                        </div>
                    </div>

                    <div class="form-group col-md-6 col-11">
                        <label for="voice-name">Type de voix</label>
                        <select class="form-control custom-select" name="voice-name" id="voice-name">
                            <?php foreach( get_voices(['fr-FR', 'en-US']) as $key => $value ) : ?>
                                <option value="<?= $key ?>"><?= $value ?></option>
                            <?php endforeach; ?>
                        </select>
                    </div>

                    <div class="form-group col-1 align-self-end">
                        <a class="btn btn-default pl-0 pr-0 w-100" data-toggle="collapse" href="#options" role="button" aria-expanded="false" aria-controls="options">
                            <i class="fa fa-cog text-info align-middle" style="font-size:20px;" data-toggle="tooltip" data-placement="top" title="Options"></i>
                        </a>
                    </div>

                </div>

                <div class="collapse mb-3" id="options">
                    <div class="form-row">
                        <div class="custom-control custom-switch col-md-5" style="padding-left: calc(2.5rem + 5px);">
                            <input type="checkbox" class="custom-control-input" name="multiple" id="multiple" checked="checked">
                            <label class="custom-control-label" for="multiple">
                                Un fichier par ligne&nbsp;?
                                <i class="far fa-question-circle text-muted" data-toggle="tooltip" data-placement="top" title="En activant cette option, un fichier audio sera créé à chaque fois qu'un saut de ligne sera détecté. Les fichiers seront numérotés par ordre croissant et téléchargés dans une archive au format .zip"></i>
                            </label>
                        </div>

                        <div class="custom-control custom-switch col-md-7" style="padding-left: calc(2.5rem + 5px);">
                            <input type="checkbox" class="custom-control-input" name="overwrite" id="overwrite" checked="checked">
                            <label class="custom-control-label" for="overwrite">
                                Écraser les fichiers du même nom&nbsp;?
                                <i class="far fa-question-circle text-muted" data-toggle="tooltip" data-placement="top" title="En activant cette option, si un nom de fichier est saisi, il sera conservé tel quel et remplacera un éventuel fichier portant le même nom. En désactivant cette option, les fichiers auront la forme audio(x).mp3"></i>
                            </label>
                        </div>

	                    <div class="col-md-12 mt-3">
		                    <span>Theme:</span>
		                    <input type="radio" class="" name="theme" value="auto" id="theme--auto" checked="checked">
		                    <label class="" for="theme--auto">Auto</label>
		                    <input type="radio" class="" name="theme" value="light" id="theme--light">
		                    <label class="" for="theme--light">Light</label>
		                    <input type="radio" class="" name="theme" value="dark" id="theme--dark">
		                    <label class="" for="theme--dark">Dark</label>
	                    </div>

                        <a href="#shortcuts-popup"
                           class="btn-link mt-2 text-decoration-none"
                           style="padding: 0 10px;"
                           data-lity><i class="fas fa-keyboard mr-1"></i> Raccourcis claviers</a>

                        <div id="shortcuts-popup" class="lity-hide">
                            <h4 class="text-center">Raccourcis claviers</h4>
                            <p><code>Ctrl</code>+<code>E</code> : Écouter</p>
                            <p><code>Ctrl</code>+<code>D</code> : Télécharger</p>
                            <p><code>Ctrl</code>+<code>B</code> : Emphasis</p>
                            <p><code>Ctrl</code>+<code>P</code> : Spell-out</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>F</code> : Rate fast + Pitch high</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>S</code> : Rate slow + Pitch low</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>1</code> : ⌛</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>2</code> : ⌛⌛</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>3</code> : ⌛⌛⌛</p>
                            <p><code>Ctrl</code>+<code>Maj</code>+<code>4</code> : ⌛⌛⌛⌛</p>
                        </div>
                    </div>
                </div>
            </header>
            <div class="form-group text-container">
                <label for="text">Texte</label>
                <input name="text" type="hidden">
                <div id="text" class="center form-control"></div>
            </div>

            <div class="form-group player-container">
                <audio controls class="w-100" id="audio_player" tabindex="5">
                    Votre navigateur ne supporte pas la balise audio.
                </audio>
            </div>

            <div class="form-group buttons-container text-center">
                <button id="play" type="submit" class="btn btn-info rounded-0 btn-lg mr-4 disabled" data-toggle="tooltip" data-placement="top" title="Ctrl + E" tabindex="3" disabled><i id="play-pause" class="far fa-play-circle"></i> <span class="button-text">Écouter</span>
                    <i class="spinner fas fa-circle-notch fa-spin d-none" style="opacity: 0.75"></i>
                    <span id="equalizer"></span>
                </button>
                <a id="download" class="btn btn-info rounded-0 btn-lg disabled" href="#" target="_blank" data-toggle="tooltip" data-placement="top" title="Ctrl + D" tabindex="4"><i class="far fa-arrow-alt-circle-down"></i> <span class="button-text">Télécharger</span>
                    <i class="spinner fas fa-circle-notch fa-spin d-none" style="opacity: 0.75"></i>
                </a>
                <a class="btn btn-link" data-toggle="collapse" href="#myfiles" role="button" aria-expanded="false" aria-controls="myfiles">
                    <i class="fas fa-history text-info align-middle" style="font-size:26px;" data-toggle="tooltip" data-placement="top" title="Historique"></i>
                </a>
            </div>
            <div class="collapse" id="myfiles">
                <hr class="mt-5">
                <h3 class="h5 w-100"><span class="text-muted">Historique de mes fichiers</span> <a class="float-right h6 p-0 text-right" id="delete-all" href="#">Effacer tout</a></h3>
                <table class="table table-borderless">
                    <tbody>
                    </tbody>
                </table>
            </div>
            <?php $formKey->outputKey(); ?>
        </form>

        <div id="release-notes" class="release-notes mb-4">
            <div class="row release-notes-header">
                <div class="col-6"><h2 class="release-notes-title">Release notes</h2></div>
                <div class="col-6 align-self-center text-right"><a class=" release-notes-link" href="https://cloud.google.com/text-to-speech/docs/release-notes" target="_blank">Voir sur cloud.google.com <i class="fas fa-external-link-alt"></i></a></div>
            </div>
            <div class="row">
                <div class="col-12" style="padding-left: 9px; padding-right: 9px">
                    <!-- Slider main container -->
                    <div class="swiper-container">
                        <!-- Additional required wrapper -->
                        <div class="swiper-wrapper">
                            <!-- Slides -->
                            <?php
                            foreach( get_rss_feed_as_html('https://cloud.google.com/feeds/tts-release-notes.xml', 3, true, 50) as $slide ) {
                                ?>
                                <div class="swiper-slide">
                                    <div class="slide-content">
                                        <?php echo $slide ?>
                                    </div>
                                </div>
                                <?php
                            }
                            ?>
                        </div>
                        <!-- If we need pagination -->
                        <div class="swiper-pagination"></div>

                        <!-- If we need navigation buttons -->
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-button-next"></div>

                    </div>
                </div>
            </div>

        </div>



        <p class="mt-3 mb-3 text-muted text-center copyright">Made with <i class="far fa-heart text-danger"></i> by <a href="https://github.com/CharlieEtienne" target="_blank">Charlie Etienne</a></p>

    </div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://kit.fontawesome.com/fbb35493dc.js" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>
    <script src="/assets/js/highlight.min.js"></script>
    <script src="/assets/js/lity.min.js"></script>
    <script src="/assets/js/quill.js"></script>
    <script src="/assets/js/richVoiceEditor_options.js"></script>
    <script src="/assets/js/richVoiceEditor.js"></script>
    <script src="/assets/js/toastr_options.js"></script>
    <script src="/assets/js/cookies.js"></script>
    <script src="/assets/js/helpers.js"></script>
    <script src="/assets/js/main.js"></script>
</body>
</html>