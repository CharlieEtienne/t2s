const ssmlToolbarOptions = {
    container: [
        [{ 'ssml_break': ['x-weak', 'weak', 'strong', 'x-strong'] }],
        ['ssml_emphasis'],
        [{'ssml_rate':['x-slow', 'slow', 'medium', 'fast', 'x-fast']}],
        [{'ssml_pitch':['x-low', 'low', 'medium', 'high', 'x-high']}],
        ['ssml_spellout'],
        ['erase_format'],
        ['showHtml'],
        ['fullscreen']
    ],
    handlers: {
        'ssml_break': function () { },
        'ssml_emphasis': function () { },
        'ssml_rate': function () { },
        'ssml_pitch': function () { },
        'ssml_spellout': function () { },
        'erase_format' : function () { },
        'fullscreen' : function () { }
    }
}

let bindings = {
    bold:   {
        key:      'B',
        shiftKey: false,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill_range_button_handler('emphasis', 'strong');
        }
    },
    fast:       {
        key:      'F',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill_range_button_handler('prosody', {
                'rate': 'fast',
                'pitch': 'high',
            })
        }
    },
    slow:       {
        key:      'S',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill_range_button_handler('prosody', {
                'rate': 'slow',
                'pitch': 'low',
            })
        }
    },
    spellout:   {
        key:      'P',
        shiftKey: false,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill_range_button_handler('spellout', 'spell-out');
        }
    },
    break1:     {
        key:      '1',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            console.log('test');
            quill.insertText(quill.getSelection().index, '⌛');
        }
    },
    break2:     {
        key:      '2',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill.insertText(quill.getSelection().index, '⌛⌛');
        }
    },
    break3:     {
        key:      '3',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill.insertText(quill.getSelection().index, '⌛⌛⌛');
        }
    },
    break4:     {
        key:      '4',
        shiftKey: true,
        ctrlKey:  true,
        handler:  function (range, context) {
            quill.insertText(quill.getSelection().index, '⌛⌛⌛⌛');
        }
    },
    rightarrow: {
        key:      39,  // Right arrow key code in JavaScript
        shiftKey: false,
        ctrlKey:  false,
        handler:  function (range, context) {
            let index = quill.getSelection().index;
            if (quill.getLength() == index + 1) {
                erase_format();
            } else if ((JSON.stringify(quill.getFormat(index, 0)) === JSON.stringify(quill.getFormat(index, 1))) || (JSON.stringify(quill.getFormat(index, 0)) == '{}')) {
                quill.setSelection(index + 1);
            } else {
                erase_format();
            }
        }
    },
    newline:{
        key:      13,  // Enter key code in JavaScript
        shiftKey: false,
        ctrlKey:  false,
        handler:  function (range, context) {
            if (quill.getContents().ops[0].insert[quill.getSelection().index-1]!="\n"){
                quill.insertText(quill.getSelection().index, '\n');
                erase_format();
                }
                else{
                    
                }
        }
    },
    escapefs:{ //press escape leaves fullscreen mode 
        key:      27,  // esc key code in JavaScript
        shiftKey: false,
        ctrlKey:  false,        
        handler: function (range, context) {
            document.body.classList.remove('fullscreen');

            document.getElementById("fsbutton").classList.remove("active");


            document.getElementById('text').removeAttribute('style');
        }
    }
    /*
    leftarrow:{
        key: 37,  // Left arrow key code in JavaScript
        shiftKey: false,
        ctrlKey: false,
        handler: function(range, context) {
            let index=quill.getSelection().index;
            console.log(quill.getFormat(index,0));
            console.log(quill.getFormat(index-1,0));
            if(index==0){
                erase_format();
                console.log('1');
                }
            else if ((JSON.stringify(quill.getFormat(index,0)) !== JSON.stringify(quill.getFormat(index-1,0))) && (JSON.stringify(quill.getFormat(index, 0)) != '{}')){
                quill.setSelection(index-1);
                erase_format();
                console.log('2');          
            }
            else if ((JSON.stringify(quill.getFormat(index,0)) !== JSON.stringify(quill.getFormat(index-1,0))) && (JSON.stringify(quill.getFormat(index-1, 1)) != '{}')){
                quill.setSelection(index+1);
                quill.setSelection(index);
                console.log('5');
            }
            
            else if (JSON.stringify(quill.getFormat(index,0)) !== JSON.stringify(quill.getFormat(index-1,0))){
                console.log('3');
                quill.setSelection(index-1);
                erase_format();  
            }
            else {
                quill.setSelection(index-1);
                console.log('4');
            }
        }
    }*/
};

const quill = new Quill('#text', {
    theme: 'snow',
    modules: {
        syntax: true,
        toolbar: ssmlToolbarOptions,
        keyboard: {
            bindings: bindings
          }
    },
    placeholder: '',
    formats: [
        'emphasis',
        'spellout',
        'prosody',
    ]
});

window.quill = quill;

// Remove tab key binding
delete quill.getModule('keyboard').bindings["9"];

// Remove &nbsp;
quill.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
    delta.forEach(function (ops) {
        ops.insert = ops.insert.replaceAll(/\u00a0/g, ' ');
    });
    return delta;
});