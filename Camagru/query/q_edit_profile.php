<?php

include "../header.php";
include "../logged.php";

if (isset($_POST['old_pwd']) == TRUE || isset($_POST['new_pwd']) == TRUE)
{
    $old_pwd = addslashes($_POST['old_pwd']);
    $old_pwd = htmlspecialchars($old_pwd);
    $new_pwd = addslashes($_POST['new_pwd']);
    $new_pwd = htmlspecialchars($new_pwd);
    $login = $_SESSION['login']['login'];
    $query = "SELECT `password` FROM `users` WHERE `login`='$login'";
    $array = $pdo->query($query)->fetch();
    $old_pwd = hash('whirlpool', $old_pwd);
    if ($old_pwd == $array['password'])
    {
        if ($new_pwd == NULL) {
            $_SESSION['error'] = "Invalid input";
            header("Location: ../edit_profile.php");
            exit;
        }
        else {
            $new_pwd = hash('whirlpool', $new_pwd);
            $query = "UPDATE `users` SET `password`='$new_pwd' WHERE `login`='$login'";
            $pdo->exec($query);
            $_SESSION['info'] = "Edit done";
            header("Location: ../user_profile.php?user=".$_SESSION['login']['login']);
            exit;
        }
    }
    else {
        $_SESSION['error'] = "Invalid Input";
        header("Location: ../edit_profile.php");
        exit;
    }
}
else {
    header("Location: ../edit_profile.php");
    exit;
}
?>