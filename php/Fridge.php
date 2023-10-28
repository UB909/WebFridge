<?php
 require_once(__DIR__."/sqlCredentials.php");
 require_once(__DIR__."/Category.php");
 require_once(__DIR__."/Entry.php");
 require_once(__DIR__."/Item.php");
 require_once(__DIR__."/Location.php");

class Fridge {
  /// Server Address of the MYSQL server
  protected $server = "127.0.0.1";
  
  /// Database name
  protected $database = "fridge";
  
  /// Username for MYSQL server
  protected $user = NULL;
  
  /// Password for MYSQL server
  protected $pwd = NULL;
 
  /// mysqli object handling the connection to the database
  protected $sqlSession = NULL;


  /// creates new database handler
  public function __construct() {
    global $sqlUser;
    global $sqlPassword;
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

  /// returns the entries
  public function loadEntries() {
    return Entry::loadFromSql($this->sqlSession);
  }

  /// returns the items
  public function loadItems() {
    return Item::loadFromSql($this->sqlSession);
  }

  /// returns the locations
  public function loadLocations() {
    return Location::loadFromSql($this->sqlSession);
  }

  /// loads and outputs the item image
  public function getItemImage($id) {
    $result = $this->sqlSession->query("SELECT image, image_size FROM items WHERE id = $id") or die("<b>Error:</b> Problem loading $table.<br/>" . mysqli_error($conn));
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

  /// create a new location
  public function createLocation($name) {
    return Location::create($this->sqlSession, $name);
  }

  /// create a new item
  public function createItem($name, $categoryId, $image) {
    return Item::create($this->sqlSession, $name, $categoryId, $image);
  }

  /// edit a category
  public function updateCategory($id, $name) {
    return Category::update($this->sqlSession, $id, $name);
  }

  /// edit a location
  public function updateLocation($id, $name) {
    return Location::update($this->sqlSession, $id, $name);
  }

  /// edit a item
  public function updateItem($id, $name, $categoryId, $image) {
    return Item::update($this->sqlSession, $id, $name, $categoryId, $image);
  }

  /// remove a category
  public function removeCategory($id) {
    return Category::remove($this->sqlSession, $id);
  }

  /// remove a location
  public function removeLocation($id) {
    return Location::remove($this->sqlSession, $id);
  }

  /// remove a item
  public function removeItem($id) {
    return Item::remove($this->sqlSession, $id);
  }

  /// add a new entry to the database
  public function createEntry($itemId, $locationId, $numberOfItems) {
    return Entry::create($this->sqlSession, $itemId, $locationId, $numberOfItems);
  }

  /// updates the number of items of an entry
  public function updateEntry($id, $numberOfItems) {
    Entry::update($this->sqlSession, $id, $numberOfItems);
  }
};
?>