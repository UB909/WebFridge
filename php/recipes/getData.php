<?php
require_once(__DIR__."/Recipes.php");
$f = new Recipes();

$data = array();
$data["categories"] = $f->loadCategories();
$data["dishes"] = $f->loadDishs();

header('Access-Control-Allow-Origin: *');
header("Content-type: application/json; charset=utf-8");
echo(json_encode($data));
?>