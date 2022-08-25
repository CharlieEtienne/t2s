<?php
// ini_set('display_errors', 1);
// ini_set('display_startup_errors', 1);
// error_reporting(E_ALL);

ob_start();

require __DIR__ . '/vendor/autoload.php';

if (!isset($_COOKIE['t2s'])) {
    echo json_encode([
        'message' => 'Aucun fichier récent'
    ]);
}

$root               = __DIR__ . '/audio/';
$directory          = htmlspecialchars($_COOKIE['t2s']);
$user_dir           = $root . $directory;
$relative_user_dir  = '/audio/' . $directory . '/';

if (file_exists($user_dir)) {
    $iterator = new RecursiveDirectoryIterator($user_dir);
    
    $files                      = [];
    $files['files']             = [];
    $files['relative_user_dir'] = $relative_user_dir;
    
    // Loop through files
    foreach(new RecursiveIteratorIterator($iterator) as $file) {
        if ($file->isFile() && ($file->getExtension() == 'mp3' || $file->getExtension() == 'zip')) {
            $files['files'][] = [
                'name'  => $file->getFilename(),
                'date'  => date("d/m/Y H:i", filemtime($file->getPathname())),
                'id'    => $file->getBasename('.'.$file->getExtension()), 
                'type'  => $file->getExtension()
            ];
        }
    }

    usort($files['files'], function( $a, $b ) {
        return strtotime($b["date"]) - strtotime($a["date"]);
    });
     
    echo json_encode($files);
}
else {
	echo json_encode(
		[
			'message' => 'Le dossier utilisateur n\'existe pas encore'
		]);
}