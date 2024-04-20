var recipes = recipes || {};

recipes.lastFilterElement = null;
recipes.currentDish = null;

recipes.updateData = function() {
  $.getJSON("php/recipes/getData.php", function (data, status) {
    // Add the all button
    recipes.lastFilterElement = document.getElementById("category_-1");
    recipes.lastFilterElement.classList.add("w3-green");

    // parse the categories and create the HTML buttons for them
    var existingIds = [];
    recipes.Category.categories.forEach((cat) => {
      existingIds.push(cat.id);
    });

    data.categories.forEach((dataRow) => {
      var cat = recipes.Category.getById(dataRow.id);
      if(cat) {
        cat.update(dataRow);
        const index = existingIds.indexOf(dataRow.id);
        existingIds.splice(index, 1);
      }
      else {
        recipes.Category.addCategory(dataRow);
      }
    });

    existingIds.forEach((id) => {
      recipes.Category.getById(id).remove();
    });

    // parse dishes and create the HTML elements
    var existingIds = [];
    recipes.Dish.dishes.forEach((dish) => {
      existingIds.push(dish.id);
    });
    
    data.dishes.forEach((dataRow) => {
      var dish = recipes.Dish.getById(dataRow.id);
      if(dish) {
        dish.update(dataRow);
        const index = existingIds.indexOf(dataRow.id);
        existingIds.splice(index, 1);
      }
      else {
        recipes.Dish.addDish(dataRow);
      }
    });

    existingIds.forEach((id) => {
      recipes.Dish.getById(id).remove();
    });

    recipes.Category.sort();
    recipes.Dish.sort();
  });
}

recipes.openDeleteDialog = function (id, type, name) {
  document.getElementById('deleteDialogId').value = id;
  document.getElementById('deleteDialogType').value = type;
  document.getElementById('deleteDialogMsg').innerText = '"' + name + '" löschen?';
  document.getElementById('deleteDialog').style.display = 'block';
}

recipes.closeDeleteDialog = function() {
  document.getElementById('deleteDialog').style.display = 'none';
}

recipes.addCss = function(href) {
  var head  = document.getElementsByTagName('head')[0];
  var link  = document.createElement('link');
  link.rel  = 'stylesheet';
  link.type = 'text/css';
  link.href = href;
  link.media = 'all';
  head.appendChild(link);
}

recipes.activatePage = function() {
  var cssFiles = document.getElementsByTagName("link");
  for(var i = 0; i < cssFiles.length; i++) {
    var href = cssFiles[i].getAttribute("href");
    if(href.startsWith("css/")) {
      cssFiles[i].remove();
      i--;
    }
  }

  recipes.addCss("css/w3.css");
  recipes.addCss("css/recipes/dishOverview.css");
  recipes.addCss("css/recipes/dishView.css");
  recipes.addCss("css/recipes/main.css");


  $.get("js/recipes/body.html", function (data) {
    document.body.innerHTML = data;

    shared.DlgCategory.addDialog(recipes.updateData, recipes.Category.getById);
    recipes.DlgDish.ready();
      
    $("#deleteDialogCancel").click(function (event) {
      event.preventDefault();
      recipes.closeDeleteDialog();
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
            recipes.updateData();
            recipes.closeDeleteDialog();
          }
          else {
            alert(data);
          }
        },
      });
    });

    window.addEventListener('hashchange',() => {
      var hash = window.location.hash;
      if(hash==""){
        hash = '#cat_all';
      }
      
      if(hash.startsWith('#cat')) {
        cat = hash.substring(5);
        if(cat == "all") {
          recipes.Category.show(-1);
        }
        else {
          recipes.Category.show(cat);
        }
      }
      else if(hash.startsWith('#dish')) {
        recipes.Dish.show(hash.substring(6));
      }
    });

    recipes.updateData();
    recipes.initContextMenu();
  });
};
