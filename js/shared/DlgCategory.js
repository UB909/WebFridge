var shared = shared || {};

shared.DlgCategory = class {
  /// Initializes the class
  static addDialog(updateCallback, getCategoryByIdCallback) {
    shared.DlgCategory.updateCallback = updateCallback;
    shared.DlgCategory.getByIdCallback = getCategoryByIdCallback;

    var dlgDiv = document.createElement("div");
    dlgDiv.id = "dlgCategory";
    dlgDiv.classList.add("w3-modal");
    document.body.appendChild(dlgDiv);

    dlgDiv.innerHTML = 
      '<div class="w3-modal-content w3-animate-zoom" style="max-width:400px">' +
      '  <header class="w3-container w3-green">' +
      '    <h3 id="dlgCategoryLabel">Kategorie</h3>' +
      '  </header>' +
      '' +
      '  <form id="dlgCategoryForm" action="php/recipes/" method="post">' +
      '    <input name="type" type="hidden" value="category">' +
      '    <input id="dlgCategoryId" name="id" type="hidden">' +
      '' +
      '    <div class="w3-container">' +
      '      <div class="w3-section">' +
      '        <label><b>Name</b></label>' +
      '       <input id="dlgCategoryName" name="name" class="w3-input w3-border w3-margin-bottom" type="text" placeholder="Name" required>' +
      '      </div>' +
      '    </div>' +
      '' +
      '    <div class="w3-container w3-border-top w3-padding-16 w3-light-grey w3-center">' +
      '      <button id="dlgCategorySubmit" class="w3-button w3-red" type="submit">Hinzufügen</button>' +
      '      <button id="dlgCategoryCancel" class="w3-button w3-red">Abbrechen</button>' +
      '    </div>' +
      '  </form>' +
      '</div>';

    // load static dom elements
    shared.DlgCategory.domDlg = document.getElementById('dlgCategory');
    shared.DlgCategory.domLabel = document.getElementById('dlgCategoryLabel');
    shared.DlgCategory.domForm = document.getElementById('dlgCategoryForm');
    shared.DlgCategory.domId = document.getElementById('dlgCategoryId');
    shared.DlgCategory.domName = document.getElementById('dlgCategoryName');
    shared.DlgCategory.domSubmit = document.getElementById('dlgCategorySubmit');
    

    // attach the event handlers:
    $("#dlgCategoryAdd").click(function () {
      shared.DlgCategory.openDialogNew();
    });
    
    $("#dlgCategoryCancel").click(function () {
      shared.DlgCategory.closeDialog();
    });

    $(document).on("submit", "form#dlgCategoryForm", function (event) {
      shared.DlgCategory.submit(event)
    });
  }

  static openDialogNew() {
    this.openDialog('Neue Kategorie', 'create', -1, '', 'Hinzufügen');
  }

  static openDialogUpdate(id) {
    this.openDialog('Kategorie Bearbeiten', 'update', id, shared.DlgCategory.getByIdCallback(id).name, "Speichern");
  }

  static openDialog(label, action, id, name, submitButtonlabel) {
    shared.DlgCategory.domLabel.innerText = label;
    shared.DlgCategory.domForm.action = 'php/recipes/' + action + '.php';
    shared.DlgCategory.domName.value = name;
    shared.DlgCategory.domId.value = id;
    shared.DlgCategory.domSubmit.innerText = submitButtonlabel;

    // show dialog
    shared.DlgCategory.domDlg.style.display = 'block';
  }

  static closeDialog() {
    shared.DlgCategory.domName.value = '';
    shared.DlgCategory.domId.value = -1;

    // hide dialog
    shared.DlgCategory.domDlg.style.display = 'none';
  }

  static submit(event) {
    event.preventDefault();
    $.ajax({
      url: shared.DlgCategory.domForm.action,
      type: shared.DlgCategory.domForm.method,
      dataType: "TEXT",
      data: new FormData(shared.DlgCategory.domForm),
      processData: false,
      contentType: false,
      success: function (data, status) {
        if (data == "OK") {
          shared.DlgCategory.updateCallback();
          shared.DlgCategory.closeDialog();
        }
        else {
          alert(data);
        }
      },
    });
  }
}
