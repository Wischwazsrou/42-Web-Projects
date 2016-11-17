<?php
    include "header.php";

    $token = $_GET['token'];
    $query = "SELECT `login` FROM `users` WHERE `token`='$token'";
    $user = $pdo->query($query)->fetch();
    if (isset($user) == FALSE){
        $_SESSION['error'] = "Wrong link";
        header("Location: signin.php");
    }
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
    <section id="body">
        <div class="bloc-principal">
            <form class="sign_board" action="query/q_change_pwd.php?token=<?php echo $token ?>" method="POST">
                <div class="title">Change your password</div>
                <label class="user_info">New Password
                    <input name="new_pwd" class="input_sign" type="password"></label>
                <label class="user_info">Confirm Password
                    <input name="check_pwd" class="input_sign" type="password"></label><br>
                <button class="button_sign button_signin" type="submit" value="OK">Sign in</button>
            </form>
         </div>
    </section>
        <footer class="main-footer"></footer>
</body>
</html>