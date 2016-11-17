<?php

    include "header.php";
    include "logged.php";

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
                <a href="user_profile.php"><?php echo $_SESSION['login']['login'] ?></a>
            </li>
            <li>
                <a href="all_pics.php">All pics</a>
            </li>
            <li>
                <a href="core.php">Home</a>
            </li>
        </ul>
    </header>
    <section id="message">
        <?php
        include "messages.php";
        ?>
    </section>
    <div class="page">
        <div class="bloc-principal">
            <form class="sign_board" action="query/q_edit_profile.php" method="POST">
                <div class="title">Edit your account</div>
                <label class="user_info">OLD PASSWORD
                    <input name="old_pwd" class="input_sign" type="password"></label><br>
                <label class="user_info">NEW PASSWORD
                    <input name="new_pwd" class="input_sign" type="password"></label><br>
                <label class="user_info">E-MAIL ADRESS
                    <input name="email" class="input_sign" type="email"></label><br>
                <button class="button_sign button_signup" type="submit" value="OK">Edit</button>
            </form>
        </div>
        <footer class="main-footer"></footer>
    </div>
</body>
</html>