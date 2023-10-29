<?php
require_once(__DIR__."/Recipes.php");

$id = (int)$_GET["id"];
(new Fridge())->getItemImage($id);
?>