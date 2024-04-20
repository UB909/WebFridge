var fridge = fridge || {};

fridge.menu = null;
fridge.currentType = null;
fridge.currentId = -1;

/**
 * Listener for closing the context menu
 */
fridge.initContextMenu = function () {
  recfridgeipes.menu = document.getElementById('context-menu');
  
  document.addEventListener('click', (e) => {
    if (e.target.offsetParent != fridge.menu) {
      fridge.menu.setAttribute('hidden', 'true');
      fridge.currentType = null;
      fridge.currentId = -1;
    }
  });
  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape') {
      fridge.menu.setAttribute('hidden', 'true');
      fridge.currentType = null;
      fridge.currentId = -1;
    }
  });
};

fridge.addContextMenu = function (domElement, type, id) {
  // add support of context menu
  domElement.addEventListener('contextmenu', function (e) {
    // Alternative
    e.preventDefault();
    fridge.menu.style.left = e.pageX + "px";
    fridge.menu.style.top = (e.pageY) + "px";

    fridge.currentType = type;
    fridge.currentId = id;

    fridge.menu.removeAttribute('hidden');
  }, false);
}

fridge.contextMenuEdit = function() {
  switch (fridge.currentType) {
    case "category": {
      openEditCategoryDialog(currentId);
      break;
    }
    case "location": {
      openEditLocationDialog(currentId);
      break;
    }
    case "item": {
      openEditItemDialog(currentId);
      break;
    }
  }
  fridge.menu.setAttribute('hidden', 'true');
  fridge.currentType = null;
  fridge.currentId = -1;
}

fridge.contextMenuDelete = function() {
  switch (fridge.currentType) {
    case "category": {
      fridge.openDeleteDialog(currentId, currentType, fridge.Category.getById(currentId).name);
      break;
    }
    case "location": {
      fridge.openDeleteDialog(currentId, currentType, fridge.Location.getById(currentId).name);
      break;
    }
    case "item": {
      fridge.openDeleteDialog(currentId, currentType, fridge.Item.getById(currentId).name);
      break;
    }
  }
  fridge.menu.setAttribute('hidden', 'true');
  fridge.currentType = null;
  fridge.currentId = -1;
}