<?php
require_once(__DIR__."/Fridge.php");

$type = $_POST["type"];
if(empty($type)) {
  $type = $_GET["type"];
}
switch($type) {
  case "category": {
    $id = (int)$_POST["id"];
    $name = $_POST["name"];
    (new Fridge())->updateCategory($id, $name);
    break;
  }
  case "location": {
    $id = (int)$_POST["id"];
    $name = $_POST["name"];
    (new Fridge())->updateLocation($id, $name);
    break;
  }
  case "item": {
    $id = (int)$_POST["id"];
    $name = $_POST["name"];
    $categoryId = (int)$_POST["category_id"];
    $image = $_FILES["image"];
    (new Fridge())->updateItem($id, $name, $categoryId, $image);
    break;
  }
  case "entry": {
    $id = (int)$_GET["id"];
    $numberOfItems = (int)$_GET["numberOfItems"];
    (new Fridge())->updateEntry($id, $numberOfItems);
    break;
  }
  default:
    echo("unknown type $type");
}
?>