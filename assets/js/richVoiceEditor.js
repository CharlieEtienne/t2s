// fetch the toolbar to add handlers
var toolbar = quill.getModule('toolbar');

// add semantic ui icons to html for own buttons
var fileref = document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");
fileref.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/components/icon.min.css");
document.getElementsByTagName("head")[0].appendChild(fileref);


// SSML break tag
// --------------
// load texts for dropdown items
var breakPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_break .ql-picker-item'));
breakPickerItems.forEach(function (item) {
    return item.textContent = item.dataset.value;
});
// style toolbar button with icon and keep dropdown values
document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML = '<i class="pause icon" title="Break"></i>' + document.querySelector('.ql-ssml_break .ql-picker-label').innerHTML;
// fix withd and padding problem in quill toolbar for dropdowns
document.querySelector('.ql-ssml_break').style.width = '45px';
document.querySelector('.ql-ssml_break').style.padding = '4px 0 0 0';
function ssml_break_handler(value) {
    // only if a position is currently selected
    if (value) {
        // get the current position idndex
        var cursorPosition = quill.getSelection().index;
        // insert the single tag
        quill.insertText(cursorPosition, '⌛')
    }
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_break', ssml_break_handler.bind(quill));

// SSML emphasis tag
// -----------------
// style toolbar button with icon
document.querySelector('.ql-ssml_emphasis').innerHTML = '<i class="volume up icon" title="Emphasis"></i>';
function ssml_emphasis_handler() {
    quill_range_button_handler('emphasis');
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_emphasis', ssml_emphasis_handler.bind(quill));



// SSML prosody rate tag
// --------------
set_dropdown('ssml_rate', 'Rate', 'fas fa-tachometer-alt')
function ssml_rate_handler(value) {
    quill_range_button_handler('rate_' + value);
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_rate', ssml_rate_handler.bind(quill));

// SSML prosody pitch tag
// --------------
set_dropdown('ssml_pitch', 'Pitch', 'fas fa-wave-square')
function ssml_pitch_handler(value) {
    quill_range_button_handler('pitch_' + value);
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_pitch', ssml_pitch_handler.bind(quill));



// SSML say-as tag
// ---------------
// style toolbar button with icon and keep dropdown values
document.querySelector('.ql-ssml_spellout').innerHTML = '<i class="fas fa-spell-check" title="Spell Out"></i>';
function ssml_spellout_handler() {
    quill_range_button_handler('spellout');
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_spellout', ssml_spellout_handler.bind(quill));

// SSML say-as (date) tag
// ----------------------
// load texts for dropdown items
// var datePickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_date .ql-picker-item'));
// datePickerItems.forEach(function (item) {
//     return item.textContent = item.dataset.value;
// });
// // style toolbar button with icon and keep dropdown values
// document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML = '<i class="calendar alternate outline icon" title="Date"></i>' + document.querySelector('.ql-ssml_date .ql-picker-label').innerHTML;
// // fix withd and padding problem in quill toolbar for dropdowns
// document.querySelector('.ql-ssml_date').style.width = '45px';
// document.querySelector('.ql-ssml_date').style.padding = '4px 0 0 0';
// function ssml_date_handler(value) {
//     // get current selected text as range
//     var range = quill.getSelection();
//     // only if range is currently selected
//     if (range) {
//         // only if it is a range and not a position
//         if (range.length > 0) {
//
//
//             // add tag at the end of the selected range
//             quill.insertText(range.index + range.length, '</say-as>');
//             // add tag at the beginning of the selected range
//             quill.insertText(range.index, '<say-as interpret-as="date" format="' + value + '">');
//             // set cursor position to the end of new tag
//             quill.setSelection(range.index + range.length + value.length + 47);
//
//         }
//     }
// }
// add tag handler to quill toolbar
// toolbar.addHandler('ssml_date', ssml_date_handler.bind(quill));




function quill_range_button_handler(color) {
    // get current selected text as range
    let range   = quill.getSelection();
    let format  = quill.getFormat(range);

    // only if range is currently selected
    if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
            if(format.color === color){
                quill.formatText(range.index, (range.length), {
                    'color': false
                });
            }else {
                quill.formatText(range.index, (range.length), {
                    'color': color
                });
            }
        }
        else {
            if(format.color === color){
                quill.format('color', false);
            }else {
                quill.format('color', color);
            }

        }
    }
}

// Toolbar custom dropdown
function set_dropdown(method, title, icon) {
    // load texts for dropdown items
    let Items = Array.prototype.slice.call(document.querySelectorAll('.ql-' + method + ' .ql-picker-item'));
    Items.forEach(function (item) {
        return item.textContent = item.dataset.value;
    });
    // style toolbar button with icon and keep dropdown values
    document.querySelector('.ql-' + method + ' .ql-picker-label').innerHTML = '<i class="' + icon + '" title="' + title + '"></i>' + document.querySelector('.ql-' + method + ' .ql-picker-label').innerHTML;
    // fix withd and padding problem in quill toolbar for dropdowns
    document.querySelector('.ql-' + method).style.width   = '45px';
    document.querySelector('.ql-' + method).style.padding = '4px 0 0 0';
}