<?php

include "header.php";

$_SESSION['login'] = NULL;
$_SESSION['info'] = "you are now logged out";

header("Location: index.php");

?>