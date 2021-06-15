const ssmlToolbarOptions = {
    container: [
        // ['ssml_speak'],
        [{ 'ssml_break': ['weak', 'strong', 'x-strong'] }],
        ['ssml_emphasis'],
        // ['ssml_whispering'],
        [{ 'ssml_language': ['en-US', 'en-GB', 'de-DE', 'es-ES', 'fr-FR', 'it-IT'] }],
        // ['ssml_paragraph'],
        [{ 'ssml_sayas': ['spell-out', 'number', 'ordinal', 'digits', 'fraction', 'expletive'] }],
        [{ 'ssml_date': ['mdy', 'dmy', 'ymd', 'md', 'dm', 'ym', 'my', 'd', 'm', 'y'] }],
        // ['ssml_substitute'],
        // ['ssml_breaths'],
        // ['ssml_phoneme'],
        // ['ssml_parse'],
        // ['ssml_validate']
    ],
    handlers: {
        // 'ssml_speak': function () { },
        'ssml_break': function () { },
        'ssml_emphasis': function () { },
        'ssml_language': function () { },
        // 'ssml_paragraph': function () { },
        'ssml_sayas': function () { },
        'ssml_date': function () { },
        // 'ssml_substitute': function () { },
        // 'ssml_breaths': function () { },
        // 'ssml_phoneme': function () { },
        // 'ssml_whispering': function () { },
        // 'ssml_parse': function () { },
        // 'ssml_validate': function () { }
    }
}

Quill.register({
    'modules/rich-voice-editor': RichVoiceEditor
})

const quill = new Quill('#text', {
    theme: 'snow',
    modules: {
        toolbar: ssmlToolbarOptions,
        'rich-voice-editor': true
    },
    placeholder: ''
});