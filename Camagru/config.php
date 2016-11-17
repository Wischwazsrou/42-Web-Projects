<?php

include "init_db.php";

$create_table_users = "CREATE TABLE `users` (
              id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              login VARCHAR(10) NOT NULL,
              password VARCHAR(255) NOT NULL,
              email VARCHAR(30) NOT NULL,
              status int(2) NOT NULL DEFAULT 0,
              droits INT(2) NOT NULL DEFAULT 0,
              token VARCHAR (255) DEFAULT NULL,
              date TIMESTAMP)";
$password_admin = hash('whirlpool', "root");
$new_user_admin = "INSERT INTO `users` (`login`, `passwd`, `droits`) VALUES ('admin', '".$password_admin."', '1')";

$create_table_pictures = "CREATE TABLE `pictures` (
              id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              login VARCHAR(10) NOT NULL,
              likes INT(10) UNSIGNED NOT NULL DEFAULT 0,
              date TIMESTAMP DEFAULT CURRENT_TIMESTAMP)";

$create_table_likes = "CREATE TABLE `likes` (
              id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              login VARCHAR(10) NOT NULL,
              img INT(10) UNSIGNED NOT NULL,
              date TIMESTAMP)";

$create_table_comments = "CREATE TABLE `comments` (
              id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
              login VARCHAR(10) NOT NULL,
              comment VARCHAR (500) NOT NULL,
              img INT(10) UNSIGNED NOT NULL,
              date TIMESTAMP)";

$server = "localhost";
$admin = "root";
$password = "";
$dbname = "camagru";

$strConnection = "mysql:host=$server";
$arrExtraParam = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
$pdo = new PDO($strConnection, $admin, $password, $arrExtraParam);
if ($pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname"))
    echo "Creation database ok<br>";
else
    echo "Error creation database<br>";
$pdo->query("use $dbname");
if ($db = db_init())
{
    if ($pdo->exec($create_table_users) !== FALSE) {
        echo "Table users ok<br>";
        if ($pdo->exec($new_user_admin) !== FALSE)
            echo "Admin account ok<br>";
        else
            echo "Error creation admin account<br>";
    } else
        echo "Error creation table users<br>";
    if ($pdo->exec($create_table_pictures) !== FALSE)
        echo "Table pictures ok<br>";
    else
        echo "Error creation table pictures<br>";
    if ($pdo->exec($create_table_comments) !== FALSE)
        echo "Table comments ok<br>";
    else
        echo "Error creation table comments<br>";
    if ($pdo->exec($create_table_likes) !== FALSE)
        echo "Table likes ok<br>";
    else
        echo "Error creation table likes<br>";
}
else
    echo "Failure in connection database Camagru !";

?>
<a href="index.php"><button>Allez vers l'index</button></a>