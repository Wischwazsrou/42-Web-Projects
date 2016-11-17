<?php
    session_start();
    
    function db_init()
    {
        $server = "localhost";
        $admin = "root";
        $password = "";
        $dbname = "camagru";
    
        try {
            $strConnection = "mysql:host=$server;dbname=$dbname";
            $arrExtraParam = array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8");
            $pdo = new PDO($strConnection, $admin, $password, $arrExtraParam);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            $msg = 'ERREUR PDO dans ' . $e->getFile() . ' L.' . $e->getLine() . ' : ' . $e->getMessage();
            die($msg);
        }
    
        $conn = null;
        return TRUE;
    }
?>