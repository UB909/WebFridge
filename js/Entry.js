class Entry {
  /**
   * Increases the number of entries for the @ref currentItem at a given location
   * @param {*} id id of the location
   */
  static increaseEntry(id) {
    var value = 1;
    var entry = -1;
    for (var iEntry = 0; iEntry < currentItem.entries.length; iEntry++) {
      if (currentItem.entries[iEntry].locationId == id) {
        currentItem.entries[iEntry].numberOfItems++;
        currentItem.numElements++;
        currentItem.domNumTotal[0].innerText = currentItem.numElements;

        value = currentItem.entries[iEntry].numberOfItems;
        entry = currentItem.entries[iEntry].id;
        break;
      }
    }
    Location.getById(id).domNumEntries[0].innerText = value;

    if(entry == -1) {
      // update database
      $.getJSON(
        "php/createEntry.php?itemId=" +
        currentItem.id +
        "&locationId=" +
        id +
        "&numberOfItems=" + value, 
        function (data, status) { 
          var item = Item.getById(data.itemId);
          item.updateOrAddEntry(data);
          item.updateNumberOfElements();
        }
      );
    }
    else {
      $.get(
        "php/updateEntry.php?id=" +
        entry +
        "&numberOfItems=" + value, 
        function (data, status) { 
          if (data != "OK") {
            alert(data);
          }
        }
      );
    }
  }

  /**
   * Increases the number of entries for the @ref currentItem at a given location
   * @param {*} id idi of the location
   */
  static decreaseEntry(id) {
    var value = 0;
    var entry = -1;
    for (var iEntry = 0; iEntry < currentItem.entries.length; iEntry++) {
      if ((currentItem.entries[iEntry].locationId == id) && (currentItem.entries[iEntry].numberOfItems > 0)) {
        currentItem.entries[iEntry].numberOfItems--;
        currentItem.numElements--;
        currentItem.domNumTotal[0].innerText = currentItem.numElements;
        if(currentItem.numElements == 0) {
          currentItem.updateNumberOfElements();
        }

        value = currentItem.entries[iEntry].numberOfItems;
        entry = currentItem.entries[iEntry].id;
        break;
      }
    }

    if(entry != -1) {
      Location.getById(id).domNumEntries[0].innerText = value;

      $.get(
        "php/updateEntry.php?id=" +
        entry +
        "&numberOfItems=" + value, 
        function (data, status) { 
          if (data != "OK") {
            alert(data);
          }
        }
      );
    }
  }

  constructor(dataRow) {
    this.id = dataRow.id;
    this.itemId = dataRow.itemId;
    this.locationId = dataRow.locationId;
    this.numberOfItems = dataRow.numberOfItems;
  }

  update(dataRow) {
    this.itemId = dataRow.itemId;
    this.locationId = dataRow.locationId;
    this.numberOfItems = dataRow.numberOfItems;
  }
}