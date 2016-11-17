<?php

    include "header.php";

    $query = "SELECT `login` FROM `users` WHERE `token`='$_GET[token]'";
    $login = $pdo->query($query)->fetch();
    if ((isset($_GET['token']) == FALSE) || (isset($login) == FALSE)) {
        $_SESSION['error'] = "Account must be validate by email";
        header("Location: index.php");
    }
    else{
        $token = NULL;
        $_SESSION['info'] = "Account created. You can now log you in";
        $query = "UPDATE `users` SET `status`='1' WHERE `login`='$login[login]'";
        $pdo->exec($query);
        $query = "UPDATE `users` SET `Token`= '$token' WHERE `login`='$login[login]'";
        $pdo->exec($query);
        $_SESSION['pwd_code'] = NULL;
        $_SESSION['tmp_email'] = NULL;
        $_SESSION['sign_up_login'] = NULL;
        header("Location: signin.php");
    }

?>