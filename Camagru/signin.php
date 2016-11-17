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
        <ul>
            <li>
                <a href="index.php">Home</a>
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
            <form class="sign_board" action="query/q_signin.php" method="POST">
                <div class="title">Sign in to your account</div>
                <label class="user_info">USERNAME
                    <input name=username class="input_sign" type="text"></label>
                <label class="user_info">PASSWORD
                    <input name=password class="input_sign" type="password"></label><br>
                <a href="send_mail.php" class="user_info forgot_pwd">I forgot my password...</a>
                <button class="button_sign button_signin" type="submit" value="OK">Sign in</button>
            </form>
            </div>
            <footer class="main-footer"></footer>
    </div>
</body>
</html>