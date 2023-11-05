class Category {
  /// array with all categories
  static categories = [];

  /**
   * sort the categories
   */
  static sort() {
    Category.categories.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    $("#categories").empty();
    DlgDish.reloadCategories();
    Category.categories.forEach((category) => {
      $("#categories").append(category.domButton);
    });
  }

  /**
   * adds a category object to the array
   * @param {*} dataRow 
   */
  static addCategory(dataRow) {
    if(Category.getById(dataRow.id) == null) {
      Category.categories.push(new Category(dataRow));
    }
  }

  /**
   * returns the category with the given id
   * @param {*} id the id to search for
   * @returns the found item or null
   */
  static getById(id) {
    for (var i = 0; i < Category.categories.length; i++) {
      if (Category.categories[i].id == id) {
        return Category.categories[i];
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
    Dish.dishes.forEach((dish) => {
      if (dish.categoryId == id || id == -1) {
        dish.domFrame[0].classList.remove("hidden");
      } else {
        dish.domFrame[0].classList.add("hidden");
      }
    });

    // highlight the button
    if (lastFilterElement) {
      lastFilterElement.classList.remove("w3-green");
    }
    lastFilterElement = document.getElementById("category_" + id);
    lastFilterElement.classList.add("w3-green");

    document.getElementById("dishContainer").classList.remove("hidden");
    document.getElementById("dishView").classList.add("hidden");
  }

  constructor(dataRow) {
    this.id = dataRow.id;
    this.name = dataRow.name;
    this.domButton = $(
      '<button id="category_' +
      this.id +
      '" class="w3-bar-item w3-button" onClick="Category.show(' +
      this.id +
      ')">' +
      this.name +
      "</button>"
    );

    addContextMenu(this.domButton[0], "category", this.id);
  }

  // updates data of the category
  update(dataRow) {
    // just update the existing one
    this.name = dataRow.name;
    this.domButton[0].innerText = dataRow.name;
  }

  /// removes itself from the DOM
  remove() {
    this.domButton[0].remove();
    const index = Category.categories.indexOf(this);
    Category.categories.splice(index, 1);
  }
}