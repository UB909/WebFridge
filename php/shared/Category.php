<?php
require_once("NamedDatabaseItem.php");

/// category
class Category extends NamedDatabaseItem {
  /// creates category from database row
  public function __construct($row) {
    parent::__construct($row);
  }

  /// creates a category with the given name
  public static function create($sqlSession, $name) {
    $sqlSession->query("INSERT INTO categories (name) VALUES ('".  $sqlSession->real_escape_string($name) . "')");
    echo("OK");
  }

  /// returns all categories from the database
  public static function loadFromSql($sqlSession) {
    return NamedDatabaseItem::loadNamedDatabaseItemsFromSql($sqlSession, "categories", "", static::class);
  }

  /// updates a category with the given id 
  public static function update($sqlSession, $id, $name) {
    $sqlSession->query("UPDATE categories SET name = '".  $sqlSession->real_escape_string($name) . "' WHERE id = $id");
    echo("OK");
  }
  
  /// removes a category with the given id 
  public static function remove($sqlSession, $id) {
    // delete all entries;
    $sqlSession->query("DELETE FROM entries WHERE item_id IN (SELECT id FROM items WHERE category_id = $id)");
    
    // delete all items;
    $sqlSession->query("DELETE FROM items WHERE category_id = $id");
    
    // delete all dishes;
    $sqlSession->query("DELETE FROM recipes_dishes WHERE category_id = $id");

    // delete the category itself
    $sqlSession->query("DELETE FROM categories WHERE id = $id");
    echo("OK");
  }
}

?>