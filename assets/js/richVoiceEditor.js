// fetch the toolbar to add handlers
let toolbar = quill.getModule('toolbar');

quill.getModule("toolbar").container.addEventListener("mousedown", (e) => {
    e.preventDefault();
    if(document.getElementById("code").classList.contains("active") && quill.getSelection()==null){
        copySelection();
    }
  });
// Replace format with appropriate SSML tags
function style_to_code() {

    let code = quill.root.innerHTML;
    
    code = code.replaceAll('<p><br></p>', '');
    code = code.replaceAll('&nbsp;', ' ');


    //Changing Hourglass to Break tags
    code = code.replaceAll('⌛⌛⌛⌛', '<break strength="x-strong"/>');
    code = code.replaceAll('⌛⌛⌛', '<break strength="strong"/>');
    code = code.replaceAll('⌛⌛', '<break strength="weak"/>');
    code = code.replaceAll('⌛', '<break strength="x-weak"/>');

    return(code);
}

// Copy selection from code text area to quill 
function getCaretCharacterOffsetWithin(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ( (sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}
function count(startindex, txtarea){
    let count = 0;
    let inTag=false;
    for(let i=0; i<startindex; i++){
        if ((txtarea.textContent)[i] =='>'){
            count+=1;
            inTag=false;
        }
        else if ((txtarea.textContent)[i] =='<'){
            count+=1;
            inTag=true;
        }
        else if (inTag==true){
            count+=1;
        }
        
    }
    return(count);
}
function copySelection(){
    let length = window.getSelection().toString().length;
    let startIndex = getCaretCharacterOffsetWithin(txtArea)-length;
    startIndex = startIndex - count(startIndex,txtArea);
    
    quill.setSelection(startIndex, length);
    
}

// SSML break tag
// --------------
// load texts for dropdown items
set_dropdown('ssml_break', 'Break', 'fas fa-pause');
function ssml_break_handler(value) {
    // only if a position is currently selected
    if (value) {
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
document.querySelector('.ql-ssml_emphasis').innerHTML = '<i id="emphasis" class="fas fa-volume-up" title="Emphasis (ctrl+B)"></i>';
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
document.querySelector('.ql-ssml_spellout').innerHTML = '<i id="spellout" class="fas fa-spell-check" title="Spell Out (ctrl+P)"></i>';
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


// Function to turn on and off fullscreen mode 
document.querySelector('.ql-fullscreen').innerHTML = '<i id="fsbutton" class="fas fa-expand" title="Plein écran"></i>';

function fullscreen () {
    document.getElementById('text').removeAttribute('style');
    document.body.classList.toggle('fullscreen');
    document.getElementById("fsbutton").classList.toggle("active");
}
toolbar.addHandler('fullscreen', fullscreen.bind(quill));


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
                    let newFormat = format[type];
                    newFormat[valueContent[0]]= valueContent[1];
                    quill.formatText(range.index, (range.length), {
                        [type]: newFormat
                    })
                }
                if (quill.getFormat(quill.getSelection())['prosody'].rate != ("x-slow" || "slow" || "fast" || "x-fast") && quill.getFormat(quill.getSelection())['prosody'].pitch != ("x-low" || "low" || "high" || "x-high")) {
                    quill.formatText(range.index, (range.length), {
                        'prosody' : false
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
                if (quill.getFormat(quill.getSelection())['prosody'].rate != ("x-slow" || "slow" || "fast" || "x-fast") && quill.getFormat(quill.getSelection())['prosody'].pitch != ("x-low" || "low" || "high" || "x-high")) {
                    quill.format('prosody',false)
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

customButton.innerHTML = '<i id="code" class="fas fa-code" title="Basculer entre les vues texte et code"></i>';
txtArea.setAttribute('contenteditable', 'true');
txtArea.id = "codeEditor";
txtArea.style.cssText = "display:none";
txtArea.classList.add("ssml-code");
txtArea.classList.add("language-html");

htmlEditor.appendChild(txtArea);

function hljsInit() {
    hljs.configure({
        languages: ['html']
    });
    hljs.highlightElement(txtArea);
}

quill.on('text-change', (delta, oldDelta, source) => {
    txtArea.innerText = quillEditor.children[0].innerHTML.replaceAll('&nbsp;', ' ').replaceAll('<p><br></p>', '');
    hljsInit();
})


customButton.addEventListener('click', () => {
    if (txtArea.style.display === '') {
        let html = txtArea.innerText;
        self.quill.pasteHTML(html);
    }
    txtArea.style.display = txtArea.style.display === 'none' ? '' : 'none';
    customButton.classList.toggle("active");
    document.getElementById("code").classList.toggle("active");
});

//Coloring buttons when format is active
function updateButtons(){
    let format = quill.getFormat(quill.getSelection());


    if (format.emphasis == "strong"){
        document.getElementById("emphasis").classList.add("active");
    }
    else{
        document.getElementById("emphasis").classList.remove("active");
    }

    if (format.spellout == "spell-out"){
        document.getElementById("spellout").classList.add("active");
    }
    else {
        document.getElementById("spellout").classList.remove("active");
    }
    
    if (format.prosody != undefined){
        if (quill.getFormat(quill.getSelection()).prosody.pitch!=null) {
            document.getElementsByClassName("fa-wave-square")[0].classList.add("active");
        }
        else {
            document.getElementsByClassName("fa-wave-square")[0].classList.remove("active");
        }

        if (quill.getFormat(quill.getSelection()).prosody.rate!=null) {
            document.getElementsByClassName("fa-tachometer-alt")[0].classList.add("active");
        }
        else {
            document.getElementsByClassName("fa-tachometer-alt")[0].classList.remove("active");
        }
    }
    else {
        document.getElementsByClassName("fa-wave-square")[0].classList.remove("active");
        document.getElementsByClassName("fa-tachometer-alt")[0].classList.remove("active");
    }
}