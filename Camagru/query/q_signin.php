<?php
    include "../header.php";

    $username = addslashes($_POST['username']);
    $username = htmlspecialchars($username);
    $pwd = addslashes($_POST['password']);
    $pwd = htmlspecialchars($pwd);
    $query = "SELECT `status` FROM `users` WHERE `login`='$username'";
    $status = $pdo->query($query)->fetch();
    $query = "SELECT `password` FROM `users` WHERE `login`='$username'";
    $password = $pdo->query($query)->fetch();
    $query = "SELECT `login` FROM `users` WHERE `login`='$username'";
    $login = $pdo->query($query)->fetch();
    $add = TRUE;
    if ($username == NULL || $pwd == NULL) {
        $_SESSION['error'] = "Empty input";
        header('Location: ../signin.php');
    }
    else if($password == NULL){
        $_SESSION['error'] = "Incorrect username/password";
        header('Location: ../signin.php');
    }
    else {
        $pwd = hash('whirlpool', $pwd);
        if ($pwd == $password['password'] && $status['status'] != 1) {
            $_SESSION['error'] = "Account not operational. You must validate your account with the email we send you.";
            header("Location: ../signin.php");
        }
        else if ($pwd == $password['password'] && $status['status'] == 1) {
            $_SESSION['info'] = "You are now logged in.";
            $_SESSION['login'] = $login['login'];
            $_SESSION['login'] = array();
            $_SESSION['login']['login'] = $login['login'];
            $_SESSION['login']['logged'] = 'logged';
            header('Location: ../core.php');
        }
        else {
            $_SESSION['error'] = "Incorrect username/password";
            header('Location: ../signin.php');
        }
    }
?>