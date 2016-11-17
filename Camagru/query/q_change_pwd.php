<?php
include "../header.php";

$new_pwd = addslashes($_POST['new_pwd']);
$new_pwd = htmlspecialchars($new_pwd);
$check_pwd = addslashes($_POST['check_pwd']);
$check_pwd = htmlspecialchars($check_pwd);
$token = $_GET['token'];
$query = "SELECT `login` FROM `users` WHERE `token`='$token'";
$user = $pdo->query($query)->fetch();
$login = $user['login'];

if ($new_pwd == $check_pwd) {
    $pattern_pwd = '/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/';
    if (preg_match($pattern_pwd, $new_pwd) == 0 || ctype_alnum($new_pwd) == TRUE ||
        ctype_punct($new_pwd) == TRUE || ctype_lower($new_pwd) == TRUE || ctype_upper($new_pwd) == TRUE){
        $_SESSION['error'] = "Your password is not strong enough";
        header("Location: ../change_pwd.php?token=");
        exit;
    }
    else {
        $token = NULL;
        $pwd = hash('whirlpool', $new_pwd);
        $query = "UPDATE `users` SET `password`='$pwd' WHERE `login`='$login'";
        $pdo->exec($query);
        $query = "UPDATE `users` SET `token`='$token' WHERE `login`='$login'";
        $pdo->exec($query);
        $_SESSION['login'] = NULL;
        $_SESSION['info'] = "Password succesfully changed";
        header('Location: ../signin.php');
        exit;
    }
}
else{
    $_SESSION['error'] = "Passwords are not the same.";
    header("Location: ../change_pwd.php?token=$token");
    exit;
}


?>