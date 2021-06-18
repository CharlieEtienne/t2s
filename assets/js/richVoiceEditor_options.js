const ssmlToolbarOptions = {
    container: [
        [{ 'ssml_break': ['weak', 'strong', 'x-strong'] }],
        ['ssml_emphasis'],
        [{'ssml_rate':['x-slow', 'slow', 'medium', 'fast', 'x-fast']}],
        [{'ssml_pitch':['x-low', 'low', 'medium', 'high', 'x-high']}],
        ['ssml_spellout'],
        ['erase_format']
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
        toolbar: ssmlToolbarOptions,
    },
    placeholder: ''
});

window.quill = quill;

var BackgroundClass = Quill.import('attributors/class/background');
var ColorClass      = Quill.import('attributors/class/color');
var SizeStyle       = Quill.import('attributors/style/size');
Quill.register(BackgroundClass, true);
Quill.register(ColorClass, true);
Quill.register(SizeStyle, true);