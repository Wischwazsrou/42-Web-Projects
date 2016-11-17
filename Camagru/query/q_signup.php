<?php
    include "../header.php";

    $username = addslashes($_POST['username']);
    $username = htmlspecialchars($username);
    $pwd = addslashes($_POST['password']);
    $pwd = htmlspecialchars($pwd);
    $users = "SELECT `login` FROM `users`";
    $array = $pdo->query($users)->fetchAll();
    $query = "SELECT `email` FROM `users`";
    $email = $pdo->query($query)->fetchAll();
    $add = TRUE;
    if (isset($username)) {
        foreach ($array as $login) {
            if ($login['login'] == $username) {
                $_SESSION['error'] = "User already exists.";
                $add = FALSE;
                header('Location: ../signup.php');
            }
        }
        if ($add == TRUE) {
            if ($username == NULL || $pwd == NULL || $_POST['email'] == NULL) {
                $_SESSION['error'] = "FAIL: Empty input.";
                header('Location: ../signup.php');
            }
            else {
                $pattern_user = '/^[a-zA-Z0-9_-]{4,14}$/';
                $pattern_pwd = '/^[a-zA-Z0-9?@.*;:!_-]{8,18}$/';
                if (preg_match($pattern_user, $username) == 0){
                    $_SESSION['error'] = "Username too short, too long or using not allowed characters";
                    header("Location: ../signup.php");
                    exit;
                }
                else if (preg_match($pattern_pwd, $pwd) == 0 || ctype_alnum($pwd) == TRUE ||
                    ctype_punct($pwd) == TRUE || ctype_lower($pwd) == TRUE || ctype_upper($pwd) == TRUE){
                    $_SESSION['error'] = "Your password is not strong enough";
                    header('Location: ../signup.php');
                    exit;
                }
                else{
                    foreach ($email as $mail){
                        if ($mail['email'] == $_POST['email']){
                            $_SESSION['error'] = 'Email adress already used.';
                            header("Location: ../signup.php");
                            exit;
                        }
                    }
                    $pwd = hash('whirlpool', $pwd);
                    $query = "INSERT INTO `users` (`login`, `password`, `email`)
                                  VALUES('$_POST[username]', '$pwd', '$_POST[email]')";
                    $pdo->exec($query);
                    $_SESSION['sign_up_login'] = $username;
                    $_SESSION['tmp_email'] = $_POST['email'];
                    $_SESSION['info'] = "User created.";
                    header('Location: ../signup_mail.php');
                }
            }
        }
    }
?>