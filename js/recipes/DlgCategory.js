class DlgCategory {
  /// Initializes the class
  static ready() {
    // load static dom elements
    DlgCategory.domDlg = document.getElementById('dlgCategory');
    DlgCategory.domLabel = document.getElementById('dlgCategoryLabel');
    DlgCategory.domForm = document.getElementById('dlgCategoryForm');
    DlgCategory.domId = document.getElementById('dlgCategoryId');
    DlgCategory.domName = document.getElementById('dlgCategoryName');
    DlgCategory.domSubmit = document.getElementById('dlgCategorySubmit');

    // attach the event handlers:
    $("#dlgCategoryAdd").click(function () {
      DlgCategory.openDialogNew();
    });
    
    $("#dlgCategoryCancel").click(function () {
      DlgCategory.closeDialog();
    });

    $(document).on("submit", "form#dlgCategoryForm", function (event) {
      DlgCategory.submit(event)
    });
  }

  static openDialogNew() {
    this.openDialog('Neue Kategorie', 'create', -1, '', 'Hinzufügen');
  }

  static openDialogUpdate(id) {
    this.openDialog('Kategorie Bearbeiten', 'update', id, Category.getById(id).name, "Speichern");
  }

  static openDialog(label, action, id, name, submitButtonlabel) {
    DlgCategory.domLabel.innerText = label;
    DlgCategory.domForm.action = 'php/recipes/' + action + '.php';
    DlgCategory.domName.value = name;
    DlgCategory.domId.value = id;
    DlgCategory.domSubmit.innerText = submitButtonlabel;

    // show dialog
    DlgCategory.domDlg.style.display = 'block';
  }

  static closeDialog() {
    DlgCategory.domName.value = '';
    DlgCategory.domId.value = -1;

    // hide dialog
    DlgCategory.domDlg.style.display = 'none';
  }

  static submit(event) {
    event.preventDefault();
    $.ajax({
      url: DlgCategory.domForm.action,
      type: DlgCategory.domForm.method,
      dataType: "TEXT",
      data: new FormData(DlgCategory.domForm),
      processData: false,
      contentType: false,
      success: function (data, status) {
        if (data == "OK") {
          updateData();
          DlgCategory.closeDialog();
        }
        else {
          alert(data);
        }
      },
    });
  }
}

$(document).ready(function () {
  DlgCategory.ready();
});