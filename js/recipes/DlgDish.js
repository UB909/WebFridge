class DlgDish {
    /// Initializes the class
  static ready() {
    // load static dom elements
    DlgDish.domDlg = document.getElementById('dlgDish');
    DlgDish.domLabel = document.getElementById('dlgDishLabel');
    DlgDish.domForm = document.getElementById('dlgDishForm');
    DlgDish.domId = document.getElementById('dlgDishId');
    DlgDish.domName = document.getElementById('dlgDishName');
    DlgDish.domCategory = document.getElementById('dlgDishCategory');
    DlgDish.domFile = document.getElementById('dlgDishFile');
    DlgDish.domFileLabel = document.getElementById('dlgDishFileLabel');
    DlgDish.domPreparation = document.getElementById('dlgDishPreparation');
    DlgDish.domIngredients = document.getElementById('dlgDishIngredients');
    DlgDish.domIngredientsEditFields = [];
    DlgDish.domSubmit = document.getElementById('dlgDishSubmit');

    // attach the event handlers:
    $("#dlgDishAdd").click(function () {
      DlgDish.openDialogNew();
    });

    $("#dlgDishCancel").click(function () {
      DlgDish.closeDialog();
    });

    $("#dlgDishFile").change(function () {
      DlgDish.fileSelected()
    });

    $(document).on("submit", "form#dlgDishForm", function (event) {
      DlgDish.submit(event)
    });
  }

  static reloadCategories() {
    $("#dlgDishCategory").empty();
    Category.categories.forEach((category) => {
      $("#dlgDishCategory").append($('<option value="' + category.id + '">' + category.name + "</option>"));
    });
  }

  static openDialogNew() {
    this.openDialog('Neues Gericht', 'create', -1, '', Category.categories[0].id, '', 'Hinzufügen');
  }

  static openDialogUpdate(id) {
    var dish = Dish.getById(id);
    this.openDialog('Gericht Bearbeiten', 'update', id, dish.name, dish.categoryId, dish.preparation, 'Speichern');

    for(var i = 0; i < dish.ingredients.length; i++) {
      DlgDish.domIngredientsEditFields[i][0].value = dish.ingredients[i][0];
      DlgDish.domIngredientsEditFields[i][1].value = dish.ingredients[i][1];
      DlgDish.addIngredientsRow();
    }
  }

  static openDialog(label, action, id, name, categoryId, preparation, submitButtonlabel) {
    DlgDish.domLabel.innerText = label;
    DlgDish.domForm.action = 'php/recipes/' + action + '.php';
    DlgDish.domId.value = id;
    DlgDish.domName.value = name;
    DlgDish.domCategory.value = categoryId;
    DlgDish.domPreparation.value = preparation;
    DlgDish.domFileLabel.innerText = 'Bild auswählen';
    DlgDish.domSubmit.innerText = submitButtonlabel;

    DlgDish.resetIngredients();
    DlgDish.addIngredientsRow();

    // show dialog
    DlgDish.domDlg.style.display = 'block';
  }

  static closeDialog() {
    var dish = Dish.getById(DlgDish.domId.value);
    if(dish) {
      dish.refreshImage();
    }

    DlgDish.domId.value = -1;

    // hide dialog
    DlgDish.domDlg.style.display = 'none';
  }

  static fileSelected() {
    var file = DlgDish.domFile.value;
    var fileName = file.split("\\");
    var fileName = fileName[fileName.length - 1].split("/");
    DlgDish.domFileLabel.innerText = fileName[fileName.length - 1];
  }

  static submit(event) {
    event.preventDefault();
    $.ajax({
      url: DlgDish.domForm.action,
      type: DlgDish.domForm.method,
      dataType: "TEXT",
      data: new FormData(DlgDish.domForm),
      processData: false,
      contentType: false,
      success: function (data, status) {
        if (data == "OK") {
          updateData();
          DlgDish.closeDialog();
        }
        else {
          alert(data);
        }
      },
    });
  }

  static resetIngredients() {
    DlgDish.domIngredients.innerHTML = "";
    DlgDish.domIngredientsEditFields = [];
  }

  static addIngredientsRowIfNecessary() {
    var lastId = DlgDish.domIngredientsEditFields.length;
    
    if (lastId == 0) {
      DlgDish.addIngredientsRow();
    }
    else {
      var lastAmount = DlgDish.domIngredientsEditFields[lastId-1][0].value;
      var lastName = DlgDish.domIngredientsEditFields[lastId-1][1].value;

      if ((lastAmount.length != 0) || (lastName.length != 0)) {
        DlgDish.addIngredientsRow();
      }
    }
  }

  static addIngredientsRow() {
    var id = DlgDish.domIngredientsEditFields.length;

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
    editField.className = "w3-input";
    editField.name = "ingredients_amount_" + id;
    editField.type = "text";
    editField.placeholder = "1kg";
    editField.addEventListener("change", DlgDish.addIngredientsRowIfNecessary);

    // Name
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s9";
    
    var editField = document.createElement("input");
    editFields.push(editField);
    col.appendChild(editField);
    editField.className = "w3-input";
    editField.name = "ingredients_name_" + id;
    editField.type = "text";
    editField.placeholder = "Zutat";
    editField.addEventListener("change", DlgDish.addIngredientsRowIfNecessary);

    // Delete Button
    var col = document.createElement("div");
    row.appendChild(col);
    col.className = "w3-col s1";
    col.innerHTML = '<button id="ingredients_delete_' + id + '" class="w3-bar-item w3-button" onclick="DlgDish.deleteIngredient(this)"><i class="glyphicon glyphicon-remove"></i></button>';

    DlgDish.domIngredients.appendChild(row);
    DlgDish.domIngredientsEditFields.push(editFields);
  }

  static deleteIngredient(deleteButton) {
    var id = parseInt(deleteButton.id.substr(19));
    var row = deleteButton.parentNode.parentNode;
    DlgDish.domIngredients.removeChild(row);
    DlgDish.domIngredientsEditFields.splice(id, 1);
    
    for(; id < DlgDish.domIngredientsEditFields.length; id++) {
      DlgDish.domIngredientsEditFields[id][0].name = 'ingredients_amount_' + id;
      DlgDish.domIngredientsEditFields[id][1].name = 'ingredients_name_' + id;
    }

    DlgDish.addIngredientsRowIfNecessary();
  }
  
}

$(document).ready(function () {
  DlgDish.ready();
});