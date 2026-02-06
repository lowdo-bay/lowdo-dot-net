// Index filtering - category-based checkbox filtering with "ALL" toggle
(function() {
  var filterControls = document.querySelector('.index-filters');
  var entryRows = document.querySelectorAll('.index-row');

  if (!filterControls || !entryRows.length) return;

  var allCheckbox = filterControls.querySelector('[data-filter-type="all"]');
  var categoryCheckboxes = filterControls.querySelectorAll('[data-filter-type]:not([data-filter-type="all"])');

  function updateVisibility() {
    var selectedCategories = [];
    categoryCheckboxes.forEach(function(cb) {
      if (cb.checked) selectedCategories.push(cb.dataset.filterType);
    });

    var showAll = allCheckbox.checked || selectedCategories.length === 0;

    entryRows.forEach(function(row) {
      var rowCategories = (row.dataset.categories || '').split(',').filter(function(c) { return c; });

      if (showAll) {
        row.style.display = '';
      } else {
        var hasMatch = rowCategories.some(function(cat) {
          return selectedCategories.indexOf(cat) !== -1;
        });
        row.style.display = hasMatch ? '' : 'none';
      }
    });
  }

  // "ALL" checkbox behavior
  allCheckbox.addEventListener('change', function() {
    if (this.checked) {
      // Uncheck all category filters when ALL is checked
      categoryCheckboxes.forEach(function(cb) { cb.checked = false; });
    }
    updateVisibility();
  });

  // Individual category checkbox behavior
  categoryCheckboxes.forEach(function(cb) {
    cb.addEventListener('change', function() {
      // Uncheck "ALL" when any category is selected
      if (this.checked) {
        allCheckbox.checked = false;
      }
      // If no categories selected, re-check "ALL"
      var anyChecked = false;
      categoryCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) anyChecked = true;
      });
      if (!anyChecked) {
        allCheckbox.checked = true;
      }
      updateVisibility();
    });
  });

  // URL parameter support for direct linking: ?category=housing
  var params = new URLSearchParams(window.location.search);
  var categoryParam = params.get('category');
  if (categoryParam) {
    var targetCheckbox = filterControls.querySelector('[data-filter-type="' + categoryParam.toLowerCase() + '"]');
    if (targetCheckbox) {
      allCheckbox.checked = false;
      targetCheckbox.checked = true;
      updateVisibility();
    }
  }
})();
