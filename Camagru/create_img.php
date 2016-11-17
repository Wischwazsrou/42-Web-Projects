<?php
    include "header.php";
    include "logged.php";

    if ($_SESSION['login']['upload'] == NULL) {
        $str = "data:image/png;base64,";
        $data = str_replace($str, "", $_POST['photo']);
        if (base64_decode($data) == FALSE)
            $image = imagecreatefromjpeg($data);
        else {
            $data = base64_decode($data);
            $image = imagecreatefromstring($data);
        }
        $pic_add = "img/".$_POST['pic_add'].".png";
        $pic_add = imagecreatefrompng($pic_add);
        $largeur_source = imagesx($pic_add);
        $hauteur_source = imagesy($pic_add);
        imagecopy($image, $pic_add, 0, 0, 0, 0, $largeur_source, $hauteur_source);
        $login = $_SESSION['login']['login'];
        $query = "INSERT INTO `pictures` (`login`)
              VALUES('$login')";
        $pdo->exec($query);
        $query = "SELECT `id` FROM `pictures` ORDER BY id DESC LIMIT 1";
        $id = $pdo->query($query)->fetch();
        imagepng($image, "pictures/" . $id['id'] . ".png");
        imagedestroy($image);
        imagedestroy($pic_add);
        header('Location: core.php');
    }
    else{
        if ($_SESSION['login']['extension_upload'] == 'jpg'){
            $_SESSION['login']['extension_upload'] = 'jpeg';
        }
        $function = "imagecreatefrom".$_SESSION['login']['extension_upload'];
        $pic_upload = $function($_SESSION['login']['upload']);
        $pic_add = $_POST['pic_add'];
        $pic_add = imagecreatefrompng($pic_add);
        $largeur_source = imagesx($pic_add);
        $hauteur_source = imagesy($pic_add);
        $largeur_dest = imagesx($pic_upload);
        $hauteur_dest = imagesy($pic_upload);
        if (strstr($_POST['pic_add'], 'cadre') == FALSE){
            imagecopy($pic_upload, $pic_add, 0, 0, 0, 0, $largeur_source, $hauteur_source);
        }
        else {
            imagecopyresampled($pic_upload, $pic_add, 0, 0, 0, 0, $largeur_dest, $hauteur_dest, $largeur_source, $hauteur_source);
        }
        $login = $_SESSION['login']['login'];
        $query = "INSERT INTO `pictures` (`login`)
                  VALUES('$login')";
        $pdo->exec($query);
        $query = "SELECT `id` FROM `pictures` ORDER BY id DESC LIMIT 1";
        $id = $pdo->query($query)->fetch();
        imagepng($pic_upload, "pictures/" . $id['id'] . ".png");
        imagedestroy($pic_upload);
        imagedestroy($pic_add);
        unlink($_SESSION['login']['upload']);
        $_SESSION['login']['upload'] = NULL;
        header('Location: core.php');
    }
?>