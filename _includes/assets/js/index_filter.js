// Index filtering - entry-type + category-based filtering with "ALL" toggle
(function() {
  var filterControls = document.querySelector('.index-filters');
  var entryRows = document.querySelectorAll('.index-row');

  if (!filterControls || !entryRows.length) return;

  var allCheckbox = filterControls.querySelector('[data-filter-type="all"]');
  var filterCheckboxes = filterControls.querySelectorAll('[data-filter-type]:not([data-filter-type="all"])');

  function updateVisibility() {
    var selectedFilters = [];
    filterCheckboxes.forEach(function(cb) {
      if (cb.checked) {
        selectedFilters.push({
          value: cb.dataset.filterType,
          category: cb.dataset.filterCategory // 'type' or 'category'
        });
      }
    });

    var showAll = allCheckbox.checked || selectedFilters.length === 0;

    entryRows.forEach(function(row) {
      var rowType = row.dataset.entryType || '';
      var rowCategories = (row.dataset.categories || '').split(',').filter(function(c) { return c; });

      if (showAll) {
        row.style.display = '';
      } else {
        // Check if any selected filter matches
        var hasMatch = selectedFilters.some(function(filter) {
          if (filter.category === 'type') {
            // Match by entry type OR by category (e.g. a project tagged with "exhibitions")
            return rowType === filter.value || rowCategories.indexOf(filter.value) !== -1;
          } else {
            // Match by category
            return rowCategories.indexOf(filter.value) !== -1;
          }
        });
        row.style.display = hasMatch ? '' : 'none';
      }
    });
    window.scrollTo(0, 0);
  }

  // "ALL" checkbox behavior
  allCheckbox.addEventListener('change', function() {
    if (this.checked) {
      filterCheckboxes.forEach(function(cb) { cb.checked = false; });
    }
    updateVisibility();
  });

  // Individual filter checkbox behavior
  filterCheckboxes.forEach(function(cb) {
    cb.addEventListener('change', function() {
      if (this.checked) {
        allCheckbox.checked = false;
      }
      // If no filters selected, re-check "ALL"
      var anyChecked = false;
      filterCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) anyChecked = true;
      });
      if (!anyChecked) {
        allCheckbox.checked = true;
      }
      updateVisibility();
    });
  });

  // Show more/less toggle for category filters
  var toggleButton = filterControls.querySelector('[data-toggle-filters]');
  var categoryContainer = filterControls.querySelector('[data-category-filters]');
  var categoriesVisible = false;

  function toggleCategories() {
    categoriesVisible = !categoriesVisible;
    if (categoriesVisible) {
      categoryContainer.classList.add('is-visible');
      if (toggleButton) toggleButton.textContent = 'show less...';
    } else {
      categoryContainer.classList.remove('is-visible');
      if (toggleButton) toggleButton.textContent = 'show more...';
    }
  }

  if (toggleButton && categoryContainer) {
    toggleButton.addEventListener('click', function() {
      toggleCategories();
    });
  }

  // URL parameter support: ?type=project or ?category=housing
  var params = new URLSearchParams(window.location.search);
  var typeParam = params.get('type');
  var categoryParam = params.get('category');

  if (typeParam) {
    var targetCheckbox = filterControls.querySelector('[data-filter-type="' + typeParam.toLowerCase() + '"][data-filter-category="type"]');
    if (targetCheckbox) {
      allCheckbox.checked = false;
      targetCheckbox.checked = true;
      updateVisibility();
    }
  } else if (categoryParam) {
    var targetCheckbox = filterControls.querySelector('[data-filter-type="' + categoryParam.toLowerCase() + '"][data-filter-category="category"]');
    if (targetCheckbox) {
      allCheckbox.checked = false;
      targetCheckbox.checked = true;
      // Auto-expand category filters if a category is pre-selected
      if (categoryContainer) {
        categoryContainer.classList.add('is-visible');
        if (toggleButton) toggleButton.textContent = 'show less...';
        categoriesVisible = true;
      }
      updateVisibility();
    }
  }
})();

// Staff row expand/collapse
(function() {
  document.querySelectorAll('.index-row-staff-wrapper').forEach(function(wrapper) {
    wrapper.addEventListener('click', function() {
      var expanded = this.classList.toggle('is-expanded');
      this.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      var body = this.querySelector('.index-row__body');
      if (body) body.setAttribute('aria-hidden', expanded ? 'false' : 'true');
    });
    wrapper.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
})();
