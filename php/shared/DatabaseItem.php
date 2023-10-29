<?php

/// database item
class DatabaseItem implements JsonSerializable {
  /// id of the database item
  protected $id;

  /// creates database item from database row
  protected function __construct($row) {
    $this->id = (int)$row["id"];
  }

  /// returns all database items from the database
  protected static function loadDatabaseItemsFromSql($sqlSession, $table, $additionalSqlFields, $targetClass, $orderBy, $additionalWhere) {
    $returnVal = array();
    $table_history = $table . '_history';
    $sql = "SELECT tab.id $additionalSqlFields FROM $table tab WHERE TRUE $additionalWhere ORDER BY $orderBy";

    $result = $sqlSession->query($sql) or die("<b>Error:</b> Problem loading $table.<br/>" . mysqli_error($conn));
    if($result !== FALSE) {
      while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
        array_push($returnVal, new $targetClass($row));
      }
    }
    return $returnVal;
  }

  /// serialization to JSON
  public function jsonSerialize() {
    $retVal = array();
    $retVal["id"] = $this->id;
    return $retVal;
  }
}

?>