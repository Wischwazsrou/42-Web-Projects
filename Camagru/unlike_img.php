<?php

    include "header.php";
    include "logged.php";

    $id_pic = $_POST['unlike_pic'];
    $login = $_SESSION['login']['login'];
    $query = "SELECT `likes` FROM `pictures` WHERE `id`='$id_pic'";
    $likes = $pdo->query($query)->fetch();
    $likes['likes'] = $likes['likes'] - 1;
    $query = "UPDATE `pictures` SET `likes`='$likes[likes]' WHERE `id`='$id_pic'";
    $pdo->exec($query);
    $query = "DELETE FROM `likes` WHERE `img`='$id_pic' And `login`='$login'";
    $pdo->exec($query);
    $current_page = $_SESSION['login']['current_page'];
    header("Location: all_pics.php?page=$current_page");

?>