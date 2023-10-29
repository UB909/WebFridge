<?php
require_once(__DIR__."/Recipes.php");

$type = $_POST["type"];
switch($type) {
  case "category": {
    $name = $_POST["name"];
    (new Recipes())->createCategory($name);
    break;
  }
  case "dish": {
    $name = $_POST["name"];
    $preparation = $_POST["preparation"];
    $categoryId = (int)$_POST["category_id"];
    $image = $_FILES["image"];
    (new Recipes())->createDish($name, $preparation, $categoryId, $image);
    break;
  }
  default:
    echo("unknown type $type");
}
?>