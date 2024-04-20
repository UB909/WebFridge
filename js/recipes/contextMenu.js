var recipes = recipes || {};

recipes.menu = null;
recipes.currentType = null;
recipes.currentId = -1;

/**
 * Listener for closing the context menu
 */
recipes.initContextMenu = function () {
  recipes.menu = document.getElementById('context-menu');
  
  document.addEventListener('click', (e) => {
    if (e.target.offsetParent != recipes.menu) {
      recipes.menu.setAttribute('hidden', 'true');
      recipes.currentType = null;
      recipes.currentId = -1;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      recipes.menu.setAttribute('hidden', 'true');
      recipes.currentType = null;
      recipes.currentId = -1;
    }
  });
};

recipes.addContextMenu = function (domElement, type, id) {
  // add support of context menu
  domElement.addEventListener('contextmenu', function (e) {
    // Alternative
    e.preventDefault();
    recipes.menu.style.left = e.pageX + "px";
    recipes.menu.style.top = (e.pageY) + "px";

    recipes.currentType = type;
    recipes.currentId = id;

    recipes.menu.removeAttribute('hidden');
  }, false);
}

recipes.contextMenuEdit = function() {
  switch (recipes.currentType) {
    case "category": {
      recipes.DlgCategory.openDialogUpdate(recipes.currentId);
      break;
    }
    case "dish": {
      recipes.DlgDish.openDialogUpdate(recipes.currentId);
      break;
    }
  }
  recipes.menu.setAttribute('hidden', 'true');
  recipes.currentType = null;
  recipes.currentId = -1;
}

recipes.contextMenuDelete = function() {
  switch (recipes.currentType) {
    case "category": {
      recipes.openDeleteDialog(recipes.currentId, recipes.currentType, recipes.Category.getById(recipes.currentId).name);
      break;
    }
    case "dish": {
      recipes.openDeleteDialog(recipes.currentId, recipes.currentType, recipes.Dish.getById(recipes.currentId).name);
      break;
    }
  }
  recipes.menu.setAttribute('hidden', 'true');
  recipes.currentType = null;
  recipes.currentId = -1;
}