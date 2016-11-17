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
                <a href="user_profile.php?user=<?php echo $_SESSION['login']['login']?>"><?php echo $_SESSION['login']['login'] ?></a>
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
            <?php
            $query = "SELECT COUNT(*) AS 'total' FROM `pictures`";
            $total_pics = $pdo->query($query)->fetchAll();
            foreach ($total_pics as $total);
                $total = $total['total'];
            $pic_per_page = 5;
            $n_page = ceil($total/$pic_per_page);
            if (isset($_GET['page'])){
                $current_page=intval($_GET['page']);
                if($current_page>$n_page)
                {
                    $current_page=$n_page;
                }
            }
            else{
                $current_page=1;
            }
            $_SESSION['login']['current_page'] = $current_page;
            $index_db = ($current_page - 1) * $pic_per_page;
            $query = "SELECT `id` FROM `pictures` ORDER BY `date` DESC LIMIT $index_db, $pic_per_page";
            $all_pics = $pdo->query($query)->fetchAll();
            $login = $_SESSION['login']['login'];
            $query = "SELECT `img` FROM `likes` WHERE `login`='$login'";
            $pic_liked = $pdo->query($query)->fetchAll();
            foreach ($all_pics as $id)
            {
                ?>
                    <a href="single_pic.php?pic=<?php echo $id['id']?>">
                        <img id="user_all_pic" src="pictures/<?php echo $id['id'] ?>.png"></br>
                    </a>
                <?php
                    foreach ($pic_liked as $img) {
                        if ($img['img'] == $id['id']) {
                            $liked = 1;
                            break;
                        } else {
                            $liked = 0;
                        }
                    }
                    $query = "SELECT `likes` FROM `pictures` WHERE `id`='$id[id]'";
                    $likes = $pdo->query($query)->fetch();
                    ?>
                        <span>Likes:<?php echo $likes['likes'] ?></span>
                    <?php
                        if (isset($liked) == TRUE && $liked == 1){
                    ?>
                            <input name="unlike_pic" type="button" value="Unlike"
                                   onclick="unlike_img(<?php echo $id['id'] ?>)"><br>
                    <?php } else {
                            ?>
                            <input name="like_pic" type="button" value="Like"
                                   onclick="like_img(<?php echo $id['id'] ?>)"><br>

                    <?php }
                        $query = "SELECT `comment` FROM `comments` WHERE `img`='$id[id]'";
                        $pic_comments = $pdo->query($query)->fetchAll();
                        foreach ($pic_comments as $comment){
                            $query = "SELECT `login` FROM `comments` WHERE `comment`='$comment[comment]'";
                            $user = $pdo->query($query)->fetch();
                            $query = "SELECT `date` FROM `comments` WHERE `comment`='$comment[comment]'";
                            $date = $pdo->query($query)->fetch();
                    ?>
                        <div><?php echo $date['date']." from "?><b><?php echo $user['login'].": "?></b><br><?php echo $comment['comment'] ?></div><br>
                <?php
                    }

                ?>
                    <input id="button<?php echo $id['id'] ?>" name="comment_pic" type="button" value="Add comment" onclick="view_comment(<?php echo $id['id'] ?>)"></br>
                    <form action="comments.php" method="post">
                        <input id="<?php echo $id['id'] ?>" name="comment" type="hidden" value=""><br>
                        <input id="id_pic" name="comment_pic" type="hidden" value="<?php echo $id['id'] ?>"><br>
                    </form>
                <?php
            }
                    echo '<div align="center">Page : ';
                    $previous = $current_page - 1;
                    $next = $current_page + 1;
                    if ($current_page != 1){
                        echo "<a href='all_pics.php?page=$previous'>previous</a> ";
                    }
                    for($i=1; $i<=$n_page; $i++)
                    {
                        if($i==$current_page) {
                            echo "[ '$i' ]";
                        }
                        else {
                            echo "<a href='all_pics.php?page=$i'>$i</a> ";
                        }
                    }
                    if ($current_page != $n_page && $total > 0){
                        echo "<a href='all_pics.php?page=$next'>next</a> ";
                    }
                    echo '</div>';
            ?>
            <script>
                function like_img(id_pic){
                    var form = document.createElement('form');
                    form.setAttribute('action', 'like_img.php');
                    form.setAttribute('method', 'post');
                    var like_pic = document.createElement('input');
                    like_pic.setAttribute('name', 'like_pic');
                    like_pic.setAttribute('value', id_pic);
                    form.appendChild(like_pic);
                    document.body.appendChild(form);
                    form.submit();
                }
                function unlike_img(id_pic){
                    var form = document.createElement('form');
                    form.setAttribute('action', 'unlike_img.php');
                    form.setAttribute('method', 'post');
                    var unlike_pic = document.createElement('input');
                    unlike_pic.setAttribute('name', 'unlike_pic');
                    unlike_pic.setAttribute('value', id_pic);
                    form.appendChild(unlike_pic);
                    document.body.appendChild(form);
                    form.submit();
                }
                function view_comment(id_pic){
                    var pic = document.getElementById(id_pic);
                    var button = document.getElementById('button'+id_pic);
                    button.setAttribute('type', 'hidden');
                    pic.setAttribute('type', 'text');
                }
                </script>
        </div>
        <footer class="main-footer"></footer>
    </div>
</body>
</html>