<?php
require_once(__DIR__."/Fridge.php");

$newName = $_POST["name"];
(new Fridge())->createCategory($newName);
?>