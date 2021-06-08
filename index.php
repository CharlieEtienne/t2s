<?php
    if(!isset($_COOKIE['t2s'])){
        setcookie('t2s', uniqid(), time() + 365*24*3600, null, null, false, true); 
    }
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
    <meta name="application-name" content="app">
    <meta name="apple-mobile-web-app-title" content="app">
    <meta name="theme-color" content="#3e28a9">
    <meta name="msapplication-navbutton-color" content="#3e28a9">
    <meta name="apple-mobile-web-app-status-bar-style" content="#3e28a9">
    <meta name="msapplication-starturl" content="/">
    <link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
    <link rel="apple-touch-icon" type="image/png" sizes="192x192" href="icon-192.png">
    <link rel="manifest" href="manifest.json">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Nunito&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/css/toastr.min.css" rel="stylesheet">
    <script src="https://kit.fontawesome.com/fbb35493dc.js" crossorigin="anonymous"></script>
    <style>
        body {
            display: -ms-flexbox;
            display: flex;
            -ms-flex-align: center;
            align-items: center;
            padding-top: 10px;
            background-color: #f8f7fc;
            font-family: 'Nunito', sans-serif;
        }
        #t2s {
            width: 100%;
            max-width: 600px;
            padding: 15px;
            margin: auto;
        }
        #equalizer {
            position: relative;
            background-image: url(ani_equalizer_white.gif);
            background-size: cover;
            background-position: center;
            width: 26px;
            height: 16px;
            display: none;
        }
        button.disabled {
            cursor:default;
        }
        .custom-control-input:checked~.custom-control-label::before{
            background-color:#3e28a9;
            border-color:#3e28a9;
        }
        .btn-info {
            background-color: #3e28a9;
            border-color: #3e28a9;
        }
        .btn-link {
            color: #3e28a9;
        }
        .btn-link:hover {
            color: #2e1e80;
        }
        .btn-info:hover {
            background-color: #2e1e80;
            border-color: #2e1e80;
        }
        .btn-info.disabled, .btn-info:disabled {
            background-color: #3e28a9;
            border-color: #3e28a9;
        }
        .btn-info.focus, .btn-info:focus {
            background-color: #3e28a9;
            border-color: #3e28a9;
            box-shadow: 0 0 0 0.2rem rgba(62, 40, 169, 0.5);
        }
        .btn.focus, .btn:focus {    
            box-shadow: 0 0 0 0.2rem rgba(62, 40, 169, .25);
        }
        .btn-info:not(:disabled):not(.disabled).active, .btn-info:not(:disabled):not(.disabled):active, .show>.btn-info.dropdown-toggle {
            background-color: #2e1e80;
            border-color: #2e1e80;
        }
        .text-info {
            color: #3e28a9!important;
        }
        a {
            color: #6049d4;
        }
        a:hover {
            color: #8473de;
            text-decoration: underline;
        }
        .form-control:focus {
            border-color: rgba(62, 40, 169, 0.1);
            box-shadow: 0 0 0 0.2rem rgba(62, 40, 169, 0.25);
        }
        .custom-control-input:focus~.custom-control-label::before {
            box-shadow: 0 0 0 0.2rem rgba(62, 40, 169, 0.25);
        }
        @media(max-width:500px) {
            h1.h3 {
                font-size: 1.5rem;
            }
        }
        .table td, .table th {
            vertical-align: middle;
        }
        .actions>button {
            padding: 0 3px;
        }
        .actions {
            min-width: 96px;
        }
        .actions .btn-link.disabled, .actions .btn-link:disabled {
            color: #3e28a9;
            opacity: .45;
        }
    </style>
