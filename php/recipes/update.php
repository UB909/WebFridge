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
    $ingredients = array();

    for($i=0; true; $i++) {
      if(!array_key_exists("ingredients_amount_" . $i, $_POST)) {
        break;
      }
      
      $amount = $_POST["ingredients_amount_" . $i];
      $ing_name = $_POST["ingredients_name_" . $i];

      if(!empty($amount) || !empty($ing_name)) {
        array_push($ingredients, array("amount" => $amount, "name" => $ing_name));
      }
    }
    (new Recipes())->updateDish($id, $name, $preparation, $ingredients, $categoryId, $image);
    break;
  }
  default:
    echo("unknown type $type");
}
?>