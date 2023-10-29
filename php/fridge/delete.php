<?php
require_once(__DIR__."/Fridge.php");

$id = $_POST["id"];
$type = $_POST["type"];
switch($type) {
  case "category": {
    (new Fridge())->removeCategory($id);
    break;
  }
  case "location": {
    (new Fridge())->removeLocation($id);
    break;
  }
  case "item": {
    (new Fridge())->removeItem($id);
    break;
  }
  default:
    echo("unknown type $type");
}
?>