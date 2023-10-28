<?php
require_once("DatabaseItem.php");

/// named database item
class NamedDatabaseItem extends DatabaseItem {
  /// name of the named database item
  protected $name;

  /// creates named database item from database row
  protected function __construct($row) {
    parent::__construct($row);
    $this->name = $row["name"];
  }

  /// returns all items from the database
  protected static function loadNamedDatabaseItemsFromSql($sqlSession, $table, $additionalSqlFields, $targetClass) {
    return DatabaseItem::loadDatabaseItemsFromSql($sqlSession, $table, ", tab.name" . $additionalSqlFields, $targetClass, "tab.name DESC", '');
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = parent::jsonSerialize();
    $retVal["name"] = $this->name;
    return $retVal;
  }
}

?>