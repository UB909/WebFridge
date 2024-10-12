<?php
require_once("../shared/NamedDatabaseItem.php");
require_once("../shared/Category.php");

/// dish
class Dish extends NamedDatabaseItem {
  /// category of the dish
  protected $categoryId;

  /// preparation of the dish
  protected $preparation;

  /// ingredients of the dish
  protected $ingredients;

  /// creates dish from database row
  public function __construct($row) {
    parent::__construct($row);
    $this->preparation = $row["preparation"];
    $this->categoryId = (int)$row["category_id"];
    $this->ingredients = array();
  }

  /// creates a dish in the history table and main table with the given name
  public static function create($sqlSession, $name, $preparation, $ingredients, $categoryId, $image) {
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
      $fp = fopen($image["tmp_name"], "r");
      $imageString = "";
      while (!feof($fp)) {
        $imageString = $imageString . fread($fp, 8192);
      }
      fclose($fp);
      $newImage = DatabaseItem::resizeImage($imageString);

      $stmt = $sqlSession->prepare("UPDATE recipes_dishes SET image_size = " . strlen($newImage) . ", image = ? WHERE id = $lastId");
      $stmt->bind_param("b", $null);
      $stmt->send_long_data(0, $newImage);
      $stmt->execute();
    }

    for($i = 0; $i < count($ingredients); $i++) {
      $sqlSession->query("INSERT INTO recipes_ingredients (dish_id, amount, name, additionalTitle) VALUES ($lastId, '".  
        $sqlSession->real_escape_string($ingredients[$i]['amount']) . "', '".  
        $sqlSession->real_escape_string($ingredients[$i]['name']) . "', '".  
        $sqlSession->real_escape_string($ingredients[$i]['additionalTitle']) . "')");
    }

    echo("OK");
  }

  /// returns all dishs from the database
  public static function loadFromSql($sqlSession) {
    $dishes = NamedDatabaseItem::loadNamedDatabaseItemsFromSql($sqlSession, "recipes_dishes", ", tab.category_id, tab.preparation", static::class);
    
    for($i = 0; $i < count($dishes); $i++) {
      $sql = "SELECT amount, name, additionalTitle FROM recipes_ingredients WHERE dish_id = " . $dishes[$i]->id . " ORDER BY additionalTitle, id";
      $result = $sqlSession->query($sql) or die("<b>Error:</b> Problem loading $table.<br/>" . mysqli_error($conn));
      if($result !== FALSE) {
        while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
          array_push($dishes[$i]->ingredients, array($row["amount"], $row["name"], $row["additionalTitle"]));
        }
      }
    }

    return $dishes;
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = parent::jsonSerialize();
    $retVal["categoryId"] = $this->categoryId;
    $retVal["preparation"] = $this->preparation;
    $retVal["ingredients"] = $this->ingredients;
    return $retVal;
  }
    
  /// updates a location with the given id 
  public static function update($sqlSession, $id, $name, $preparation, $ingredients, $categoryId, $image) {
    $sqlSession->query("UPDATE recipes_dishes SET name = '".  $sqlSession->real_escape_string($name) . "', preparation = '".  $sqlSession->real_escape_string($preparation) . "', category_id = $categoryId WHERE id = $id");
    
    if((strlen($image["type"]) > 5) && (strcasecmp(substr($image["type"], 0, 5), 'image') == 0)) {
      $fp = fopen($image["tmp_name"], "r");
      $imageString = "";
      while (!feof($fp)) {
        $imageString = $imageString . fread($fp, 8192);
      }
      fclose($fp);
      $newImage = DatabaseItem::resizeImage($imageString);

      $stmt = $sqlSession->prepare("UPDATE recipes_dishes SET image_size = " . strlen($newImage) . ", image = ? WHERE id =  $id");
      $stmt->bind_param("b", $null);
      $stmt->send_long_data(0, $newImage);
      $stmt->execute();
    }

    $sqlSession->query("DELETE FROM recipes_ingredients WHERE dish_id = $id");
    for($i = 0; $i < count($ingredients); $i++) {
      $sqlSession->query("INSERT INTO recipes_ingredients (dish_id, amount, name, additionalTitle) VALUES ($id, '".  
        $sqlSession->real_escape_string($ingredients[$i]['amount']) . "', '".  
        $sqlSession->real_escape_string($ingredients[$i]['name']) . "', '".  
        $sqlSession->real_escape_string($ingredients[$i]['additionalTitle']) . "')");
    }

    echo("OK");
  }
  
  /// removes a location with the given id 
  public static function remove($sqlSession, $id) {
    $sqlSession->query("DELETE FROM recipes_ingredients WHERE dish_id = $id");
    $sqlSession->query("DELETE FROM recipes_dishes WHERE id = $id");
    echo("OK");
  }
}

?>