</head>
<body class="pt-md-5 pt-3">
    <div class="container">
        
        <form id="t2s" method="POST" action="process.php">
            
            <h1 class="h3 mb-5 mt-lg-5 font-weight-bold text-center" style="color: rgba(0, 0, 0, 0.75);">
                <img src="icon-192.png" class="mb-1 mr-3" style="width: 2rem;">
                Google TextToSpeech 2 mp3
            </h1>
    
            <div class="form-row">
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
                        <option value="fr-FR-Wavenet-A">fr-FR-Wavenet-A (Femme)</option>
                        <option value="fr-FR-Wavenet-B">fr-FR-Wavenet-B (Homme)</option>
                        <option value="fr-FR-Wavenet-C">fr-FR-Wavenet-C (Femme)</option>
                        <option value="fr-FR-Wavenet-D">fr-FR-Wavenet-D (Homme)</option>
                        <option value="fr-FR-Wavenet-E">fr-FR-Wavenet-E (Femme)</option>
                        <option value="en-US-Wavenet-A">en-US-Wavenet-A (Homme)</option>
                        <option value="en-US-Wavenet-B">en-US-Wavenet-B (Homme)</option>
                        <option value="en-US-Wavenet-C">en-US-Wavenet-C (Femme)</option>
                        <option value="en-US-Wavenet-D">en-US-Wavenet-D (Homme)</option>
                        <option value="en-US-Wavenet-E">en-US-Wavenet-E (Femme)</option>
                        <option value="en-US-Wavenet-F">en-US-Wavenet-F (Femme)</option>
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
                </div>
            </div>
            
            <div class="form-group">
                <label for="text">Texte</label>
                <textarea  class="form-control" rows="10" type="text" name="text" id="text" tabindex="2"></textarea>
            </div>
            
            <div class="form-group text-center">
                <button id="play" type="submit" class="btn btn-info rounded-0 btn-lg mr-4 disabled" data-toggle="tooltip" data-placement="top" title="Ctrl + P" tabindex="3" disabled><i id="play-pause" class="far fa-play-circle"></i> Écouter
                    <i class="spinner fas fa-circle-notch fa-spin d-none" style="opacity: 0.75"></i>
                    <span id="equalizer"></span>
                </button>
                <a id="download" class="btn btn-info rounded-0 btn-lg disabled" href="#" target="_blank" data-toggle="tooltip" data-placement="top" title="Ctrl + D" tabindex="4"><i class="far fa-arrow-alt-circle-down"></i> Télécharger
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
        </form>


        <p class="mt-3 mb-3 text-muted text-center">Made with <i class="far fa-heart text-danger"></i> by <a href="https://github.com/CharlieEtienne" target="_blank">Charlie Etienne</a></p>
        
    </div>

    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/js/toastr.min.js" crossorigin="anonymous"></script>
    <script>
        $(function () {
            $('[data-toggle="tooltip"]').tooltip()
        });



        toastr.options = {
            "closeButton": true,
            "debug": false,
            "newestOnTop": false,
            "progressBar": false,
            "positionClass": "toast-top-right",
            "preventDuplicates": false,
            "onclick": null,
            "showDuration": "300",
            "hideDuration": "1000",
            "timeOut": "5000",
            "extendedTimeOut": "1000",
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        }

        var audio           = new Audio();
        var equalizer       = $('#equalizer');
        var form            = $('#t2s');
        var url             = form.attr('action');
        var play_btn        = $('#play');
        var play_icon       = $('#play>#play-pause');
        var download_btn    = $('#download');
        var textarea        = $('#text');

        textarea.on('change input paste keyup', function(e){
            // textarea is not empty
            if ($.trim(textarea.val())) {
                play_btn.removeClass('disabled').removeAttr('disabled');
                download_btn.removeClass('disabled').removeAttr('disabled');
            }
            else {
                play_btn.addClass('disabled').attr("disabled", true);
                download_btn.addClass('disabled').attr("disabled", true);
            }
        });

        audio.onplaying = function() { equalizer.css('display','inline-block'); };
        audio.onended = function() { 
            this.currentTime = 0; 
            equalizer.css('display','none');
            play_btn.removeClass('playing');
            play_icon.removeClass('fa-pause-circle').addClass('fa-play-circle'); 
        };
        audio.onpause = function() { 
            this.currentTime = 0; 
            equalizer.css('display','none');
            play_btn.removeClass('playing');
            play_icon.removeClass('fa-pause-circle').addClass('fa-play-circle');
        };

        $(document).ready(function(e){
            if(getCookie('last_filename')){
                $('#filename').val(getCookie('last_filename'));
            }
            if(getCookie('last_content')){
                $('#text').val(decodeURIComponent(getCookie('last_content')));
            }
            if(getCookie('last_voice')){
                $('#voice-name').val(getCookie('last_voice'));
            }
            if(getCookie('last_multiple') === 'is_false'){
                $('#multiple').prop('checked', false);
            }
            if(getCookie('last_overwrite') === 'is_false'){
                $('#overwrite').prop('checked', false);
            }
            listfiles();
            $('#text').trigger('change');
            $('#filename').focus().select();
            $('#text').on('focus', function() { $(this).select(); });
        });

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        document.addEventListener("keydown", function(event) {
            if (event.ctrlKey && event.code === "KeyP") {
                event.preventDefault();
                $('#play').click();
            }
            if (event.ctrlKey && event.code === "KeyD") {
                event.preventDefault();
                $('#download').click();
            }
        });
        
        /* Listen button */
        $('#t2s').on('submit', function(e){
            e.preventDefault();
            setCookie('last_filename', $('#filename').val(), 360);
            setCookie('last_content', encodeURIComponent($('#text').val()), 360);
            setCookie('last_voice', $('#voice-name').val(), 360);
            setCookie('last_multiple', 'is_' + $('#multiple').prop('checked'), 360);
            setCookie('last_overwrite', 'is_' + $('#overwrite').prop('checked'), 360);
            play_btn.find('.spinner').removeClass('d-none');
            $.ajax({ 
                method: "POST",
                url: url, 
                data: form.serialize(),
                dataType: 'json',
                success: function(response){
                    // console.log(response);
                    if (response.status && response.status == 'error') {
                        toastr[response.status](response.message);
                    }
                    if(play_btn.hasClass('playing')){
                        audio.pause();
                        audio.currentTime = 0; 
                        equalizer.css('display','none');
                        play_btn.removeClass('playing');
                        play_icon.removeClass('fa-pause-circle').addClass('fa-play-circle');
                    }
                    else {
                        var url = response.filepath;
                        audio.src = url + '?' + Date.now();
                        audio.load();
                        audio.play();
                        play_btn.addClass('playing');
                        play_icon.removeClass('fa-play-circle').addClass('fa-pause-circle');
                    }
                    play_btn.find('.spinner').addClass('d-none');
                    listfiles();
                },
                error: function(response){
                    // console.log(response);
                    play_btn.find('.spinner').addClass('d-none');
                    toastr['error']('Erreur lors de la requête Ajax');
                }
            });
        });

        /* Download button */
        $(document).on('click', '#download', function (e) {
            e.preventDefault();
            setCookie('last_filename', $('#filename').val(), 360);
            setCookie('last_content', encodeURIComponent($('#text').val()), 360);
            setCookie('last_voice', $('#voice-name').val(), 360);
            setCookie('last_multiple', $('#multiple').val(), 360);
            setCookie('last_overwrite', $('#overwrite').val(), 360);
            download_btn.find('.spinner').removeClass('d-none');
            $.ajax({ 
                method: "POST",
                url: url, 
                data: form.serialize() + "&download=1",
                dataType: 'json',
                success: function(response){
                    // console.log(response);
                    if (response.status && response.status == 'error') {
                        toastr[response.status](response.message);
                    }
                    audio.pause();
                    var link = document.createElement("a");
                    link.setAttribute('download', '');
                    link.href = response.filepath;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    // window.open(response.filepath, '_blank');
                    download_btn.find('.spinner').addClass('d-none');
                    listfiles();
                },
                error: function(response){
                    // console.log(response);
                    download_btn.find('.spinner').addClass('d-none');
                    toastr['error']('Erreur lors de la requête Ajax');
                }
            });
        });

        /* Get user's old files list */
        function listfiles() {
            myfilestable = $('#myfiles>table>tbody');
            $.ajax({ 
                method: "GET",
                url: '/getfiles.php',
                dataType: 'json',
                success: function(response){
                    $('#myfiles>.no-files').remove();
                    myfilestable.html('');
                    // console.log(response);
                    if (response.status && response.status == 'error') {
                        toastr[response.status](response.message);
                    }
                    if (response && response.files) {
                        Object.values(response.files).forEach((file) => {
                            html = '';
                            html += '<tr id="' + file.id + '">';
                            html += '<td>';
                            html += file.type == 'mp3' ? '<i class="far fa-file-audio text-muted fa-2x"></i>' : '<i class="far fa-file-archive text-muted fa-2x"></i>';
                            html += '</td>';
                            html += '<td>';
                            html += '<a href="' + response.relative_user_dir + file.name + '" target="_blank">' + file.name + '</a>';
                            html += '</td>';
                            html += '<td class="text-muted">' + file.date + '</td>';
                            html += '<td class="actions text-right">';
                            html += file.type == 'mp3' ? '<button type="button" data-action="listen" data-file="' + response.relative_user_dir + file.name + '" class="btn btn-link pb-0 pt-0 action-btn listen"><i class="fas fa-play"></i></button>' : '<button type="button" data-action="listen" data-file="" class="btn btn-link pb-0 pt-0 action-btn listen disabled"><i class="fas fa-play"></i></button>';
                            html += '<button type="button" data-action="download" data-file="' + response.relative_user_dir + file.name + '" class="btn btn-link pb-0 pt-0 action-btn download" download><i class="fas fa-download"></i></button>';
                            html += '<button type="button" data-action="remove" data-file="' + response.relative_user_dir + file.name + '" class="btn btn-link pb-0 pt-0 action-btn remove"><i class="far fa-trash-alt" aria-hidden="true"></i></button>';
                            html += '</td>';
                            html += '</tr>';

                            myfilestable.append(html);
                        });
                        if(response.files.length == 0){
                            $('#myfiles>.no-files').remove();
                            $('#myfiles>table').before('<div class="no-files text-center p-4 text-muted">Aucun fichier récent</div>');
                        }
                        initActions();
                    }
                },
                error: function(response){
                    console.log(response);
                    toastr['error']('Erreur lors de la requête Ajax');
                }
            });
        }

        /* Initialize actions for files history */
        function initActions() {
            $( document ).off( "click", ".action-btn" );
            $(document).on('click', '.action-btn', function (event) {
                event.stopPropagation();
                var button  = $(event.currentTarget);
                var action  = button.data('action');
                var file    = button.data('file');
                
                if (action && file && action == 'listen') {
                    audio.src = file;
                    audio.load();
                    audio.play();
                    button.addClass('playing');
                }
                if (action && file && action == 'download') {
                    var link = document.createElement("a");
                    link.setAttribute('download', '');
                    link.href = file;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                    // window.open(file, '_blank');
                }
                if (action && file && action == 'remove') {
                    deleteFile(file);
                }
            });
        }

        $(document).on('click', '#delete-all', function (event) {
            $.ajax({ 
                method: "POST",
                url: 'deletefile.php', 
                data: {'all' : 1},
                dataType: 'json',
                success: function(response){
                    console.log(response);
                    toastr[response.status](response.message);
                    listfiles();
                },
                error: function(response){
                    console.log(response);
                    toastr['error']('Erreur lors de la requête Ajax');
                }
            });
        });

        function deleteFile(file) {
            $.ajax({ 
                method: "POST",
                url: 'deletefile.php', 
                data: {'file' : file},
                dataType: 'json',
                success: function(response){
                    console.log(response);
                    toastr[response.status](response.message);
                    listfiles();
                },
                error: function(response){
                    console.log(response);
                    toastr['error']('Erreur lors de la requête Ajax');
                }
            });
        }
    </script>
</body>
</html>