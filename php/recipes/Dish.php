<?php
require_once("../shared/NamedDatabaseItem.php");
require_once("../shared/Category.php");

/// dish
class Dish extends NamedDatabaseItem {
  /// category of the dish
  protected $categoryId;

  /// preparation of the dish
  protected $preparation;

  /// creates dish from database row
  public function __construct($row) {
    parent::__construct($row);
    $this->preparation = $row["preparation"];
    $this->categoryId = (int)$row["category_id"];
  }

  /// creates a dish in the history table and main table with the given name
  public static function create($sqlSession, $name, $preparation, $categoryId, $image) {
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

    $sqlSession->query("INSERT INTO recipes_dishes (name, preparation, category_id) VALUES ('".  $sqlSession->real_escape_string($name) . "', '".  $sqlSession->real_escape_string($preparation) . "', $categoryId)");
    $lastId = $sqlSession->insert_id;

    if((strlen($image["type"]) > 5) && (strcasecmp(substr($image["type"], 0, 5), 'image') == 0)) {
      // Add to main table
      $stmt = $sqlSession->prepare("UPDATE recipes_dishes SET image_size = " . $image["size"] . ", image = ? WHERE id =  $lastId");
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

  /// returns all dishs from the database
  public static function loadFromSql($sqlSession) {
    return NamedDatabaseItem::loadNamedDatabaseItemsFromSql($sqlSession, "recipes_dishes", ", tab.category_id, tab.preparation", static::class);
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = parent::jsonSerialize();
    $retVal["categoryId"] = $this->categoryId;
    return $retVal;
  }
    
  /// updates a location with the given id 
  public static function update($sqlSession, $id, $name, $preparation, $categoryId, $image) {
    $sqlSession->query("UPDATE recipes_dishes SET name = '".  $sqlSession->real_escape_string($name) . "', preparation = '".  $sqlSession->real_escape_string($preparation) . "', category_id = $categoryId WHERE id = $id");
    
    if((strlen($image["type"]) > 5) && (strcasecmp(substr($image["type"], 0, 5), 'image') == 0)) {
      // Add to main table
      $stmt = $sqlSession->prepare("UPDATE recipes_dishes SET image_size = " . $image["size"] . ", image = ? WHERE id =  $id");
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
    // delete the category itself
    $sqlSession->query("DELETE FROM recipes_dishes WHERE id = $id");
    echo("OK");
  }
}

?>