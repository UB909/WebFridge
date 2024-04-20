var fridge = fridge || {};

fridge.Item = class {
  /// array with all items
  static items = [];

  /**
   * sort the items
   */
  static sort() {
    fridge.Item.items.sort(function (a, b) {
      if (((a.numElements != 0) && (b.numElements != 0)) ||
        ((a.numElements == 0) && (b.numElements == 0))) {
        if (a.sortName < b.sortName) {
          return -1;
        }
        else if (a.sortName > b.sortName) {
          return 1;
        }
        return 0;
      }
      else if (a.numElements < b.numElements) {
        return 1;
      }
      else if (a.numElements > b.numElements) {
        return -1;
      }
      return 0;
    });

    $("#itemContainer").empty();
    fridge.Item.items.forEach((item) => {
      $("#itemContainer").append(item.domFrame);
    });
  }

  /**
   * adds a item object to the array
   * @param {*} dataRow 
   */
  static addItem(dataRow) {
    if(fridge.Item.getById(dataRow.id) == null) {
      fridge.Item.items.push(new fridge.Item(dataRow));
    }
  }

  /**
   * returns the item with the given id
   * @param {*} id the id to search for
   * @returns the found item or null
   */
  static getById(id) {
    for (var i = 0; i < fridge.Item.items.length; i++) {
      if (fridge.Item.items[i].id == id) {
        return fridge.Item.items[i];
      }
    }
    return null;
  }



  /**
   * shows the selected item
   * @param {*} id
   */
  static show(id) {
    if (lastFilterElement) {
      lastFilterElement.classList.remove("w3-green");
      lastFilterElement = null;
    }
    document.getElementById("itemContainer").classList.add("hidden");
    document.getElementById("itemView").classList.remove("hidden");

    currentItem = fridge.Item.getById(id);
    document.getElementById("itemViewTitle").innerText = currentItem.name;
    document.getElementById("itemViewImg").src = "php/fridge/getImage.php?id=" + id + '&time=' + new Date().getTime();

    fridge.Location.locations.forEach((location) => {
      var numEntries = 0;
      currentItem.entries.forEach((entry) => {
        if (entry.locationId == location.id) {
          numEntries += entry.numberOfItems;
        }
      });

      location.domNumEntries[0].innerText = numEntries;
    });

    // Update page hash
    var hash = '#item_' + id;
    if(hash != window.location.hash) {
      window.location.hash = hash;
    }

    // scroll to top
    window.scrollTo(0,0);
  }


  constructor(dataRow) {
    this.id = dataRow.id;
    this.categoryId = dataRow.categoryId;
    this.name = dataRow.name;
    this.sortName = dataRow.name.toUpperCase();
    if (this.sortName.search("_") != -1) {
      this.sortName = this.sortName.substr(this.sortName.search("_") + 1); 
      this.viewName = this.viewName.replace("_", "");
    }

    this.domFrame = $('<div id="itemFrame_' + this.id + '" class="itemFrame " onClick="fridge.Item.show(' + this.id + ')"></div>');
    this.domNumTotal = $('<span id="itemNumTotal_' + this.id + '">0</span>');
    this.domImage = $('<img id="itemImg_' + this.id + '" class="itemImg itemGreyOut" src="php/fridge/getImage.php?id=' + this.id + '&time=' + new Date().getTime() + '" alt="' + this.name + '">');

    var tmp = $('<div class="itemImgFrame"></div>');
    tmp.append(this.domImage);
    this.domFrame.append(tmp);

    this.domItemLabel = $('<span>' + this.name + '</span>');

    tmp = $('<div class="itemLabel"></div>');
    tmp.append(this.domItemLabel);
    tmp.append(' (');
    tmp.append(this.domNumTotal);
    tmp.append(')');
    this.domFrame.append(tmp);

    this.numElements = 0;
    this.entries = [];

    fridge.addContextMenu(this.domFrame[0], "item", this.id);
  }
  
  /// gets a entry by its id
  getEntryById(id) {
    for (var i = 0; i < this.entries.length; i++) {
      if (this.entries[i].id == id) {
        return this.entries[i];
      }
    }
    return null;
  }

  /**
   * Adds a instance of an entry to this item
   * @param {Entry} entry 
   */
  updateOrAddEntry(dataRow) {
    var entry = this.getEntryById(dataRow.id);
    if(entry == null) {
      this.entries.push(new fridge.Entry(dataRow));
    }
    else {
      entry.update(dataRow);
    }
  }    

  updateNumberOfElements() {
    this.numElements = 0;
    // count number of entries
    this.entries.forEach((entry) => {
      this.numElements += entry.numberOfItems
    });

    this.domNumTotal[0].innerText = this.numElements;
    if (this.numElements != 0) {
      this.domImage[0].classList.remove("itemGreyOut");
    }
    if (this.numElements == 0) {
      this.domImage[0].classList.add("itemGreyOut");
    }
  }

  // updates data of the location
  update(newName, categoryId) {
    // just update the existing one
    this.domItemLabel[0].innerText = newName;
    this.domImage[0].setAttribute("alt", newName);
    this.name = newName;
    this.sortName = dataRow.name.toUpperCase();
    if (this.sortName.search("_") != -1) {
      this.sortName = this.sortName.substr(this.sortName.search("_") + 1); 
      this.viewName = this.viewName.replace("_", "");
    }
  }

  /// removes itself from the location
  remove() {
    this.domFrame[0].remove();
    const index = fridge.Item.items.indexOf(this);
    fridge.Item.items.splice(index, 1);
  }

  refreshImage() {
    this.domImage[0].setAttribute("src", 'php/fridge/getImage.php?id=' + this.id + '&time=' + new Date().getTime());
  }
}