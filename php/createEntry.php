<?php
require_once(__DIR__."/Fridge.php");

$itemId = (int)$_GET["itemId"];
$locationId = (int)$_GET["locationId"];
$numberOfItems = (int)$_GET["numberOfItems"];
echo(json_encode((new Fridge())->createEntry($itemId, $locationId, $numberOfItems)));
?>