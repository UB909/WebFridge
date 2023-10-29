<?php
require_once(__DIR__."/Fridge.php");

$type = $_POST["type"];
if(empty($type)) {
  $type = $_GET["type"];
}
switch($type) {
  case "category": {
    $name = $_POST["name"];
    (new Fridge())->createCategory($name);
    break;
  } 
   case "location": {
    $newName = $_POST["name"];
    (new Fridge())->createLocation($newName);
    break;
  }
  case "item": {
    $name = $_POST["name"];
    $categoryId = (int)$_POST["category_id"];
    $image = $_FILES["image"];
    (new Fridge())->createItem($name, $categoryId, $image);
    break;
  }
  case "entry": {
    $itemId = (int)$_GET["itemId"];
    $locationId = (int)$_GET["locationId"];
    $numberOfItems = (int)$_GET["numberOfItems"];
    echo(json_encode((new Fridge())->createEntry($itemId, $locationId, $numberOfItems)));
    break;
  }
  default:
    echo("unknown type $type");
}
?>