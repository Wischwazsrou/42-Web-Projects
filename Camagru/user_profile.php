<?php

    include "header.php";
    include "logged.php";
    if ($_GET['user'] != $_SESSION['login']['login']){
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
                <a href="signout.php">Sign out</a>
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
            <form class="user_board" action="edit_profile.php" method="POST">
                <div class="title">Your account</div>
                <div>USERNAME: <?php echo $_SESSION['login']['login'] ?></div>
                <div>PASSWORD: *****</div>
                <div>E-MAIL ADRESS:
                    <?php
                        $login = $_SESSION['login']['login'];
                        $query = "SELECT `email` FROM `users` WHERE `login`='$login'";
                        $array = $pdo->query($query)->fetch();
                        echo $array['email'];
                    ?>
                </div>
                <button class="button_sign button_signup" type="submit" value="OK">Edit</button>
            </form>
            <div class="all_pics little_title">All your pics</div>
            <?php
                $login = $_SESSION['login']['login'];
                $query = "SELECT `id` FROM `pictures` WHERE `login`='$login'";
                $users_pic = $pdo->query($query)->fetchAll();
                foreach ($users_pic as $id)
                {
                    ?>
                    <a href="single_pic.php?pic=<?php echo $id['id']?>">
                        <img id="user_all_pic" src="pictures/<?php echo $id['id'] ?>.png">
                    </a>
                    <input name="del_pic" type="button" value="Delete" onclick="delete_img(<?php echo $id['id'] ?>)">
                    <?php

                }
            ?>
            <script>
                function delete_img(id_pic){
                    var form = document.createElement('form');
                    form.setAttribute('action', 'delete_img.php');
                    form.setAttribute('method', 'post');
                    var del_pic = document.createElement('input');
                    del_pic.setAttribute('name', 'del_pic');
                    del_pic.setAttribute('value', id_pic);
                    form.appendChild(del_pic);
                    document.body.appendChild(form);
                    form.submit();
                }
            </script>
        </div>
        <footer class="main-footer"></footer>
    </div>
</body>
</html>