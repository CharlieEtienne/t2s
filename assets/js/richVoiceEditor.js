// fetch the toolbar to add handlers
let toolbar = quill.getModule('toolbar');


// SSML break tag
// --------------
// load texts for dropdown items
let breakPickerItems = Array.prototype.slice.call(document.querySelectorAll('.ql-ssml_break .ql-picker-item'));
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
        let cursorPosition = quill.getSelection().index;
        // insert the single tag
        switch (value){
            case 'x-weak':
                quill.insertText(cursorPosition, '⌛');
                break;
            case 'weak':
                quill.insertText(cursorPosition, '⌛⌛');
                break;
            case 'strong':
                quill.insertText(cursorPosition, '⌛⌛⌛');
                break;
            case 'x-strong':
                quill.insertText(cursorPosition, '⌛⌛⌛⌛');
                break;
            default :
                break;
        }
    }
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_break', ssml_break_handler.bind(quill));

// SSML emphasis tag
// -----------------
// style toolbar button with icon
document.querySelector('.ql-ssml_emphasis').innerHTML = '<i class="fas fa-volume-up" title="Emphasis"></i>';
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
    quill_range_button_handler('pitch_' + value, 'background');
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

document.querySelector('.ql-erase_format').innerHTML = '<i class="fas fa-eraser" title="Eraser"></i>';
function erase_format() {
    // get current selected text as range
    let range   = quill.getSelection();
    // only if range is currently selected
    if (range) {
        // only if it is a range and not a position
        // removing all styles applied to the selection
        if (range.length > 0) {
            quill.formatText(range.index, (range.length), {
                    'color':      false,
                    'bold':       false,
                    'italic':     false,
                    'strike':     false,
                    'underline':  false,
                    'font':       false,
                    'size':       false,
                    'background': false
                }
            );
        }
    }
}
toolbar.addHandler('erase_format', erase_format.bind(quill));


function quill_range_button_handler(color, type='color') {
    // get current selected text as range
    let range   = quill.getSelection();
    let format  = quill.getFormat(range);

    // only if range is currently selected
    if (range) {
        // only if it is a range and not a position
        if (range.length > 0) {
            if(format[type] === color){
                quill.formatText(range.index, (range.length), {
                    [type]: false
                });
            }else {
                quill.formatText(range.index, (range.length), {
                    [type]: color
                });
            }
        }
        else {
            if(format[type] === color){
                quill.format(type, false);
            }else {
                quill.format(type, color);
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