$("#newItemShowDialog").click(function () {
  openNewItemDialog();
});

$("#newItemCancel").click(function () {
  closeNewItemDialog();
});

$("#editItemCancel").click(function () {
  closeEditItemDialog();
});

$("#newItemDialogFile").change(function (obj) {
  var file = document.getElementById('newItemDialogFile').value;
  var fileName = file.split("\\");
  var fileName = fileName[fileName.length - 1].split("/");
  document.getElementById('newItemDialogFileLabel').innerText = fileName[fileName.length - 1];
});

$("#editItemDialogFile").change(function (obj) {
  var file = document.getElementById('editItemDialogFile').value;
  var fileName = file.split("\\");
  var fileName = fileName[fileName.length - 1].split("/");
  document.getElementById('editItemDialogFileLabel').innerText = fileName[fileName.length - 1];
});

$(document).on("submit", "form#newItemDialogForm", function (event) {
  event.preventDefault();
  $.ajax({
    url: $(this).attr("action"),
    type: $(this).attr("method"),
    dataType: "TEXT",
    data: new FormData(this),
    processData: false,
    contentType: false,
    success: function (data, status) {
      if (data == "OK") {
        updateData();
        closeNewItemDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

$(document).on("submit", "form#editItemDialogForm", function (event) {
  event.preventDefault();
  $.ajax({
    url: $(this).attr("action"),
    type: $(this).attr("method"),
    dataType: "TEXT",
    data: new FormData(this),
    processData: false,
    contentType: false,
    success: function (data, status) {
      if (data == "OK") {
        updateData();
        closeEditItemDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

function openNewItemDialog() {
  document.getElementById('newItemDialogFileLabel').innerText = 'Bild auswählen';
  document.getElementById('newItemDialogFile').value = '';
  document.getElementById('newItemDialogName').value = '';
  document.getElementById('newItemDialogPreparation').value = '';
  document.getElementById('newItemDialogCategory').value = Category.categories[0].id;
  document.getElementById('newItemDialog').style.display = 'block';

  $("#newItemDialogIngredients").empty();
  addNewItemIngredientsRow();
}

function addNewItemIngredientsRow() {
  var id = document.getElementById("newItemDialogIngredients").childNodes.length + 1;
  $("#newItemDialogIngredients").append(
    '<div class="w3-row">' +
      '<div class="w3-col s2">' +
        '<input id="ingredients_amount_' + id + '" name="ingredients_amount_' + id + '" class="w3-input" type="text" placeholder="1kg" onchange="addNewItemIngredientsRowIfNecessary()" required>' +
      '</div>' +
      '<div class="w3-col s9">' +
        '<input id="ingredients_name_' + id + '" name="ingredients_name_' + id + '" class="w3-input" type="text" placeholder="Zutat" onchange="addNewItemIngredientsRowIfNecessary()" required>' +
      '</div>' +
      '<div class="w3-col s1">' +
        '<button id="ingredients_delete_' + id + '" class="w3-bar-item w3-button" onclick="deleteNewItemIngredient(this)"><i class="glyphicon glyphicon-remove"></i></button>' +
      '</div>' +
    '</div>');
}

function addNewItemIngredientsRowIfNecessary() {
  var lastId = document.getElementById("newItemDialogIngredients").childNodes.length;
  
  if((lastId == 0) || (document.getElementById("ingredients_amount_" + lastId).value.length != 0) || (document.getElementById("ingredients_name_" + lastId).value.length != 0)) {
    addNewItemIngredientsRow();
  }
}

function deleteNewItemIngredient(deleteButton) {
  var id = parseInt(deleteButton.id.substr(19));
  var dom = deleteButton.parentNode.parentNode;
  dom.parentNode.removeChild(dom);

  for(; id <= document.getElementById("newItemDialogIngredients").childNodes.length; id++) {
    dom = document.getElementById("ingredients_amount_" + (id+1));
    dom.name = 'ingredients_amount_' + id;
    dom.id = 'ingredients_amount_' + id;

    dom = document.getElementById("ingredients_name_" + (id+1));
    dom.name = 'ingredients_name_' + id;
    dom.id = 'ingredients_name_' + id;
  }
  
  addNewItemIngredientsRowIfNecessary();
}

function openEditItemDialog(id) {
  var item = Item.getById(id);
  document.getElementById('editItemDialogId').value = id;  
  document.getElementById('editItemDialogFileLabel').innerText = 'Bild auswählen';
  document.getElementById('editItemDialogFile').value = '';
  document.getElementById('editItemDialogName').value = item.name;
  document.getElementById('editItemDialogCategory').value = item.categoryId;
  document.getElementById('editItemDialog').style.display = 'block';
}

function closeNewItemDialog() {
  document.getElementById('newItemDialogName').value = '';
  document.getElementById('newItemDialogCategory').value = '';
  document.getElementById('newItemDialog').style.display = 'none';
}

function closeEditItemDialog() {
  var item = Item.getById(document.getElementById('editItemDialogId').value);
  item.refreshImage();
  document.getElementById('editItemDialogId').value = '';
  document.getElementById('editItemDialogName').value = '';
  document.getElementById('editItemDialogCategory').value = '';
  document.getElementById('editItemDialog').style.display = 'none';
}