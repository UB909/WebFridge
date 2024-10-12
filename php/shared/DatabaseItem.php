<?php

/// database item
class DatabaseItem implements JsonSerializable {
  /// id of the database item
  protected $id;

  /// creates database item from database row
  protected function __construct($row) {
    $this->id = (int)$row["id"];
  }

  /// Resizes a png
  public static function resizeImage($imgString) {
    $image = imagecreatefromstring($imgString);
    $width = imagesx($image);
    $height = imagesy($image);
    $scale = 400.0 / $width;
    $dst_width = $scale * $width;
    $dst_height = $scale * $height;

    $newImg = imagecreatetruecolor($dst_width, $dst_height);
    imagefill($newImg, 0, 0, imagecolorallocate($newImg, 255, 255, 255));
    imagealphablending($newImg, true);
    imagecopyresampled($newImg, $image, 0, 0, 0, 0, $dst_width, $dst_height, $width, $height);
    imagedestroy($image);

    ob_start();
    imagejpeg($newImg, null, 50); // 0 = worst / smaller file, 100 = better / bigger file
    $imgString = ob_get_clean();
    imagedestroy($newImg);

    return $imgString;
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
