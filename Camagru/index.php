<?php

include "header.php";

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
        <?php if (isset($_SESSION['login']['logged']) == false){ ?>
        <ul>
            <li>
                <a href="signin.php">Sign in</a>
            </li>
            <li>
                <a href="signup.php">Sign up</a>
            </li>
        </ul>
        <?php }
        else { ?>
        <ul>
            <li>
                <a href="signout.php">Sign out</a>
            </li>
            <li>
                <a href="user_profile.php?user=<?php echo $_SESSION['login']['login']?>"><?php echo $_SESSION['login']['login'] ?></a>
            </li>
            <li>
                <a href="all_pics.php">All pics</a>
            </li>
        </ul>

        <?php } ?>

    </header>
    <section id="message">
        <?php
        include "messages.php";
        ?>
    </section>
    <footer class="main-footer"></footer>
</body>
</html>