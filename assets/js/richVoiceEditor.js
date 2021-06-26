// fetch the toolbar to add handlers
let toolbar = quill.getModule('toolbar');


// SSML break tag
// --------------
// load texts for dropdown items
set_dropdown('ssml_break', 'Break', 'fas fa-pause');
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
    quill_range_button_handler('emphasis', 'strong');
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_emphasis', ssml_emphasis_handler.bind(quill));



// SSML prosody rate tag
// --------------
set_dropdown('ssml_rate', 'Rate', 'fas fa-tachometer-alt')
function ssml_rate_handler(value) {
    quill_range_button_handler('prosody',{'rate':value})
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_rate', ssml_rate_handler.bind(quill));



// SSML prosody pitch tag
// --------------
set_dropdown('ssml_pitch', 'Pitch', 'fas fa-wave-square')
function ssml_pitch_handler(value) {
    quill_range_button_handler('prosody',{'pitch':value});
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_pitch', ssml_pitch_handler.bind(quill));



// SSML say-as tag
// ---------------
// style toolbar button with icon
document.querySelector('.ql-ssml_spellout').innerHTML = '<i class="fas fa-spell-check" title="Spell Out"></i>';
function ssml_spellout_handler() {
    quill_range_button_handler('spellout', 'spell-out');
}
// add tag handler to quill toolbar
toolbar.addHandler('ssml_spellout', ssml_spellout_handler.bind(quill));

document.querySelector('.ql-erase_format').innerHTML = '<i class="fas fa-eraser" title="Effacer les formats"></i>';
/**
 * Remove all styles
 */
function erase_format() {
    let range   = quill.getSelection();

    if (range) {
        // removing all styles applied to the selection
        if (range.length > 0) {
            quill.formatText(range.index, (range.length), {
                    'emphasis': false,
                    'spellout': false,
                    'prosody': false
                })    
            }
        // removing all styles from the current cursor position
        else {
            quill.format('emphasis', false);
            quill.format('spellout', false);
            quill.format('prosody', false)
        }
    }
}
toolbar.addHandler('erase_format', erase_format.bind(quill));


function quill_range_button_handler(type='color', value = false) {
    let range   = quill.getSelection();
    let format  = quill.getFormat(range);

    if (range) {
        if (range.length > 0) {
            if (typeof format[type] === 'object' && typeof value ==='object'){
                let valueContent = Object.entries(value)[0];
                if (format[type][valueContent[0]] === valueContent[1]){
                    quill.formatText(range.index, (range.length), {
                        [type]: {[valueContent[0]] : false}
                    })
                }
                else {
                    quill.formatText(range.index, (range.length), {
                        [type]: {[valueContent[0]] : valueContent[1]}
                    })
                }
            }

            else {
                if(format[type] === value){
                    quill.formatText(range.index, (range.length), {
                        [type]: false
                    });
                }   
                else {
                    quill.formatText(range.index, (range.length), {
                        [type]: value
                    });
            
            }
        }

        }
        else {
            if (typeof format[type] === 'object' && typeof value ==='object'){
                let valueContent = Object.entries(value)[0];
                if (format[type][valueContent[0]] === valueContent[1]){
                    quill.format(
                        type, {[valueContent[0]] : false}
                    )
                }
                else {
                    quill.format(
                        type, {[valueContent[0]] : valueContent[1]}
                    )
                }
            }
            else {
                if(format[type] === value){
                    quill.format(type, false);
                }else {
                    quill.format(type, value);
                }
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
    // fix width and padding problem in quill toolbar for dropdowns
    document.querySelector('.ql-' + method).style.width   = '45px';
    document.querySelector('.ql-' + method).style.padding = '4px 0 0 0';
}

let Inline = Quill.import('blots/inline');

/**
 * Class for <emphasis level="strong"></emphasis>
 */
class EmphasisBlot extends Inline {
    static create() {
        let node = super.create();
        node.setAttribute('level', 'strong');
        return node;
    }

    static formats(node) {
        return node.getAttribute('level');
    }
}
EmphasisBlot.blotName = 'emphasis';
EmphasisBlot.tagName = 'emphasis';

Quill.register(EmphasisBlot);

/**
 * Class for <prosody pitch=""></prosody>
 * or <prosody rate=""></prosody>
 */
class ProsodyBlot extends Inline {
    static create(value) {

        let node = super.create();
        Object.entries(value).forEach(function(item){
            node.setAttribute(item[0],item[1])
        });

        return node;
    }
    static formats(node) {
        return {'pitch':node.getAttribute('pitch'),'rate' :node.getAttribute('rate')};
    }
}
ProsodyBlot.blotName = 'prosody';
ProsodyBlot.tagName = 'prosody';

Quill.register(ProsodyBlot);

/**
 * Class for <say-as interpret-as="spell-out"></say-as>
 */
class SpelloutBlot extends Inline {
    static create() {
        let node = super.create();
        node.setAttribute('interpret-as', 'spell-out');
        return node;
    }

    static formats(node) {
        return node.getAttribute('interpret-as');
    }
}
SpelloutBlot.blotName = 'spellout';
SpelloutBlot.tagName = 'say-as';

Quill.register(SpelloutBlot);

/**
 * Code/text switch
 */
let customButton   = document.querySelector('.ql-showHtml');
let txtArea        = document.createElement('div');
let htmlEditor     = quill.addContainer('ql-custom');
let quillEditor    = document.querySelector('#text');

customButton.innerHTML = '<i class="fas fa-code" title="Basculer entre les vues texte et code"></i>';
txtArea.setAttribute('contenteditable', 'true');
txtArea.style.cssText = "display:none";
txtArea.classList.add("ssml-code");
txtArea.classList.add("language-html");

htmlEditor.appendChild(txtArea);

quill.on('text-change', (delta, oldDelta, source) => {
    txtArea.innerText = quillEditor.children[0].innerHTML.replaceAll('&nbsp;', ' ');
    hljs.configure({
        languages:['html']
    });
    hljs.highlightElement( txtArea );
})


customButton.addEventListener('click', () => {
    if (txtArea.style.display === '') {
        let html = txtArea.innerText;
        self.quill.pasteHTML(html);
    }
    txtArea.style.display = txtArea.style.display === 'none' ? '' : 'none';
    customButton.classList.toggle("active");
});

