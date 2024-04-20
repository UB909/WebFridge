$("#newLocationShowDialog").click(function () {
  openNewLocationDialog();
});

$("#newLocationCancel").click(function () {
  closeNewLocationDialog();
});

$("#editLocationCancel").click(function () {
  closeEditLocationDialog();
});

$(document).on("submit", "form#newLocationDialogForm", function (event) {
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
        closeNewLocationDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

$(document).on("submit", "form#editLocationDialogForm", function (event) {
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
        closeEditLocationDialog();
      }
      else {
        alert(data);
      }
    },
  });
});

function openNewLocationDialog() {
  document.getElementById('newLocationDialogName').value = '';
  document.getElementById('newLocationDialog').style.display = 'block';
}

function openEditLocationDialog(id) {
  document.getElementById('editLocationDialogId').value = id;
  document.getElementById('editLocationDialogName').value = fridge.Location.getById(id).name;
  document.getElementById('editLocationDialog').style.display = 'block';
}

function closeNewLocationDialog() {
  document.getElementById('newLocationDialogName').value = '';
  document.getElementById('newLocationDialog').style.display = 'none';
}

function closeEditLocationDialog() {
  document.getElementById('editLocationDialogId').value = '';
  document.getElementById('editLocationDialogName').value = '';
  document.getElementById('editLocationDialog').style.display = 'none';
}