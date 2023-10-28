<?php
require_once("NamedDatabaseItem.php");

/// location
class Location extends NamedDatabaseItem {
  /// creates location from database row
  public function __construct($row) {
    parent::__construct($row);
  }

  /// creates a location with the given name
  public static function create($sqlSession, $name) {
    $sqlSession->query("INSERT INTO locations (name) VALUES ('".  $sqlSession->real_escape_string($name) . "')");
    echo("OK");
  }

  /// returns all locations from the database
  public static function loadFromSql($sqlSession) {
    return NamedDatabaseItem::loadNamedDatabaseItemsFromSql($sqlSession, "locations", "", static::class);
  }
  
  /// updates a location with the given id 
  public static function update($sqlSession, $id, $name) {
    $sqlSession->query("UPDATE locations SET name = '".  $sqlSession->real_escape_string($name) . "' WHERE id = $id");
    echo("OK");
  }
  
  /// removes a location with the given id 
  public static function remove($sqlSession, $id) {
    // delete all entries
    $sqlSession->query("DELETE FROM entries WHERE location_id = $id");
    
    // delete the category itself
    $sqlSession->query("DELETE FROM locations WHERE id = $id");
    echo("OK");
  }
}

?>