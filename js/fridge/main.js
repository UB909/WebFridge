
var lastFilterElement = null;
var currentItem = null;

/**
 * retrieve the initial data from the server
 */
$(document).ready(function () {
  $.getJSON("php/fridge/getData.php", function (data, status) {
    addReceivedData(data);
  });
});


function updateData() {
  $.getJSON("php/fridge/getData.php", function (data, status) {
    addReceivedData(data);
  });
}

function addReceivedData(data) {
  // Add the all button
  lastFilterElement = document.getElementById("category_-1");
  lastFilterElement.classList.add("w3-green");

  // parse the categories and create the HTML buttons for them
  var existingIds = [];
  fridge.Category.categories.forEach((cat) => {
    existingIds.push(cat.id);
  });

  data.categories.forEach((dataRow) => {
    var cat = fridge.Category.getById(dataRow.id);
    if(cat) {
      cat.update(dataRow.name);
      const index = existingIds.indexOf(dataRow.id);
      existingIds.splice(index, 1);
    }
    else {
      fridge.Category.addCategory(dataRow);
    }
  });

  existingIds.forEach((id) => {
    fridge.Category.getById(id).remove();
  });

  // parse the locations, create the entry in the top-menu as well in the detailed view of an item
  var existingIds = [];
  fridge.Location.locations.forEach((loc) => {
    existingIds.push(loc.id);
  });
  
  data.locations.forEach((dataRow) => {
    var loc = fridge.Location.getById(dataRow.id);
    if(loc) {
      loc.update(dataRow.name);
      const index = existingIds.indexOf(dataRow.id);
      existingIds.splice(index, 1);
    }
    else {
      fridge.Location.addLocation(dataRow);
    }
  });

  existingIds.forEach((id) => {
    fridge.Location.getById(id).remove();
  });

  // parse items and create the HTML elements
  var existingIds = [];
  fridge.Item.items.forEach((item) => {
    existingIds.push(item.id);
  });
  
  data.items.forEach((dataRow) => {
    var item = fridge.Item.getById(dataRow.id);
    if(item) {
      item.update(dataRow.name, dataRow.categoryId);
      const index = existingIds.indexOf(dataRow.id);
      existingIds.splice(index, 1);
    }
    else {
      fridge.Item.addItem(dataRow);
    }
  });

  existingIds.forEach((id) => {
    fridge.Item.getById(id).remove();
  });

  // parse and count entries and add them to the corresponding item
  data.entries.forEach((dataRow) => {
    fridge.Item.getById(dataRow.itemId).updateOrAddEntry(dataRow);
  });
  fridge.Item.items.forEach((item) => {
    item.updateNumberOfElements();
  });

  fridge.Category.sort();
  fridge.Item.sort();
  fridge.Location.sort();
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
        fridge.updateData();
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

window.addEventListener('hashchange',() => {
  var hash = window.location.hash;
  if(hash==""){
    hash = '#cat_all';
  }
  
  if(hash.startsWith('#cat')) {
    cat = hash.substring(5);
    if(cat == "all") {
      fridge.Category.show(-1);
    }
    else {
      fridge.Category.show(cat);
    }
  }
  else if(hash.startsWith('#item')) {
    fridge.Item.show(hash.substring(6));
  }
});