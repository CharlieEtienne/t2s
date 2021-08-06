# Google-Text-to-Speech-to-mp3
Download mp3 from Google Text to Speech API

This app provides a simple way to convert Google Text to Speech audio to a mp3 file you can download.

## Features

- SSML editor (prosody, emphasis, break, spell-out)
- Syntaxic highlight
- Code editor/visual editor
- Dark mode
- RSS feed of cloud.google.com Text to Speech releases

## Installation

1. Copy files from this repository into your project

2. Run `composer install`

3. Follow [these steps](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries) to configure and activate your api and credentials

4. Copy the content of your credentials file into `PROJECT_NAME.credentials.json` (replace `PROJECT_NAME` with your actual project complicated and secret name)

5. Copy `.env.example` to `.env` and set `GOOGLE_APPLICATION_CREDENTIALS` to the `PROJECT_NAME.credentials.json` actual filename

## Warning

> Please be aware that with this code your credentials may be exposed. If you plan to make this public, you should protect them by renaming, moving the json file and block public access (for example with htaccess methods) to .env file and credentials json file.

## Contributors

- @PabloGuyez
- @CharlieEtienne

## Contribution

Feel free to open issues or PRs!