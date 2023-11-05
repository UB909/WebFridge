<?php
 require_once(__DIR__."/../sqlCredentials.php");
 require_once(__DIR__."/../shared/Category.php");
 require_once(__DIR__."/Dish.php");

class Recipes {
  /// Server Address of the MYSQL server
  protected $server = "127.0.0.1";
  
  /// Database name
  protected $database = NULL;
  
  /// Username for MYSQL server
  protected $user = NULL;
  
  /// Password for MYSQL server
  protected $pwd = NULL;
 
  /// mysqli object handling the connection to the database
  protected $sqlSession = NULL;


  /// creates new database handler
  public function __construct() {
    global $sqlDatabase;
    global $sqlUser;
    global $sqlPassword;
    $this->database = $sqlDatabase;
    $this->user = $sqlUser;
    $this->pwd = $sqlPassword;
    $this->sqlSession = new mysqli($this->server, 
                                   $this->user,
                                   $this->pwd,
                                   $this->database);
  }

  /// returns the categories
  public function loadCategories() {
    return Category::loadFromSql($this->sqlSession);
  }

  /// returns the dishs
  public function loadDishs() {
    return Dish::loadFromSql($this->sqlSession);
  }

   /// loads and outputs the dish image
  public function getDishImage($id) {
    $result = $this->sqlSession->query("SELECT image, image_size FROM recipes_dishes WHERE id = $id") or die("<b>Error:</b> Problem loading $table.<br/>" . mysqli_error($conn));
    $row = mysqli_fetch_array($result);
    $type = 'image/jpeg';
    header('Content-Type:'.$type);
    header('Content-Length: ' . $row["image_size"]);
    echo($row["image"]);
  }

  /// create a new category
  public function createCategory($name) {
    return Category::create($this->sqlSession, $name);
  }

  /// create a new dish
  public function createDish($name, $preparation, $ingredients, $categoryId, $image) {
    return Dish::create($this->sqlSession, $name, $preparation, $ingredients, $categoryId, $image);
  }

  /// edit a category
  public function updateCategory($id, $name) {
    return Category::update($this->sqlSession, $id, $name);
  }

  /// edit a dish
  public function updateDish($id, $name, $preparation, $ingredients, $categoryId, $image) {
    return Dish::update($this->sqlSession, $id, $name, $preparation, $ingredients, $categoryId, $image);
  }

  /// remove a category
  public function removeCategory($id) {
    return Category::remove($this->sqlSession, $id);
  }

  /// remove a dish
  public function removeDish($id) {
    return Dish::remove($this->sqlSession, $id);
  }
};
?>