<?php
    include "header.php";
    include "logged.php";

    $login = $_SESSION['login']['login'];
    $id_pic = $_SESSION['login']['commented_pic'];
    $query = "SELECT `login` FROM `pictures` WHERE `id`='$id_pic'";
    $array = $pdo->query($query)->fetch();
    $user = $array['login'];
    $query = "SELECT `email` FROM `users` WHERE `login`='$user'";
    $array = $pdo->query($query)->fetch();
    $mail = $array['email'];
    $current_page = $_SESSION['login']['current_page'];
    $passage_ligne = "\n";
    // Déclaration de l'adresse de destination.

    //=====Déclaration des messages au format texte et au format HTML.
    $message_txt = "";
    $message_html = "Hi $user ! Someone commented one of your pics.\n Log you in and check this out. 
                     <a href='http://localhost:8080/Camagru/single_pic.php?pic=$id_pic'>Click here</a>";

    //=====Création de la boundary
    $boundary = "-----=".md5(rand());
    //==========

    //=====Définition du sujet.
    $sujet = "$user, you got a new comment !";
    //=========

    //=====Création du header de l'e-mail.
    $header = "From: \"Camagru\"<pepey33@hotmail.fr>".$passage_ligne;
    $header.= "Reply-to: \"Camagru\" <$mail>".$passage_ligne;
    $header.= "MIME-Version: 1.0".$passage_ligne;
    $header.= "Content-Type: multipart/alternative;".$passage_ligne." boundary=\"$boundary\"".$passage_ligne;
    //==========

    //=====Création du message.
    $message = $passage_ligne."--".$boundary.$passage_ligne;
    //=====Ajout du message au format texte.
    $message.= "Content-Type: text/plain; charset=\"ISO-8859-1\"".$passage_ligne;
    $message.= "Content-Transfer-Encoding: 7bit".$passage_ligne;
    $message.= $passage_ligne.$message_txt.$passage_ligne;
    //==========
    $message.= $passage_ligne."--".$boundary.$passage_ligne;
    //=====Ajout du message au format HTML
    $message.= "Content-Type: text/html; charset=\"ISO-8859-1\"".$passage_ligne;
    $message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
    $message.= $passage_ligne.$message_html.$passage_ligne;
    //==========
    $message.= $passage_ligne."--".$boundary."--".$passage_ligne;
    $message.= $passage_ligne."--".$boundary."--".$passage_ligne;
    //==========

    //=====Envoi de l'e-mail.
    mail($mail,$sujet,$message,$header);
    //==========
    $_SESSION['login']['comment'] = NULL;
    $_SESSION['login']['id_pic'] = NULL;
    header("Location: all_pics.php?page=$current_page");
?>
