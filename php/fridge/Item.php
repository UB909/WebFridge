<?php
require_once("../shared/NamedDatabaseItem.php");
require_once("../shared/Category.php");

/// item
class Item extends NamedDatabaseItem {
  /// category of the item
  protected $categoryId;

  /// creates item from database row
  public function __construct($row) {
    parent::__construct($row);
    $this->categoryId = (int)$row["category_id"];
  }

  /// creates a item in the history table and main table with the given name
  public static function create($sqlSession, $name, $categoryId, $image) {
    // check if category id is valid
    $categories = Category::loadFromSql($sqlSession, 0);
    $found = false;
    foreach ($categories as &$cat) {
      if($cat->id == $categoryId) {
        $found = true;
        break;
      }
    }
    if(!$found) {
      echo "Error: category not found in database";
      return;
    }

    $sqlSession->query("INSERT INTO items (name, category_id) VALUES ('".  $sqlSession->real_escape_string($name) . "', $categoryId)");
    $lastId = $sqlSession->insert_id;

    if((strlen($image["type"]) > 5) && (strcasecmp(substr($image["type"], 0, 5), 'image') == 0)) {
      // Add to main table
      $stmt = $sqlSession->prepare("UPDATE items SET image_size = " . $image["size"] . ", image = ? WHERE id =  $lastId");
      $stmt->bind_param("b", $null);
      $fp = fopen($image["tmp_name"], "r");
      while (!feof($fp)) {
        $stmt->send_long_data(0, fread($fp, 8192));
      }
      fclose($fp);
      $stmt->execute();
    }
    echo("OK");
  }

  /// returns all items from the database
  public static function loadFromSql($sqlSession) {
    return NamedDatabaseItem::loadNamedDatabaseItemsFromSql($sqlSession, "items", ", tab.category_id", static::class);
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = parent::jsonSerialize();
    $retVal["categoryId"] = $this->categoryId;
    return $retVal;
  }
    
  /// updates a location with the given id 
  public static function update($sqlSession, $id, $name, $categoryId, $image) {
    $sqlSession->query("UPDATE items SET name = '".  $sqlSession->real_escape_string($name) . "', category_id = $categoryId WHERE id = $id");
    
    if((strlen($image["type"]) > 5) && (strcasecmp(substr($image["type"], 0, 5), 'image') == 0)) {
      // Add to main table
      $stmt = $sqlSession->prepare("UPDATE items SET image_size = " . $image["size"] . ", image = ? WHERE id =  $id");
      $stmt->bind_param("b", $null);
      $fp = fopen($image["tmp_name"], "r");
      while (!feof($fp)) {
        $stmt->send_long_data(0, fread($fp, 8192));
      }
      fclose($fp);
      $stmt->execute();
    }
    echo("OK");
  }
  
  /// removes a location with the given id 
  public static function remove($sqlSession, $id) {
    // delete all entries
    $sqlSession->query("DELETE FROM entries WHERE item_id = $id");
    
    // delete the category itself
    $sqlSession->query("DELETE FROM items WHERE id = $id");
    echo("OK");
  }
}

?>