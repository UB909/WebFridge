<?php
require_once("../shared/DatabaseItem.php");

/// entry
class Entry extends DatabaseItem {
  /// id of the item to which the entry belongs
  protected $itemId;

  /// location of the entry
  protected $locationId;

  /// number of item at the location
  protected $numberOfItems;

  /// creates entry from database row
  public function __construct($row) {
    parent::__construct($row);
    $this->itemId = (int)$row["item_id"];
    $this->locationId = (int)$row["location_id"];
    $this->numberOfItems = (int)$row["number_of_items"];
  }

  /// creates a entry in the history table and main table with the given name
  public static function create($sqlSession, $itemId, $locationId, $numberOfItems) {
    $sqlSession->query("INSERT INTO entries (item_id, location_id, number_of_items) VALUES ($itemId, $locationId, $numberOfItems)");
    $lastId = $sqlSession->insert_id;

    return DatabaseItem::loadDatabaseItemsFromSql($sqlSession, "entries", ", tab.item_id, tab.location_id, tab.number_of_items", static::class, "tab.id", "AND tab.id = $lastId")[0];
  }

  /// updates the number of items of an entry
  public static function update($sqlSession, $id, $numberOfItems) {
    $ret = $sqlSession->query("SELECT id FROM entries WHERE id = $id");
    if(($ret === FALSE) || ($ret->num_rows != 1)) {
      die("entry not found!");      
    }

    $sqlSession->query("UPDATE entries SET number_of_items = $numberOfItems WHERE id = $id");
    echo("OK");
  }
  
  /// returns all entries from the database
  public static function loadFromSql($sqlSession) {
    return DatabaseItem::loadDatabaseItemsFromSql($sqlSession, "entries", ", tab.item_id, tab.location_id, tab.number_of_items", static::class, "tab.id", '');
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = parent::jsonSerialize();
    $retVal["itemId"] = $this->itemId;
    $retVal["locationId"] = $this->locationId;
    $retVal["numberOfItems"] = $this->numberOfItems;
    return $retVal;
  }
}

?>