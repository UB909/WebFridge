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
  document.getElementById('newItemDialogCategory').value = Category.categories[0].id;
  document.getElementById('newItemDialog').style.display = 'block';
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