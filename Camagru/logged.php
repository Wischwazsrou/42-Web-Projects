<?php

if ($_SESSION['login']['logged'] == NULL){
    header("Location: index.php");
    exit;
}

?>