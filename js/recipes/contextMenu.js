const menu = document.getElementById('context-menu');
currentType = null;
currentId = -1;

/**
 * Listener for closing the context menu
 */
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', (e) => {
    if (e.target.offsetParent != menu) {
      menu.setAttribute('hidden', 'true');
      currentType = null;
      currentId = -1;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      menu.setAttribute('hidden', 'true');
      currentType = null;
      currentId = -1;
    }
  });
});

function addContextMenu(domElement, type, id) {
  // add support of context menu
  domElement.addEventListener('contextmenu', function (e) {
    // Alternative
    e.preventDefault();
    menu.style.left = e.pageX + "px";
    menu.style.top = (e.pageY) + "px";

    currentType = type;
    currentId = id;

    menu.removeAttribute('hidden');
  }, false);
}

function contextMenuEdit() {
  switch (currentType) {
    case "category": {
      DlgCategory.openDialogUpdate(currentId);
      break;
    }
    case "dish": {
      DlgDish.openDialogUpdate(currentId);
      break;
    }
  }
  menu.setAttribute('hidden', 'true');
  currentType = null;
  currentId = -1;
}

function contextMenuDelete() {
  switch (currentType) {
    case "category": {
      openDeleteDialog(currentId, currentType, Category.getById(currentId).name);
      break;
    }
    case "dish": {
      openDeleteDialog(currentId, currentType, Dish.getById(currentId).name);
      break;
    }
  }
  menu.setAttribute('hidden', 'true');
  currentType = null;
  currentId = -1;
}