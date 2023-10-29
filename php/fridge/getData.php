<?php
require_once(__DIR__."/Fridge.php");
$f = new Fridge();

$data = array();
$data["categories"] = $f->loadCategories();
$data["entries"] = $f->loadEntries();
$data["items"] = $f->loadItems();
$data["locations"] = $f->loadLocations();

echo(json_encode($data));
?>