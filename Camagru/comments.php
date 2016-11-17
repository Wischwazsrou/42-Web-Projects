<?php

    include "header.php";
    include "logged.php";

    $current_page = $_SESSION['login']['current_page'];
    if (isset($_POST['comment_pic']) == TRUE) {
        $_POST['comment'] = addslashes($_POST['comment']);
        $_POST['comment'] = htmlspecialchars($_POST['comment']);

        if (isset($_POST['comment']) == TRUE) {
            $login = $_SESSION['login']['login'];
            $commented_pic = $_POST['comment_pic'];
            $_SESSION['login']['commented_pic'] = $commented_pic;
            echo $_SESSION['login']['comment_pic'];
            $comment = $_POST['comment'];
            $query = "INSERT INTO `comments` (`login`, `comment`, `img`)
                  VALUE ('$login', '$comment', '$commented_pic')";
            $pdo->exec($query);
            header("Location: comments_mail.php");
            exit;
        }
    }
    else {
        $_SESSION['error'] = "invalid comment";
        header("Location: all_pics.php");
        exit;
    }
?>