<?php
require_once(__DIR__."/Recipes.php");

$id = $_POST["id"];
$type = $_POST["type"];
switch($type) {
  case "category": {
    (new Recipes())->removeCategory($id);
    break;
  }
  case "dish": {
    (new Recipes())->removeDish($id);
    break;
  }
  default:
    echo("unknown type $type");
}
?>