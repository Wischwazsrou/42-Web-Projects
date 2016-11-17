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
<div class="page">
    <div class="bloc-principal">
        <header>
            <h1>Camagru</h1>
        </header>
        <a href="index.php">
            <button class="login">Home</button>
        </a>
        <?php
        include "messages.php";
        ?>
        <form class="sign_board" action="pwd_mail.php" method="POST">
            <div class="title">Enter your username</div>
            <label class="user_info">USERNAME
                <input name="login" class="input_sign" type="text"></label>
            <button class="button_sign button_pwd" type="submit" value="OK">Sign in</button>
        </form>
    </div>
    <footer class="main-footer"></footer>
</div>
</body>
</html>