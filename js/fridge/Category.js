var fridge = fridge || {};

fridge.Category = class {
  /// array with all categories
  static categories = [];

  /**
   * sort the categories
   */
  static sort() {
    fridge.Category.categories.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    $("#categories").empty();
    $("#newItemDialogCategory").empty();
    $("#editItemDialogCategory").empty();
    fridge.Category.categories.forEach((category) => {
      $("#categories").append(category.domButton);
      $("#newItemDialogCategory").append(category.domNewItemDropdown);
      $("#editItemDialogCategory").append(category.domEditItemDropdown);
    });
  }

  /**
   * adds a category object to the array
   * @param {*} dataRow 
   */
  static addCategory(dataRow) {
    if (fridge.Category.getById(dataRow.id) == null) {
      fridge.Category.categories.push(new fridge.Category(dataRow));
    }
  }

  /**
   * returns the category with the given id
   * @param {*} id the id to search for
   * @returns the found item or null
   */
  static getById(id) {
    for (var i = 0; i < fridge.Category.categories.length; i++) {
      if (fridge.Category.categories[i].id == id) {
        return fridge.Category.categories[i];
      }
    }
    return null;
  }

  /**
   * filter the view to show only items of the given category
   * @param {*} id category to show or -1 to show all items
   */
  static show(id) {
    // go through all items and check if it should be shown
    fridge.Item.items.forEach((item) => {
      if (item.categoryId == id || id == -1) {
        item.domFrame[0].classList.remove("hidden");
        item.domNumTotal[0].innerText = item.numElements;
      } else {
        item.domFrame[0].classList.add("hidden");
      }
    });

    // highlight the button
    if (lastFilterElement) {
      lastFilterElement.classList.remove("w3-green");
    }
    lastFilterElement = document.getElementById("category_" + id);
    lastFilterElement.classList.add("w3-green");

    document.getElementById("itemContainer").classList.remove("hidden");
    document.getElementById("itemView").classList.add("hidden");

    // Update page hash
    var hash = '';
    if (id == -1) {
      hash = '#cat_all';
    }
    else {
      hash = '#cat_' + id;
    }

    if(hash != window.location.hash) {
      window.location.hash = hash;
    }
  }

  constructor(dataRow) {
    this.id = dataRow.id;
    this.name = dataRow.name;
    this.domButton = $(
      '<button id="category_' +
      this.id +
      '" class="w3-bar-item w3-button" onClick="fridge.Category.show(' +
      this.id +
      ')">' +
      this.name +
      "</button>"
    );

    this.domNewItemDropdown = $('<option value="' + this.id + '">' + this.name + "</option>");
    this.domEditItemDropdown = $('<option value="' + this.id + '">' + this.name + "</option>");
    fridge.addContextMenu(this.domButton[0], "category", this.id);
  }

  // updates data of the category
  update(newName) {
    // just update the existing one
    this.name = newName;
    this.domButton[0].innerText = newName;
  }

  /// removes itself from the DOM
  remove() {
    this.domButton[0].remove();
    const index = fridge.Category.categories.indexOf(this);
    fridge.Category.categories.splice(index, 1);
  }
}