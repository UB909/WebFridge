$("#newCategoryShowDialog").click(function () {
  openNewCategoryDialog();
});

$("#newCategoryCancel").click(function () {
  closeNewCategoryDialog();
});

$("#editCategoryCancel").click(function () {
  closeEditCategoryDialog();
});


$(document).on("submit", "form#newCategoryDialogForm", function (event) {
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
        closeNewCategoryDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

$(document).on("submit", "form#editCategoryDialogForm", function (event) {
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
        closeEditCategoryDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

function openNewCategoryDialog() {
  document.getElementById('newCategoryDialogName').value = '';
  document.getElementById('newCategoryDialog').style.display = 'block';
}

function openEditCategoryDialog(id) {
  document.getElementById('editCategoryDialogId').value = id;
  document.getElementById('editCategoryDialogName').value = Category.getById(id).name;
  document.getElementById('editCategoryDialog').style.display = 'block';
}

function closeNewCategoryDialog() {
  document.getElementById('newCategoryDialogName').value = '';
  document.getElementById('newCategoryDialog').style.display = 'none';
}

function closeEditCategoryDialog() {
  document.getElementById('editCategoryDialogId').value = '';
  document.getElementById('editCategoryDialogName').value = '';
  document.getElementById('editCategoryDialog').style.display = 'none';
}

