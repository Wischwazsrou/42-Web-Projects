<?php

    include "header.php";
    include "logged.php";

    $query = "SELECT `login` FROM `pictures` WHERE `id`='$_GET[pic]'";
    $pic = $pdo->query($query)->fetch();

    if (isset($_GET['pic']) == FALSE)
        header("Location: all_pics.php");

    if (!isset($pic) || $pic == FALSE)
        header("Location: index.php");
    
?>

<!DOCTYPE HTML>
<html lang="eng">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title>Camagru</title>
    <link rel="stylesheet" type="text/css" href="camagru.css">
</head>
<body>
    <header>
        <h1>Camagru</h1>
        <ul>
            <li>
                <a href="signout.php">Sign out</a>
            </li>
            <li>
                <a href="user_profile.php?user=<?php echo $_SESSION['login']['login']?>"><?php echo $_SESSION['login']['login'] ?></a>
            </li>
            <li>
                <a href="core.php">Home</a>
            </li>
            <li>
                <a href="all_pics.php">All pics</a>
            </li>
        </ul>
    </header>
    
    <section id="message">
        <?php
        include "messages.php";
        ?>
    </section>
    <section>
        <img id="single_pic" src="pictures/<?php echo $_GET['pic'] ?>.png"></br >
        <?php
        $query = "SELECT `comment` FROM `comments` WHERE `img`='$_GET[pic]'";
        $pic_comments = $pdo->query($query)->fetchAll();
        foreach ($pic_comments as $comment) {
            $query = "SELECT `login` FROM `comments` WHERE `comment`='$comment[comment]'";
            $user = $pdo->query($query)->fetch();
            $query = "SELECT `date` FROM `comments` WHERE `comment`='$comment[comment]'";
            $date = $pdo->query($query)->fetch();
            ?>
            <div id="comments"><?php echo $date['date'] . " from " ?>
                <b><?php echo $user['login'] . ": " ?></b><br><?php echo $comment['comment'] ?>
            </div><br>
    <?php }
            ?>     
    </section>
    <footer class="main-footer"></footer>
</body>
</html>