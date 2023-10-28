<?php
require_once(__DIR__."/Fridge.php");

$id = (int)$_POST["id"];
$newName = $_POST["name"];
(new Fridge())->updateLocation($id, $newName);
?>