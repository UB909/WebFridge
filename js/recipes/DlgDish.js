var recipes = recipes || {};

recipes.DlgDish = class {
  /// Initializes the class
  static ready() {
    // load static dom elements
    recipes.DlgDish.domDlg = document.getElementById('dlgDish');
    recipes.DlgDish.domLabel = document.getElementById('dlgDishLabel');
    recipes.DlgDish.domForm = document.getElementById('dlgDishForm');
    recipes.DlgDish.domId = document.getElementById('dlgDishId');
    recipes.DlgDish.domName = document.getElementById('dlgDishName');
    recipes.DlgDish.domCategory = document.getElementById('dlgDishCategory');
    recipes.DlgDish.domFile = document.getElementById('dlgDishFile');
    recipes.DlgDish.domFileLabel = document.getElementById('dlgDishFileLabel');
    recipes.DlgDish.domPreparation = document.getElementById('dlgDishPreparation');
    recipes.DlgDish.domIngredients = document.getElementById('dlgDishIngredients');
    recipes.DlgDish.domIngredientsEditFields = [];
    recipes.DlgDish.domSubmit = document.getElementById('dlgDishSubmit');

    // attach the event handlers:
    $("#dlgDishAdd").click(function () {
      recipes.DlgDish.openDialogNew();
    });

    $("#dlgDishCancel").click(function () {
      recipes.DlgDish.closeDialog();
    });

    $("#dlgDishFile").change(function () {
      recipes.DlgDish.fileSelected()
    });

    $(document).on("submit", "form#dlgDishForm", function (event) {
      recipes.DlgDish.submit(event)
    });
  }

  static reloadCategories() {
    $("#dlgDishCategory").empty();
    recipes.Category.categories.forEach((category) => {
      $("#dlgDishCategory").append($('<option value="' + category.id + '">' + category.name + "</option>"));
    });
  }

  static openDialogNew() {
    this.openDialog('Neues Gericht', 'create', -1, '', recipes.Category.categories[0].id, '', 'Hinzufügen');
  }

  static openDialogUpdate(id) {
    var dish = recipes.Dish.getById(id);
    this.openDialog('Gericht Bearbeiten', 'update', id, dish.name, dish.categoryId, dish.preparation, 'Speichern');

    for(var i = 0; i < dish.ingredients.length; i++) {
      recipes.DlgDish.domIngredientsEditFields[i][0].value = dish.ingredients[i][0];
      recipes.DlgDish.domIngredientsEditFields[i][1].value = dish.ingredients[i][1];
      recipes.DlgDish.domIngredientsEditFields[i][2].value = dish.ingredients[i][2];
      recipes.DlgDish.addIngredientsRow();
    }
  }

  static openDialog(label, action, id, name, categoryId, preparation, submitButtonlabel) {
    recipes.DlgDish.domLabel.innerText = label;
    recipes.DlgDish.domForm.action = 'php/recipes/' + action + '.php';
    recipes.DlgDish.domId.value = id;
    recipes.DlgDish.domName.value = name;
    recipes.DlgDish.domCategory.value = categoryId;
    recipes.DlgDish.domPreparation.value = preparation;
    recipes.DlgDish.domFileLabel.innerText = 'Bild auswählen';
    recipes.DlgDish.domSubmit.innerText = submitButtonlabel;

    recipes.DlgDish.resetIngredients();
    recipes.DlgDish.addIngredientsRow();

    // show dialog
    recipes.DlgDish.domDlg.style.display = 'block';
  }

  static closeDialog() {
    var dish = recipes.Dish.getById(recipes.DlgDish.domId.value);
    if(dish) {
      dish.refreshImage();
    }

    recipes.DlgDish.domId.value = -1;

    // hide dialog
    recipes.DlgDish.domDlg.style.display = 'none';
  }

  static fileSelected() {
    var file = recipes.DlgDish.domFile.value;
    var fileName = file.split("\\");
    var fileName = fileName[fileName.length - 1].split("/");
    recipes.DlgDish.domFileLabel.innerText = fileName[fileName.length - 1];
  }

  static submit(event) {
    event.preventDefault();
    $.ajax({
      url: recipes.DlgDish.domForm.action,
      type: recipes.DlgDish.domForm.method,
      dataType: "TEXT",
      data: new FormData(recipes.DlgDish.domForm),
      processData: false,
      contentType: false,
      success: function (data, status) {
        if (data == "OK") {
          recipes.updateData();
          recipes.DlgDish.closeDialog();
        }
        else {
          alert(data);
        }
      },
    });
  }

  static resetIngredients() {
    recipes.DlgDish.domIngredients.innerHTML = "";
    recipes.DlgDish.domIngredientsEditFields = [];
  }

  static addIngredientsRowIfNecessary() {
    var nextId = recipes.DlgDish.domIngredientsEditFields.length;
    
    if (nextId == 0) {
      recipes.DlgDish.addIngredientsRow();
    }
    else {
      var lastAmount = recipes.DlgDish.domIngredientsEditFields[nextId-1][0].value;
      var lastName = recipes.DlgDish.domIngredientsEditFields[nextId-1][1].value;
      
      if ((lastAmount.length != 0) || (lastName.length != 0)) {
        recipes.DlgDish.addIngredientsRow();
      }
    }
  }

  static addIngredientsRow() {
    var id = recipes.DlgDish.domIngredientsEditFields.length;
    var lastAdditionalTitle = '';
    if(id != 0) {
      lastAdditionalTitle = recipes.DlgDish.domIngredientsEditFields[id-1][2].value;
    }

    var editFields = [];

    var row = document.createElement("div");
    row.className = "w3-row";

    // Amount
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s2";
    
    var editField = document.createElement("input");
    editFields.push(editField);
    col.appendChild(editField);
    editField.tabIndex = (2*id + 1);
    editField.className = "w3-input";
    editField.name = "ingredients_amount_" + id;
    editField.type = "text";
    editField.placeholder = "1kg";
    editField.addEventListener("change", recipes.DlgDish.addIngredientsRowIfNecessary);

    // Name
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s5";
    
    var editField = document.createElement("input");
    editFields.push(editField);
    col.appendChild(editField);
    editField.tabIndex = (2*id + 2);
    editField.className = "w3-input";
    editField.name = "ingredients_name_" + id;
    editField.type = "text";
    editField.placeholder = "Zutat";
    editField.addEventListener("change", recipes.DlgDish.addIngredientsRowIfNecessary);

    // additional title
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s4";
    
    var editField = document.createElement("input");
    editFields.push(editField);
    col.appendChild(editField);
    editField.className = "w3-input";
    editField.name = "ingredients_additionalTitle_" + id;
    editField.type = "text";
    editField.value = lastAdditionalTitle;
    editField.placeholder = "zusätzl. Zutaten Typ";
    editField.addEventListener("change", recipes.DlgDish.addIngredientsRowIfNecessary);

    // Delete Button
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s1";
    col.innerHTML = '<button id="ingredients_delete_' + id + '" class="w3-bar-item w3-button" onclick="recipes.DlgDish.deleteIngredient(this)"><i class="glyphicon glyphicon-remove"></i></button>';

    recipes.DlgDish.domIngredients.appendChild(row);
    recipes.DlgDish.domIngredientsEditFields.push(editFields);
  }

  static deleteIngredient(deleteButton) {
    var id = parseInt(deleteButton.id.substr(19));
    var row = deleteButton.parentNode.parentNode;
    recipes.DlgDish.domIngredients.removeChild(row);
    recipes.DlgDish.domIngredientsEditFields.splice(id, 1);
    
    for(; id < recipes.DlgDish.domIngredientsEditFields.length; id++) {
      recipes.DlgDish.domIngredientsEditFields[id][0].name = 'ingredients_amount_' + id;
      recipes.DlgDish.domIngredientsEditFields[id][1].name = 'ingredients_name_' + id;
      recipes.DlgDish.domIngredientsEditFields[id][2].name = 'ingredients_additionalTitle_' + id;
    }

    recipes.DlgDish.addIngredientsRowIfNecessary();
  }
  
}
