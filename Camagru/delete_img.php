<?php

    include "header.php";
    include "logged.php";

    $login = $_SESSION['login']['login'];
    $query = "DELETE FROM `pictures` WHERE `id`='$_POST[del_pic]'";
    $pdo->exec($query);
    $image = "pictures/".$_POST['del_pic'].".png";
    unlink($image);
    header("Location: user_profile.php?user=$login");

?>
