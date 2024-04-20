var recipes = recipes || {};

recipes.Dish = class {
  /// array with all dishes
  static dishes = [];

  /**
   * sort the dishes
   */
  static sort() {
    recipes.Dish.dishes.sort(function (a, b) {
      if (a.sortName < b.sortName) {
        return -1;
      }
      else if (a.sortName > b.sortName) {
        return 1;
      }
      return 0;
    });

    $("#dishContainer").empty();
    recipes.Dish.dishes.forEach((dish) => {
      $("#dishContainer").append(dish.domFrame);
    });
  }

  /**
   * adds a dish object to the array
   * @param {*} dataRow 
   */
  static addDish(dataRow) {
    if(recipes.Dish.getById(dataRow.id) == null) {
      recipes.Dish.dishes.push(new recipes.Dish(dataRow));
    }
  }

  /**
   * returns the dish with the given id
   * @param {*} id the id to search for
   * @returns the found dish or null
   */
  static getById(id) {
    for (var i = 0; i < recipes.Dish.dishes.length; i++) {
      if (recipes.Dish.dishes[i].id == id) {
        return recipes.Dish.dishes[i];
      }
    }
    return null;
  }

  /** 
   * shows the selected dish
   * @param {*} id
   */
  static show(id) {
    if (recipes.lastFilterElement) {
      recipes.lastFilterElement.classList.remove("w3-green");
      recipes.lastFilterElement = null;
    }
    document.getElementById("dishContainer").classList.add("hidden");
    document.getElementById("dishView").classList.remove("hidden");

    recipes.currentDish = recipes.Dish.getById(id);
    // Name
    document.getElementById("dishName").innerText = recipes.currentDish.viewName;

    // Ingredients
    var lastAddStr = 'NOTSET';
    var s = '';
    for(var id = 0; id < recipes.currentDish.ingredients.length; id++) {
      if (lastAddStr != recipes.currentDish.ingredients[id][2]) {
        if(id != 0) {
          s = s + '</table>';
        }
        lastAddStr = recipes.currentDish.ingredients[id][2];
        if(lastAddStr) {
          s = s + '<h3>Zutaten ' + lastAddStr + ':</h3><table>';
        }else{
          s = s + '<h3>Zutaten:</h3><table>';
        }
      }
      s = s + '<tr><td class="dishIngredientAmount">' + recipes.currentDish.ingredients[id][0] + '</td>';
      s = s + '<td class="dishIngredientName">' + recipes.currentDish.ingredients[id][1] + '</td></tr>';
    }
    s = s + '</table>';
    document.getElementById('dishIngredients').innerHTML = s;
    
    // Preparation
    var blocks = recipes.currentDish.preparation.split(/\r?\n/)
    var s = "";
    for(var i = 0; i < blocks.length; i++) {
      s = s + '<p>' + blocks[i] + '</p>';
    }
    document.getElementById('dishPreparation').innerHTML = s;

    // Image
    document.getElementById('dishImg').src = 'php/recipes/getImage.php?id=' + recipes.currentDish.id + '&time=' + new Date().getTime();

    // Update page hash
    var hash = '#dish_' + recipes.currentDish.id;
    if(hash != window.location.hash) {
      window.location.hash = hash;
    }

    // scroll to top
    window.scrollTo(0,0);
  }


  constructor(dataRow) {
    this.id = dataRow.id;
    this.name = dataRow.name;
    this.viewName = dataRow.name;
    this.sortName = dataRow.name.toUpperCase();
    this.categoryId = dataRow.categoryId;
    this.preparation = dataRow.preparation;
    this.ingredients = dataRow.ingredients;

    if (this.sortName.search("_") != -1) {
      this.sortName = this.sortName.substr(this.sortName.search("_") + 1); 
      this.viewName = this.viewName.replace("_", "");
    }

    this.domFrame = $('<div id="dishOverviewFrame_' + this.id + '" class="dishOverviewFrame " onClick="recipes.Dish.show(' + this.id + ')"></div>');
    this.domImage = $('<img id="dishOverviewImg_' + this.id + '" class="dishOverviewImg" src="php/recipes/getImage.php?id=' + this.id + '&time=' + new Date().getTime() + '" alt="' + this.viewName + '">');

    var tmp = $('<div class="dishOverviewImgFrame"></div>');
    tmp.append(this.domImage);
    this.domFrame.append(tmp);

    this.domDishLabel = $('<span>' + this.viewName + '</span>');

    tmp = $('<div class="dishOverviewLabel"></div>');
    tmp.append(this.domDishLabel);
    this.domFrame.append(tmp);

    recipes.addContextMenu(this.domFrame[0], "dish", this.id);
  }
  
  // updates data of the dish
  update(dataRow) {
    // just update the existing one
    this.name = dataRow.name;
    this.viewName = dataRow.name;
    this.sortName = dataRow.name.toUpperCase();
    this.categoryId = dataRow.categoryId;
    this.preparation = dataRow.preparation;
    this.ingredients = dataRow.ingredients;

    if (this.sortName.search("_") != -1) {
      this.sortName = this.sortName.substr(this.sortName.search("_") + 1); 
      this.viewName = this.viewName.replace("_", "");
    }

    this.domDishLabel[0].innerText = this.viewName;
    this.domImage[0].setAttribute("alt", this.viewName);
  }

  /// removes itself from the location
  remove() {
    this.domFrame[0].remove();
    const index = recipes.Dish.dishes.indexOf(this);
    recipes.Dish.dishes.splice(index, 1);
  }

  refreshImage() {
    this.domImage[0].setAttribute("src", 'php/recipes/getImage.php?id=' + this.id + '&time=' + new Date().getTime());
  }
}