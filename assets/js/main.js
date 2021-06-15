$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

const audio         = new Audio();
const equalizer     = $('#equalizer');
const form          = $('#t2s');
const url           = form.attr('action');
const play_btn      = $('#play');
const play_icon     = $('#play>#play-pause');
const download_btn  = $('#download');
const textarea      = $('#text');
const hidden_text_input = document.querySelector('input[name=text]');
const filename      = $('#filename');

textarea.on('change input paste keyup', function(){
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

$(document).ready(function(){
    if(getCookie('last_filename')){
        $('#filename').val(getCookie('last_filename'));
    }
    if(getCookie('last_content')){
        textarea.val(decodeURIComponent(getCookie('last_content')));
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
    if(getCookie('last_new_tab') === 'is_false'){
        $('#new_tab').prop('checked', false);
    }
    if(getCookie('last_audio_file')){
        $('#audio_player').attr("src", decodeURIComponent(getCookie('last_audio_file')) );
    }
    listfiles();
    textarea.trigger('change');
    filename.focus().select();
    $(window).keyup(function (e) {
        let code = (e.keyCode ? e.keyCode : e.which);
        if (code === 9 && $('#text:focus').length) {
            textarea.select();
        }
    });
});

document.addEventListener("keydown", function(event) {
    if (event.ctrlKey && event.code === "KeyE") {
        event.preventDefault();
        $('#play').click();
    }
    if (event.ctrlKey && event.code === "KeyD") {
        event.preventDefault();
        $('#download').click();
    }
});

function setCookies() {
    setCookie('last_filename', filename.val(), 360);
    setCookie('last_content', encodeURIComponent(textarea.val()), 360);
    setCookie('last_voice', $('#voice-name').val(), 360);
    setCookie('last_multiple', 'is_' + $('#multiple').prop('checked'), 360);
    setCookie('last_overwrite', 'is_' + $('#overwrite').prop('checked'), 360);
    setCookie('last_new_tab', 'is_' + $('#new_tab').prop('checked'), 360);
}

/* Listen button */
form.on('submit', function(e){
    e.preventDefault();
    hidden_text_input.value = JSON.stringify(quill.getText(0).replaceAll('\n', '&#13;&#10;'));
    setCookies();
    play_btn.find('.spinner').removeClass('d-none');
    $.ajax({
        method: "POST",
        url: url,
        data: form.serialize(),
        dataType: 'json',
        success: function(response){
            console.log(response);
            if (response.status && response.status === 'error') {
                toastr[response.status](response.message);
            }
            let player = document.getElementById('audio_player');
            $('#audio_player').attr("src", response.filepath + '?' + Date.now() );
            player.play();
            player.focus();
            // if(play_btn.hasClass('playing')){
            //     audio.pause();
            //     audio.currentTime = 0;
            //     equalizer.css('display','none');
            //     play_btn.removeClass('playing');
            //     play_icon.removeClass('fa-pause-circle').addClass('fa-play-circle');
            // }
            // else {
            //     var url = response.filepath;
            //     audio.src = url + '?' + Date.now();
            //     audio.load();
            //     audio.play();
            //     play_btn.addClass('playing');
            //     play_icon.removeClass('fa-play-circle').addClass('fa-pause-circle');
            // }
            play_btn.find('.spinner').addClass('d-none');
            listfiles();
            setCookie('last_audio_file', encodeURIComponent(response.filepath), 360);
        },
        error: function(){
            // console.log(response);
            play_btn.find('.spinner').addClass('d-none');
            toastr['error']('Erreur lors de la requête Ajax');
        }
    });
});

/* Download button */
$(document).on('click', '#download', function (e) {
    e.preventDefault();
    hidden_text_input.value = JSON.stringify(quill.getText(0).replaceAll('\n', '&#13;&#10;'));
    setCookies();
    download_btn.find('.spinner').removeClass('d-none');
    $.ajax({
        method: "POST",
        url: url,
        data: form.serialize() + "&download=1",
        dataType: 'json',
        success: function(response){
            // console.log(response);
            if (response.status && response.status === 'error') {
                toastr[response.status](response.message);
            }
            audio.pause();
            if($('#new_tab').prop('checked')){
                window.open(response.filepath, '_blank');
            }
            else {
                let link = document.createElement("a");
                link.setAttribute('download', '');
                link.href = response.filepath;
                document.body.appendChild(link);
                link.click();
                link.remove();
            }
            setCookie('last_audio_file', encodeURIComponent(response.filepath), 360);
            download_btn.find('.spinner').addClass('d-none');
            listfiles();
        },
        error: function(){
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
                    let html = '';
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
        let button  = $(event.currentTarget);
        let action  = button.data('action');
        let file    = button.data('file');

        if (action && file && action === 'listen') {
            audio.src = file;
            audio.load();
            audio.play();
            button.addClass('playing');
        }
        if (action && file && action === 'download') {
            let link = document.createElement("a");
            link.setAttribute('download', '');
            link.href = file;
            document.body.appendChild(link);
            link.click();
            link.remove();
            // window.open(file, '_blank');
        }
        if (action && file && action === 'remove') {
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