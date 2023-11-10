class Dish {
  /// array with all dishes
  static dishes = [];

  /**
   * sort the dishes
   */
  static sort() {
    Dish.dishes.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      else if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    $("#dishContainer").empty();
    Dish.dishes.forEach((dish) => {
      $("#dishContainer").append(dish.domFrame);
    });
  }

  /**
   * adds a dish object to the array
   * @param {*} dataRow 
   */
  static addDish(dataRow) {
    if(Dish.getById(dataRow.id) == null) {
      Dish.dishes.push(new Dish(dataRow));
    }
  }

  /**
   * returns the dish with the given id
   * @param {*} id the id to search for
   * @returns the found dish or null
   */
  static getById(id) {
    for (var i = 0; i < Dish.dishes.length; i++) {
      if (Dish.dishes[i].id == id) {
        return Dish.dishes[i];
      }
    }
    return null;
  }

  /** 
   * shows the selected dish
   * @param {*} id
   */
  static show(id) {
    if (lastFilterElement) {
      lastFilterElement.classList.remove("w3-green");
      lastFilterElement = null;
    }
    document.getElementById("dishContainer").classList.add("hidden");
    document.getElementById("dishView").classList.remove("hidden");

    currentDish = Dish.getById(id);
    // Name
    document.getElementById("dishName").innerText = currentDish.name;

    // Ingredients
    var lastAddStr = 'NOTSET';
    var s = '';
    for(var id = 0; id < currentDish.ingredients.length; id++) {
      if (lastAddStr != currentDish.ingredients[id][2]) {
        if(id != 0) {
          s = s + '</table>';
        }
        lastAddStr = currentDish.ingredients[id][2];
        if(lastAddStr) {
          s = s + '<h3>Zutaten ' + lastAddStr + ':</h3><table>';
        }else{
          s = s + '<h3>Zutaten:</h3><table>';
        }
      }
      s = s + '<tr><td class="dishIngredientAmount">' + currentDish.ingredients[id][0] + '</td>';
      s = s + '<td class="dishIngredientName">' + currentDish.ingredients[id][1] + '</td></tr>';
    }
    s = s + '</table>';
    document.getElementById('dishIngredients').innerHTML = s;
    
    // Preparation
    var blocks = currentDish.preparation.split(/\r?\n/)
    var s = "";
    for(var i = 0; i < blocks.length; i++) {
      s = s + '<p>' + blocks[i] + '</p>';
    }
    document.getElementById('dishPreparation').innerHTML = s;

    // Image
    document.getElementById('dishImg').src = 'php/recipes/getImage.php?id=' + currentDish.id + '&time=' + new Date().getTime();

  }


  constructor(dataRow) {
    this.id = dataRow.id;
    this.name = dataRow.name;
    this.categoryId = dataRow.categoryId;
    this.preparation = dataRow.preparation;
    this.ingredients = dataRow.ingredients;

    this.domFrame = $('<div id="dishOverviewFrame_' + this.id + '" class="dishOverviewFrame " onClick="Dish.show(' + this.id + ')"></div>');
    this.domImage = $('<img id="dishOverviewImg_' + this.id + '" class="dishOverviewImg" src="php/recipes/getImage.php?id=' + this.id + '&time=' + new Date().getTime() + '" alt="' + this.name + '">');

    var tmp = $('<div class="dishOverviewImgFrame"></div>');
    tmp.append(this.domImage);
    this.domFrame.append(tmp);

    this.domDishLabel = $('<span>' + this.name + '</span>');

    tmp = $('<div class="dishOverviewLabel"></div>');
    tmp.append(this.domDishLabel);
    this.domFrame.append(tmp);

    addContextMenu(this.domFrame[0], "dish", this.id);
  }
  
  // updates data of the location
  update(dataRow) {
    // just update the existing one
    this.domDishLabel[0].innerText = dataRow.name;
    this.domImage[0].setAttribute("alt", dataRow.name);

    this.name = dataRow.name;
    this.categoryId = dataRow.categoryId;
    this.preparation = dataRow.preparation;
    this.ingredients = dataRow.ingredients;
  }

  /// removes itself from the location
  remove() {
    this.domFrame[0].remove();
    const index = Dish.dishes.indexOf(this);
    Dish.dishes.splice(index, 1);
  }

  refreshImage() {
    this.domImage[0].setAttribute("src", 'php/recipes/getImage.php?id=' + this.id + '&time=' + new Date().getTime());
  }
}