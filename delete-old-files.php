<?php 

$folderName = __DIR__ . '/audio';

if (file_exists($folderName)) {
    $iterator = new RecursiveDirectoryIterator($folderName);

    // Skip "dot" files
    $iterator->setFlags(RecursiveDirectoryIterator::SKIP_DOTS);

    // Loop through files
    foreach(new RecursiveIteratorIterator($iterator) as $file) {
        if ($file->isFile() && ($file->getExtension() == 'mp3' || $file->getExtension() == 'zip') && time() - $file->getCTime() >= 30*24*60*60) {
            unlink($file->getRealPath());
        }
    }

    // Get directories only
    $directories = new ParentIterator($iterator);

    // Loop over directories and remove empty ones
    foreach (new RecursiveIteratorIterator($directories, RecursiveIteratorIterator::SELF_FIRST) as $dir) {
        // Count the number of "children" from the main directory iterator
        if (iterator_count($iterator->getChildren()) === 0) {
            rmdir($dir->getPathname());
        }
    }
}