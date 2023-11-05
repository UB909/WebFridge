
var lastFilterElement = null;
var currentDish = null;
var lastUpdatedData = 0;

/**
 * retrieve the initial data from the server
 */
$(document).ready(function () {
  $.getJSON("php/recipes/getData.php", function (data, status) {
    addReceivedData(data);
  });
});


function updateData() {
  $.getJSON("php/recipes/getData.php", function (data, status) {
    addReceivedData(data);
  });
}

function addReceivedData(data) {
  // Add the all button
  lastFilterElement = document.getElementById("category_-1");
  lastFilterElement.classList.add("w3-green");

  // parse the categories and create the HTML buttons for them
  var existingIds = [];
  Category.categories.forEach((cat) => {
    existingIds.push(cat.id);
  });

  data.categories.forEach((dataRow) => {
    var cat = Category.getById(dataRow.id);
    if(cat) {
      cat.update(dataRow);
      const index = existingIds.indexOf(dataRow.id);
      existingIds.splice(index, 1);
    }
    else {
      Category.addCategory(dataRow);
    }
  });

  existingIds.forEach((id) => {
    Category.getById(id).remove();
  });

  // parse dishes and create the HTML elements
  var existingIds = [];
  Dish.dishes.forEach((dish) => {
    existingIds.push(dish.id);
  });
  
  data.dishes.forEach((dataRow) => {
    var dish = Dish.getById(dataRow.id);
    if(dish) {
      dish.update(dataRow);
      const index = existingIds.indexOf(dataRow.id);
      existingIds.splice(index, 1);
    }
    else {
      Dish.addDish(dataRow);
    }
  });

  existingIds.forEach((id) => {
    Dish.getById(id).remove();
  });

  // // parse and count entries and add them to the corresponding dish
  // data.entries.forEach((dataRow) => {
  //   Dish.getById(dataRow.dishId).updateOrAddEntry(dataRow);
  // });
  // Dish.dishes.forEach((dish) => {
  //   dish.updateNumberOfElements();
  // });

  Category.sort();
  Dish.sort();
}

$("#deleteDialogCancel").click(function (event) {
  event.preventDefault();
  closeDeleteDialog();
});

$(document).on("submit", "form#deleteDialogForm", function (event) {
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
        closeDeleteDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

function openDeleteDialog(id, type, name) {
  document.getElementById('deleteDialogId').value = id;
  document.getElementById('deleteDialogType').value = type;
  document.getElementById('deleteDialogMsg').innerText = '"' + name + '" löschen?';
  document.getElementById('deleteDialog').style.display = 'block';
}

function closeDeleteDialog() {
  document.getElementById('deleteDialog').style.display = 'none';
}

