<?php

include "header.php";
include "logged.php";

?>
<!DOCTYPE HTML>
<html lang="eng">
<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width" />
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
            <a href="all_pics.php">All pics</a>
        </li>
    </ul>
</header>

<section id="message">
    <?php
    include "messages.php";
    ?>
</section>

<section id="body">
    <div class="block">
        <h2>Pictures you can add</h2>
        <div class="content">
            <ul class="left">
                <li>
                    <img id="pic1" src="img/cadre_cocotier.png"><br>
                    <input type="radio" name="pic" value="cadre_cocotier" onclick="add_img(value)">Add<br>
                </li>
                <li>
                    <img id="pic2" src="img/cadre_brique.png"><br>
                    <input type="radio" name="pic" value="cadre_brique" onclick="add_img(value)">Add<br>
                </li>
            </ul>
        </div>
    </div>
    <div class="block center">
        <div class="prout" style="display: block; z-index: 100;">
            <button type="button" id="startbutton">Take a picture</button>
            <form action="upload.php" method="post" enctype="multipart/form-data">
                <input id="upload" name="upload" type="file">
                <input type="hidden" name="MAX_FILE_SIZE" value="1048576">
                <input class="upload" type="submit" name="submit" value="Send">
            </form>
        </div>
        <?php
        if (isset($_SESSION['login']['check_upload']) == TRUE) {
            ?><div> <img id="picture" src="<?php echo $_SESSION['login']['upload'] ?>"></div>
            <?php
        }
        else {
        ?>
        <div id="core">
            <img id="picture">
            <video id="video"></video>
            <canvas id="canvas" hidden></canvas>
        </div>
        <?php
        }
        ?>
    </div>
    <div class="block right">
        <h2>Last pictures taken</h2>
        <div class="content">
            <?php
            $_SESSION['login']['check_upload'] = NULL;
            $login = $_SESSION['login']['login'];
            $query = "SELECT `id` FROM `pictures` WHERE `login`='$login' ORDER BY id DESC LIMIT 6";
            $users_pic = $pdo->query($query)->fetchAll();
            foreach ($users_pic as $id) {
                ?> <img id="user_pic" src="pictures/<?php echo $id['id'] ?>.png"> <?php
            }
            ?>
        </div>
    </div>

</section>

<footer class="main-footer"></footer>

<script>
    function add_img(value) {
        var base_url = "img/";
        var img_url = base_url.concat(value, ".png");
        var pic = document.getElementById('picture');
        var n = pic.src.indexOf("upload");
        if (n == -1){
            pic.src = img_url;
            pic.classList.add("full-width");
        }
        else
            send_upload(pic.src, img_url);
    }

    function send_upload(photo, pic_add) {
        var form = document.createElement('form');
        form.setAttribute('action', 'create_img.php');
        form.setAttribute('method', 'post');
        var inputpic = document.createElement('input');
        inputpic.setAttribute('name', 'pic_add');
        inputpic.setAttribute('value', pic_add);
        form.appendChild(inputpic);
        var cam = document.createElement('input');
        cam.setAttribute('name', 'photo');
        cam.setAttribute('value', photo);
        form.appendChild(cam);
        document.body.appendChild(form);
        form.submit();
    }
    (function () {

        var streaming = true,
            video = document.getElementById('video'),
            cover = document.getElementById('cover'),
            canvas = document.getElementById('canvas'),
            photo = document.getElementById('photo'),
            picture = document.getElementById('picture');
            startbutton = document.getElementById('startbutton'),
            width = 500,
            height = 0;

        navigator.getMedia = ( navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        if (navigator.getMedia && video) {
            navigator.getMedia(
                {
                    video: true,
                    audio: false
                },
                function (stream) {
                    if (navigator.mozGetUserMedia) {
                        video.mozSrcObject = stream;
                    } else {
                        var vendorURL = window.URL || window.webkitURL;
                        video.src = vendorURL.createObjectURL(stream);
                    }
                    video.play();
                },
                function (err) {
                    streaming = false;
                }
            );
        }
        else{
            streaming = false;
        }
        if (video){
            video.addEventListener('canplay', function(ev){
                if (streaming) {
                    height = video.videoHeight / (video.videoWidth/width);
                    video.setAttribute('width', width);
                    video.setAttribute('height', height);
                    canvas.setAttribute('width', width);
                    canvas.setAttribute('height', height);
                    streaming = true;
                }
            }, false);
        }

        function send_img(photo, pic_add) {
            var form = document.createElement('form');
            form.setAttribute('action', 'create_img.php');
            form.setAttribute('method', 'post');
            var inputpic = document.createElement('input');
            inputpic.setAttribute('name', 'pic_add');
            inputpic.setAttribute('value', pic_add);
            form.appendChild(inputpic);
            var cam = document.createElement('input');
            cam.setAttribute('name', 'photo');
            cam.setAttribute('value', photo);
            form.appendChild(cam);
            document.body.appendChild(form);
            form.submit();
        }

        function takepicture(pic_add) {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(video, 0, 0, width, height);
            var data = canvas.toDataURL('image/png');
            send_img(data, pic_add)
        }

        startbutton.addEventListener('click', function (ev) {
            if (streaming == true && picture.src) {
                var pic_add = document.querySelector('input[name="pic"]:checked').value;
                takepicture(pic_add);
                ev.preventDefault();
            }
        }, false);
    })();


</script>
</body>
</html>