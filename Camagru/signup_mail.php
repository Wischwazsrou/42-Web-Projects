<?php
include "header.php";

$login = $_SESSION['sign_up_login'];
$mail = $_SESSION['tmp_email'];

$characts    = 'abcdefghijklmnopqrstuvwxyz';
$characts   .= 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
$characts   .= '1234567890';
$code_aleatoire      = '';

for($i=0;$i < 10;$i++)    //10 est le nombre de caractères
{
    $code_aleatoire .= substr($characts,rand()%(strlen($characts)),1);
}

$passage_ligne = "\n";
// Déclaration de l'adresse de destination.

//=====Déclaration des messages au format texte et au format HTML.
$message_txt = "";
$message_html = "Hi $login. To validate your inscription click on te link below.\n
                 <a href='http://localhost:8080/Camagru/check_signup.php?token=$code_aleatoire'>Click here</a>";

$query = "UPDATE `users` SET `Token`='$code_aleatoire' WHERE `login`='$login'";
$pdo->exec($query);

//=====Création de la boundary
$boundary = "-----=".md5(rand());
//==========

//=====Définition du sujet.
$sujet = "Camagru: Validation email";
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
header("Location: signin.php");
?>
