<?php
require_once(__DIR__."/Fridge.php");

$id = (int)$_GET["id"];
$numberOfItems = (int)$_GET["numberOfItems"];
(new Fridge())->updateEntry($id, $numberOfItems);
?>