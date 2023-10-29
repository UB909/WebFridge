<?php
require_once(__DIR__."/Recipes.php");

$id = (int)$_POST["id"];
$type = $_POST["type"];
switch($type) {
  case "category": {
    $name = $_POST["name"];
    (new Recipes())->updateCategory($id, $name);
    break;
  }
  case "dish": {
    $name = $_POST["name"];
    $preparation = $_POST["preparation"];
    $categoryId = (int)$_POST["category_id"];
    $image = $_FILES["image"];
    (new Recipes())->updateDish($id, $name, $preparation, $categoryId, $image);
    break;
  }
  default:
    echo("unknown type $type");
}
?>