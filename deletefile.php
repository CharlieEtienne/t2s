<?php
if (isset($_POST['file'])) {
    $file = __DIR__ . stripslashes($_POST['file']);
    if(is_file($file)) {
        unlink($file);
        echo json_encode ([
            'status'    => 'success',
            'message'   => 'Le fichier a bien été supprimé'
        ]);
    }
    else {
        echo json_encode ([
            'status'    => 'error',
            'message'   => 'Le fichier n\'est pas valide ou n\'existe pas'
        ]);
    }
}
elseif (isset($_POST['all'])) {
    if (!isset($_COOKIE['t2s'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Aucun fichier récent à supprimer'
        ]);
    }
    else {
        $root               = __DIR__ . '/audio/';
        $directory          = $_COOKIE['t2s'];
        $user_dir           = $root . $directory;
        $relative_user_dir  = '/audio/' . $directory . '/';

        if (file_exists($user_dir)) {
            $iterator = new RecursiveDirectoryIterator($user_dir);
            
            $files                      = [];
            $files['files']             = [];
            $files['relative_user_dir'] = $relative_user_dir;
            $i = 0;
            // Loop through files
            foreach(new RecursiveIteratorIterator($iterator) as $file) {
                if ($file->isFile() && ($file->getExtension() == 'mp3' || $file->getExtension() == 'zip')) {
                    unlink($file->getRealPath());
                    $i++;
                }
            }
            
            if( $i > 0 ){
                echo json_encode ([
                    'status'    => 'success',
                    'message'   => $i . 'fichiers ont bien été supprimés'
                ]);
            }
            else {
                echo json_encode([
                    'status' => 'warning',
                    'message' => 'Aucun fichier récent à supprimer'
                ]);
            }
        }
        else {
            echo json_encode([
                'status' => 'error',
                'message' => 'Aucun fichier récent à supprimer'
            ]);
        }
    }
}
else {
    echo json_encode ([
        'status'    => 'error',
        'message'   => 'Erreur inconnue'
    ]);
}