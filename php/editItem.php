<?php
require_once(__DIR__."/Fridge.php");

$id = (int)$_POST["id"];
$newName = $_POST["name"];
$categoryId = (int)$_POST["category_id"];
$image = $_FILES["image"];
(new Fridge())->updateItem($id, $newName, $categoryId, $image);
?>