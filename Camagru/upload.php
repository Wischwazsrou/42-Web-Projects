<?php

    include "header.php";
    include "logged.php";

    $maxsize = 1048576;
    $error = "";
    $login = $_SESSION['login']['login'];
    if ($_FILES['upload']['error'] > 0) $error = "Erreur lors du transfert";
    if ($_FILES['upload']['size'] > $maxsize) $error = "Le fichier est trop gros";
    $file_name = $_FILES['upload']['tmp_name'];

    $valid = 0;
    $extensions_valid = array( 'jpg' , 'jpeg' , 'gif' , 'png' );
    $extension_upload = strtolower(  substr(  strrchr($_FILES['upload']['name'], '.')  ,1)  );
    foreach ($extensions_valid as $extension){
        if ($extension == $extension_upload) {
            $valid = 1;
        }
    }
    if ($valid == 0)
        $error = "files type invalid";
    if ($error == ""){
        date_default_timezone_set('Europe/Paris');
        $date = date('YmdGis');
        $file = "upload/$login$date.$extension_upload";
        $result = move_uploaded_file($file_name, $file);
        if ($result) {
            $_SESSION['info'] = "upload succed";
            $_SESSION['login']['check_upload'] = TRUE;
            $_SESSION['login']['upload'] = $file;
            $_SESSION['login']['extension_upload'] = $extension_upload;
        }
    }
    else{
        $_SESSION['error'] = $error;
    }
    header("Location: core.php");
?>