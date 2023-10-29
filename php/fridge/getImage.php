<?php
require_once(__DIR__."/Fridge.php");

$id = (int)$_GET["id"];
(new Fridge())->getItemImage($id);
?>