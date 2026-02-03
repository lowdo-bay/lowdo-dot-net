// Index filtering - checkbox-based with "ALL" toggle
(function() {
  var filterControls = document.querySelector('.index-filters');
  var entryRows = document.querySelectorAll('.index-row');

  if (!filterControls || !entryRows.length) return;

  var allCheckbox = filterControls.querySelector('input[value="all"]');
  var typeCheckboxes = filterControls.querySelectorAll('input[name="filter"]:not([value="all"])');

  function updateVisibility() {
    var checkedTypes = [];
    typeCheckboxes.forEach(function(cb) {
      if (cb.checked) checkedTypes.push(cb.value);
    });

    var showAll = allCheckbox.checked || checkedTypes.length === 0;

    entryRows.forEach(function(row) {
      var type = row.dataset.entryType;
      var visible = showAll || checkedTypes.indexOf(type) !== -1;
      row.style.display = visible ? '' : 'none';
    });
  }

  // "ALL" checkbox behavior
  allCheckbox.addEventListener('change', function() {
    if (this.checked) {
      typeCheckboxes.forEach(function(cb) { cb.checked = false; });
    }
    updateVisibility();
  });

  // Individual type checkbox behavior
  typeCheckboxes.forEach(function(cb) {
    cb.addEventListener('change', function() {
      // Uncheck "ALL" when any type is selected
      if (this.checked) {
        allCheckbox.checked = false;
      }
      // If no types selected, re-check "ALL"
      var anyChecked = false;
      typeCheckboxes.forEach(function(checkbox) {
        if (checkbox.checked) anyChecked = true;
      });
      if (!anyChecked) {
        allCheckbox.checked = true;
      }
      updateVisibility();
    });
  });

  // URL parameter support for direct linking
  var params = new URLSearchParams(window.location.search);
  var filterParam = params.get('type');
  if (filterParam) {
    allCheckbox.checked = false;
    var targetCheckbox = filterControls.querySelector('input[value="' + filterParam + '"]');
    if (targetCheckbox) targetCheckbox.checked = true;
    updateVisibility();
  }
})();
