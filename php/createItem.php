<?php
require_once(__DIR__."/Fridge.php");

$newName = $_POST["name"];
$categoryId = (int)$_POST["category_id"];
$image = $_FILES["image"];
(new Fridge())->createItem($newName, $categoryId, $image);
?>