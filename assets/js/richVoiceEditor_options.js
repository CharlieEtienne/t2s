const ssmlToolbarOptions = {
    container: [
        [{ 'ssml_break': ['x-weak', 'weak', 'strong', 'x-strong'] }],
        ['ssml_emphasis'],
        [{'ssml_rate':['x-slow', 'slow', 'medium', 'fast', 'x-fast']}],
        [{'ssml_pitch':['x-low', 'low', 'medium', 'high', 'x-high']}],
        ['ssml_spellout'],
        ['erase_format'],
        ['showHtml']
        // [{ 'ssml_date': ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y'] }],
    ],
    handlers: {
        'ssml_break': function () { },
        'ssml_emphasis': function () { },
        'ssml_rate': function () { },
        'ssml_pitch': function () { },
        'ssml_spellout': function () { },
        'erase_format' : function () { }
        // 'ssml_date': function () { },
    }
}

const quill = new Quill('#text', {
    theme: 'snow',
    modules: {
        syntax: true,
        toolbar: ssmlToolbarOptions,
    },
    placeholder: '',
    formats: [
        'emphasis',
        'spellout',
        'prosody',
    ]
});

window.quill = quill;

let BackgroundClass = Quill.import('attributors/class/background');
let ColorClass      = Quill.import('attributors/class/color');
let SizeStyle       = Quill.import('attributors/style/size');
Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);

delete quill.getModule('keyboard').bindings["9"];

quill.clipboard.addMatcher(Node.TEXT_NODE, function(node, delta) {
    delta.forEach(function (ops) {
        ops.insert = ops.insert.replaceAll(/\u00a0/g, ' ');
    });
    return delta;
});