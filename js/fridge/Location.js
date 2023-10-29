class Location {
  /// array with all locations
  static locations = [];

  /**
   * sort the locations
   */
  static sort() {
    Location.locations.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    $("#locations").empty();
    $("#itemViewLocations").empty();
    Location.locations.forEach((location) => {
      $("#locations").append(location.domList);
      $("#itemViewLocations").append(location.domItemView);
    });
  }

  /**
   * adds a location object to the array
   * @param {*} dataRow 
   */
  static addLocation(dataRow) {
    if(Location.getById(dataRow.id) == null) {
      Location.locations.push(new Location(dataRow));
    }
  }

  /**
   * returns the location with the given id
   * @param {*} id the id to search for
   * @returns the found item or null
   */
  static getById(id) {
    for (var i = 0; i < Location.locations.length; i++) {
      if (Location.locations[i].id == id) {
        return Location.locations[i];
      }
    }
    return null;
  }

  /**
   * filter the view to show only items at a given location
   * @param {*} id location to show
   */
  static show(id) {
    // go through all items and check if they are located at the given location
    Item.items.forEach((item) => {
      var numberOfItems = 0;
      // check all records for the location / item combination
      item.entries.forEach((entry) => {
        if (entry.locationId == id) {
          numberOfItems += entry.numberOfItems;
        }
      });

      if (numberOfItems == 0) {
        item.domFrame[0].classList.add("hidden");
      } else {
        item.domFrame[0].classList.remove("hidden");
        item.domNumTotal[0].innerText = numberOfItems;
      }
    });

    // highlight the button
    if (lastFilterElement) {
      lastFilterElement.classList.remove("w3-green");
    }
    lastFilterElement = document.getElementById("location_" + id);
    lastFilterElement.classList.add("w3-green");

    document.getElementById("itemContainer").classList.remove("hidden");
    document.getElementById("itemView").classList.add("hidden");
  }

  constructor(dataRow) {
    this.id = dataRow.id;
    this.name = dataRow.name;

    this.domList = $(
      '<button id="location_' +
      this.id +
      '"class="w3-bar-item w3-button" onClick="Location.show(' +
      this.id +
      ')">' +
      this.name +
      "</button>"
    );

    this.domItemView = $('<div class="locationFrame w3-xlarge"></div>');
    this.domNumEntries = $('<div id="location_' + this.id + '_numEntries" class="w3-right locationButton locationEntry">0</div>');
    this.domItemName = $(
      '<div class="w3-left locationEntry" style="height:100%;">' +
      this.name +
      "</div>");
    this.domItemView.append(this.domItemName);
    this.domItemView.append(
      '<div class="w3-green w3-right w3-button locationButton locationEntry" onclick="Entry.increaseEntry(' +
      this.id +
      ')">+</div>');
    this.domItemView.append(this.domNumEntries);
    this.domItemView.append(
      '  <div class="w3-red w3-right w3-button locationButton locationEntry" onclick="Entry.decreaseEntry(' +
      this.id +
      ')">-</div>'
    );

    addContextMenu(this.domList[0], "location", this.id);
  }
  
  // updates data of the location
  update(newName) {
    // just update the existing one
    this.domList[0].innerText = newName;
    this.domItemName[0].innerText = newName;
    this.name = newName;
  }

  /// removes itself from the location
  remove() {
    this.domList[0].remove();
    this.domItemView[0].remove();
    const index = Location.locations.indexOf(this);
    Location.locations.splice(index, 1);
  }
}