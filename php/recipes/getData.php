<?php
require_once(__DIR__."/Recipes.php");
$f = new Recipes();

$data = array();
$data["categories"] = $f->loadCategories();
$data["dishes"] = $f->loadDishs();

echo(json_encode($data));
?>