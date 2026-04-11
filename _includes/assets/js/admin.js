// LowDO Admin - Entry Manager
(function() {
  'use strict';

  // ---- State ----
  var entries = JSON.parse(JSON.stringify(window.__ENTRIES__ || []));
  var entryTypes = window.__ENTRY_TYPES__ || [];
  var canonicalCategories = (window.__CATEGORIES__ || []).slice();
  var projectSlugs = (window.__PROJECT_SLUGS__ || []).slice();
  var token = '';
  var changes = {};
  var sortField = 'title';
  var sortDir = 'asc';
  var searchQuery = '';
  var typeFilter = 'all';
  var draftFilter = 'all'; // 'all', 'draft', 'published'
  var selectedPaths = new Set();
  var activeEditPath = null;

  // Store original values for diffing
  var originals = {};
  entries.forEach(function(e) {
    originals[e.filePath] = snapshot(e);
  });

  function snapshot(e) {
    return {
      categories: (e.categories || []).slice(),
      entryType: e.entryType,
      draft: e.draft,
      title: e.title,
      subtitle: e.subtitle,
      description: e.description,
      date: e.date,
      link: e.link,
      position: e.position,
      year: e.year,
      location: e.location,
      status: e.status,
      featured: e.featured,
      featuredPosition: e.featuredPosition,
      collaborators: JSON.stringify(e.collaborators || []),
      relatedProjects: JSON.stringify(e.relatedProjects || []),
      body: e.body
    };
  }

  // ---- DOM refs ----
  var loginScreen = document.getElementById('login-screen');
  var adminScreen = document.getElementById('admin-screen');
  var loginForm = document.getElementById('login-form');
  var loginPassword = document.getElementById('login-password');
  var loginError = document.getElementById('login-error');
  var tbody = document.getElementById('entries-tbody');
  var searchInput = document.getElementById('search-input');
  var typeFiltersEl = document.getElementById('type-filters');
  var draftFiltersEl = document.getElementById('draft-filters');
  var selectAllCb = document.getElementById('select-all');
  var bulkActions = document.getElementById('bulk-actions');
  var selectedCountEl = document.getElementById('selected-count');
  var saveBtn = document.getElementById('save-btn');
  var changeCountEl = document.getElementById('change-count');
  var logoutBtn = document.getElementById('logout-btn');
  var newEntryBtn = document.getElementById('new-entry-btn');
  var bulkModal = document.getElementById('bulk-modal');
  var bulkModalTitle = document.getElementById('bulk-modal-title');
  var bulkCategoryInput = document.getElementById('bulk-category-input');
  var bulkCategorySuggestions = document.getElementById('bulk-category-suggestions');
  var bulkModalConfirm = document.getElementById('bulk-modal-confirm');
  var bulkModalCancel = document.getElementById('bulk-modal-cancel');
  var bulkAddBtn = document.getElementById('bulk-add-btn');
  var bulkRemoveBtn = document.getElementById('bulk-remove-btn');
  var manageBtn = document.getElementById('manage-btn');
  var manageModal = document.getElementById('manage-modal');
  var manageModalClose = document.getElementById('manage-modal-close');
  var manageCategoriesList = document.getElementById('manage-categories-list');
  var manageTypesList = document.getElementById('manage-types-list');
  var manageCategoriesPanel = document.getElementById('manage-categories-panel');
  var manageTypesPanel = document.getElementById('manage-types-panel');
  var deleteModal = document.getElementById('delete-modal');
  var deleteModalMsg = document.getElementById('delete-modal-msg');
  var deleteModalConfirm = document.getElementById('delete-modal-confirm');
  var deleteModalCancel = document.getElementById('delete-modal-cancel');
  var saveOverlay = document.getElementById('save-overlay');
  var saveStatus = document.getElementById('save-status');

  // Edit panel
  var editPanel = document.getElementById('edit-panel');
  var editPanelTitle = document.getElementById('edit-panel-title');
  var editPanelClose = document.getElementById('edit-panel-close');
  var editPanelCloseFooter = document.getElementById('edit-panel-close-footer');
  var editPanelBackdrop = document.getElementById('edit-panel-backdrop');
  var epApplyBtn = document.getElementById('ep-apply-btn');
  var epTitle = document.getElementById('ep-title');
  var epSubtitle = document.getElementById('ep-subtitle');
  var epDescription = document.getElementById('ep-description');
  var epDate = document.getElementById('ep-date');
  var epLink = document.getElementById('ep-link');
  var epPosition = document.getElementById('ep-position');
  var epYear = document.getElementById('ep-year');
  var epLocation = document.getElementById('ep-location');
  var epStatus = document.getElementById('ep-status');
  var epFeatured = document.getElementById('ep-featured');
  var epFeaturedPositionGroup = document.getElementById('ep-featured-position-group');
  var epFeaturedPosition = document.getElementById('ep-featured-position');
  var epCollaboratorsList = document.getElementById('ep-collaborators-list');
  var epAddCollaborator = document.getElementById('ep-add-collaborator');
  var epRelatedProjectsList = document.getElementById('ep-related-projects-list');
  var epRelatedProjectInput = document.getElementById('ep-related-project-input');
  var epRelatedProjectSuggestions = document.getElementById('ep-related-project-suggestions');
  var epBody = document.getElementById('ep-body');
  var epSlug = document.getElementById('ep-slug');
  var epDraft = document.getElementById('ep-draft');
  var epTypeValue = document.getElementById('ep-type-value');
  var epTypeChange = document.getElementById('ep-type-change');
  var epCategoriesTags = document.getElementById('ep-categories-tags');
  var epCategoryInput = document.getElementById('ep-category-input');
  var epCategorySuggestions = document.getElementById('ep-category-suggestions');
  var epPreviewToggle = document.getElementById('ep-preview-toggle');
  var epBodyPreview = document.getElementById('ep-body-preview');

  // ---- Auth ----
  function showLogin() {
    loginScreen.hidden = false;
    adminScreen.hidden = true;
  }

  var adminInitialized = false;

  function showAdmin() {
    loginScreen.hidden = true;
    adminScreen.hidden = false;
    if (!adminInitialized) {
      adminInitialized = true;
      buildTypeFilters();
      // Track actual toolbar height for sticky table header
      var adminToolbar = document.querySelector('.admin-toolbar');
      var ro = new ResizeObserver(function(entries) {
        var h = Math.ceil(entries[0].contentRect.height);
        document.documentElement.style.setProperty('--admin-toolbar-actual-height', h + 'px');
      });
      ro.observe(adminToolbar);
    }
    renderTable();
  }

  // ---- Draft filter ----
  draftFiltersEl.addEventListener('change', function(e) {
    draftFilter = e.target.value;
    renderTable();
  });

  sessionStorage.removeItem('admin_token');

  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    loginError.hidden = true;
    var pwd = loginPassword.value;
    fetch('/.netlify/functions/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pwd })
    })
    .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
    .then(function(result) {
      if (!result.ok) {
        loginError.textContent = result.data.error || 'Login failed';
        loginError.hidden = false;
        return;
      }
      token = result.data.token;
      sessionStorage.setItem('admin_token', token);
      showAdmin();
    })
    .catch(function() {
      loginError.textContent = 'Network error';
      loginError.hidden = false;
    });
  });

  logoutBtn.addEventListener('click', function() {
    token = '';
    sessionStorage.removeItem('admin_token');
    showLogin();
  });

  // ---- Type filters ----
  function buildTypeFilters() {
    var frag = document.createDocumentFragment();
    entryTypes.forEach(function(t) {
      var label = document.createElement('label');
      label.className = 'filter-chip';
      var input = document.createElement('input');
      input.type = 'checkbox';
      input.value = t.toLowerCase();
      label.appendChild(input);
      label.appendChild(document.createTextNode(' ' + t));
      frag.appendChild(label);
    });
    typeFiltersEl.appendChild(frag);

    typeFiltersEl.addEventListener('change', function(e) {
      var target = e.target;
      if (target.value === 'all') {
        if (target.checked) {
          typeFiltersEl.querySelectorAll('input:not([value="all"])').forEach(function(cb) { cb.checked = false; });
          typeFilter = 'all';
        }
      } else {
        typeFiltersEl.querySelector('input[value="all"]').checked = false;
        var checked = [];
        typeFiltersEl.querySelectorAll('input:checked').forEach(function(cb) {
          if (cb.value !== 'all') checked.push(cb.value);
        });
        if (checked.length === 0) {
          typeFiltersEl.querySelector('input[value="all"]').checked = true;
          typeFilter = 'all';
        } else {
          typeFilter = checked;
        }
      }
      renderTable();
    });
  }

  // ---- Search ----
  searchInput.addEventListener('input', function() {
    searchQuery = this.value.toLowerCase();
    renderTable();
  });

  // ---- Sorting ----
  document.querySelectorAll('th.sortable').forEach(function(th) {
    th.addEventListener('click', function() {
      var field = this.dataset.sort;
      if (sortField === field) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDir = 'asc';
      }
      document.querySelectorAll('th.sortable').forEach(function(h) {
        h.classList.remove('sort-asc', 'sort-desc');
      });
      this.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      renderTable();
    });
  });

  // ---- Helpers ----
  function escHtml(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function findEntry(filePath) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].filePath === filePath) return entries[i];
    }
    return null;
  }

  function getEntryValue(entry, field) {
    if (field === 'date') return entry.date || '';
    return (entry[field] || '').toString().toLowerCase();
  }

  function isModified(entry) {
    var orig = originals[entry.filePath];
    if (!orig) return entry._isNew === true; // new entries are always modified
    var s = snapshot(entry);
    return JSON.stringify(s) !== JSON.stringify(orig);
  }

  function isProject(entryType) {
    return entryType === 'project';
  }

  function toDateInputValue(dateVal) {
    if (!dateVal) return '';
    var d = new Date(dateVal);
    if (isNaN(d)) return '';
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function generateSlug(title) {
    var today = new Date();
    var yy = String(today.getFullYear()).slice(2);
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var dd = String(today.getDate()).padStart(2, '0');
    var slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return yy + mm + dd + '_' + (slug || 'new-entry');
  }

  // ---- Update changes ----
  function updateChanges() {
    changes = {};
    entries.forEach(function(e) {
      if (!isModified(e)) return;

      var orig = originals[e.filePath];
      var change = { filePath: e.filePath };

      if (e._isNew) {
        change.action = 'create';
        change.entryType = e.entryType;
        change.slug = e.slug;
      } else if (e._delete) {
        change.action = 'delete';
        changes[e.filePath] = change;
        return;
      } else if (orig && e.entryType !== orig.entryType) {
        change.newEntryType = e.entryType;
      }

      // Include all editable fields
      change.type = e.entryType; // frontmatter field
      change.title = e.title;
      change.subtitle = e.subtitle;
      change.description = e.description;
      change.date = e.date;
      change.link = e.link;
      change.position = e.position;
      change.draft = e.draft;
      change.categories = e.categories;
      change.year = e.year;
      change.location = e.location;
      change.status = e.status;
      change.featured = e.featured;
      change.featuredPosition = e.featuredPosition;
      change.collaborators = e.collaborators;
      change.relatedProjects = e.relatedProjects;
      change.body = e.body;

      changes[e.filePath] = change;
    });

    var count = Object.keys(changes).length;
    changeCountEl.hidden = count === 0;
    changeCountEl.textContent = count + ' change' + (count === 1 ? '' : 's');
    saveBtn.disabled = count === 0;
  }

  // ---- Render table ----
  function getFilteredEntries() {
    var filtered = entries.filter(function(e) { return !e._delete; });

    if (typeFilter !== 'all') {
      filtered = filtered.filter(function(e) {
        return typeFilter.indexOf((e.entryType || '').toLowerCase()) !== -1;
      });
    }

    if (draftFilter === 'draft') {
      filtered = filtered.filter(function(e) { return e.draft === true; });
    } else if (draftFilter === 'published') {
      filtered = filtered.filter(function(e) { return !e.draft; });
    }

    if (searchQuery) {
      filtered = filtered.filter(function(e) {
        return (e.title || '').toLowerCase().indexOf(searchQuery) !== -1 ||
               (e.slug || '').toLowerCase().indexOf(searchQuery) !== -1;
      });
    }

    filtered.sort(function(a, b) {
      var va = getEntryValue(a, sortField);
      var vb = getEntryValue(b, sortField);
      var cmp = va < vb ? -1 : va > vb ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return filtered;
  }

  function renderTable() {
    var filtered = getFilteredEntries();
    var html = '';

    filtered.forEach(function(entry) {
      var modified = isModified(entry);
      var selected = selectedPaths.has(entry.filePath);
      var rowClass = '';
      if (modified && selected) rowClass = 'is-modified is-selected';
      else if (modified) rowClass = 'is-modified';
      else if (selected) rowClass = 'is-selected';
      if (entry._isNew) rowClass = (rowClass ? rowClass + ' ' : '') + 'is-new-row';

      html += '<tr data-path="' + escHtml(entry.filePath) + '"' + (rowClass ? ' class="' + rowClass + '"' : '') + '>';

      // Select
      html += '<td class="col-select"><input type="checkbox" class="row-select"' + (selected ? ' checked' : '') + '></td>';

      // Draft toggle
      html += '<td class="col-draft"><label class="draft-toggle"><input type="checkbox" class="draft-cb"' + (entry.draft ? ' checked' : '') + '><span class="draft-dot"></span></label></td>';

      // Title
      html += '<td class="col-title">' + escHtml(entry.title || entry.slug || '') + '</td>';

      // Categories (read-only)
      html += '<td class="col-categories"><div class="category-cell">';
      if ((entry.categories || []).length === 0) {
        html += '<span class="cell-empty">&mdash;</span>';
      } else {
        (entry.categories || []).forEach(function(cat) {
          html += '<span class="cat-tag">' + escHtml(cat) + '</span>';
        });
      }
      html += '</div></td>';

      // Type (read-only)
      html += '<td class="col-type">';
      if (entry.entryType) {
        html += '<span class="cat-tag">' + escHtml(entry.entryType.toUpperCase()) + '</span>';
      } else {
        html += '<span class="cell-empty">&mdash;</span>';
      }
      html += '</td>';

      // Date
      html += '<td class="col-date">' + escHtml(toDateInputValue(entry.date)) + '</td>';

      // Actions
      html += '<td class="col-actions">';
      html += '<button class="btn btn--small action-edit-btn" data-action="open-edit">Edit</button>';
      html += '<button class="btn btn--small btn--danger action-delete-btn" data-action="delete-entry">Del</button>';
      html += '</td>';

      html += '</tr>';
    });

    tbody.innerHTML = html;
    updateSelectionUI();
  }

  // ---- Selection ----
  selectAllCb.addEventListener('change', function() {
    var checked = this.checked;
    selectedPaths.clear();
    if (checked) {
      getFilteredEntries().forEach(function(e) { selectedPaths.add(e.filePath); });
    }
    renderTable();
  });

  function updateSelectionUI() {
    var count = selectedPaths.size;
    bulkActions.hidden = count === 0;
    selectedCountEl.textContent = count + ' selected';
  }

  // ---- Table event delegation ----
  tbody.addEventListener('change', function(e) {
    var row = e.target.closest('tr');
    if (!row) return;
    var path = row.dataset.path;

    // Row checkbox
    if (e.target.classList.contains('row-select')) {
      if (e.target.checked) selectedPaths.add(path);
      else selectedPaths.delete(path);
      updateSelectionUI();
      row.classList.toggle('is-selected', e.target.checked);
      return;
    }

    // Draft toggle
    if (e.target.classList.contains('draft-cb')) {
      var entry = findEntry(path);
      if (entry) {
        entry.draft = e.target.checked;
        updateChanges();
        row.classList.toggle('is-modified', isModified(entry));
      }
      return;
    }
  });

  tbody.addEventListener('click', function(e) {
    var row = e.target.closest('tr');
    if (!row) return;
    var path = row.dataset.path;

    // Open edit panel
    if (e.target.dataset.action === 'open-edit') {
      openEditPanel(path);
      return;
    }

    // Delete entry
    if (e.target.dataset.action === 'delete-entry') {
      openDeleteModal(path);
      return;
    }
  });

  // ---- New Entry ----
  newEntryBtn.addEventListener('click', function() {
    var slug = generateSlug('new-entry');
    var folder = typeFolder('project');
    var filePath = 'entries/' + folder + '/' + slug + '/' + slug + '.md';

    var newEntry = {
      slug: slug,
      title: '',
      subtitle: '',
      description: '',
      entryType: 'project',
      categories: [],
      date: new Date().toISOString(),
      year: '',
      location: '',
      status: '',
      link: '',
      position: null,
      draft: true,
      featured: false,
      featuredPosition: null,
      collaborators: [],
      relatedProjects: [],
      body: '',
      filePath: filePath,
      _isNew: true
    };

    entries.unshift(newEntry);
    updateChanges();
    renderTable();

    // Open edit panel immediately for the new entry
    openEditPanel(filePath);
  });

  // ---- Delete entry ----
  var pendingDeletePath = null;

  function openDeleteModal(filePath) {
    var entry = findEntry(filePath);
    if (!entry) return;
    pendingDeletePath = filePath;
    deleteModalMsg.textContent = 'Delete "' + (entry.title || entry.slug) + '"? This cannot be undone.';
    deleteModal.hidden = false;
  }

  deleteModalCancel.addEventListener('click', function() {
    deleteModal.hidden = true;
    pendingDeletePath = null;
  });

  deleteModalConfirm.addEventListener('click', function() {
    if (!pendingDeletePath) return;
    var entry = findEntry(pendingDeletePath);
    if (entry) {
      if (entry._isNew) {
        // Remove from entries array — no server action needed
        entries = entries.filter(function(e) { return e.filePath !== pendingDeletePath; });
      } else {
        entry._delete = true;
      }
      if (activeEditPath === pendingDeletePath) closeEditPanel();
      selectedPaths.delete(pendingDeletePath);
      updateChanges();
      renderTable();
    }
    deleteModal.hidden = true;
    pendingDeletePath = null;
  });

  document.addEventListener('click', function(e) {
    document.querySelectorAll('.type-dropdown').forEach(function(dd) { dd.remove(); });
    if (epRelatedProjectSuggestions && !epRelatedProjectSuggestions.hidden) {
      if (!epRelatedProjectInput.contains(e.target) && !epRelatedProjectSuggestions.contains(e.target)) {
        epRelatedProjectSuggestions.hidden = true;
      }
    }
    if (epCategorySuggestions && !epCategorySuggestions.hidden) {
      if (!epCategoryInput.contains(e.target) && !epCategorySuggestions.contains(e.target)) {
        epCategorySuggestions.hidden = true;
      }
    }
  });

  // ---- Type editing ----
  // All known types. The server maps project→projects/, everything else→other/.
  var knownTypes = ['project', 'news', 'award', 'feature', 'lecture', 'exhibition', 'staff'];

  // Returns the entries/ subfolder for a given type
  function typeFolder(entryType) {
    return entryType === 'project' ? 'projects' : 'other';
  }

  function showTypeDropdown(anchor, filePath) {
    document.querySelectorAll('.type-dropdown').forEach(function(dd) { dd.remove(); });

    var entry = findEntry(filePath);
    if (!entry) return;

    var dd = document.createElement('div');
    dd.className = 'type-dropdown';

    // Search input
    var input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Type to search or create...';
    input.className = 'type-dropdown-search';
    dd.appendChild(input);

    var list = document.createElement('div');
    list.className = 'type-dropdown-list';
    dd.appendChild(list);

    function applyType(typeName) {
      typeName = typeName.toLowerCase().trim();
      if (!typeName || typeName === entry.entryType) { dd.remove(); return; }
      // Add to knownTypes if new
      if (knownTypes.indexOf(typeName) === -1) knownTypes.push(typeName);
      if (entry._isNew) {
        var newFolder = typeFolder(typeName);
        var slug = entry.slug;
        var newPath = 'entries/' + newFolder + '/' + slug + '/' + slug + '.md';
        selectedPaths.delete(entry.filePath);
        if (activeEditPath === entry.filePath) activeEditPath = newPath;
        entry.filePath = newPath;
      }
      entry.entryType = typeName;
      // Sync panel if open
      if (!editPanel.hidden) {
        epTypeValue.textContent = typeName.toUpperCase();
        var proj = isProject(typeName);
        document.querySelectorAll('.project-only').forEach(function(el) { el.hidden = !proj; });
        document.querySelectorAll('.non-project-only').forEach(function(el) { el.hidden = proj; });
      }
      updateChanges();
      renderTable();
      dd.remove();
    }

    function renderTypeList(query) {
      var upper = query.toUpperCase();
      var filtered = knownTypes.filter(function(t) {
        return !upper || t.toUpperCase().indexOf(upper) !== -1;
      });
      list.innerHTML = '';
      filtered.forEach(function(typeName) {
        var item = document.createElement('div');
        item.className = 'type-dropdown-item' + (typeName === entry.entryType ? ' is-active' : '');
        item.textContent = typeName.toUpperCase();
        item.addEventListener('click', function(e) { e.stopPropagation(); applyType(typeName); });
        list.appendChild(item);
      });
      // "Create new" option if query doesn't match any existing type
      if (query && knownTypes.indexOf(query.toLowerCase()) === -1) {
        var newItem = document.createElement('div');
        newItem.className = 'type-dropdown-item is-new';
        newItem.textContent = '+ Create "' + query.toUpperCase() + '"';
        newItem.addEventListener('click', function(e) { e.stopPropagation(); applyType(query); });
        list.appendChild(newItem);
      }
    }

    input.addEventListener('input', function(e) { e.stopPropagation(); renderTypeList(this.value.trim()); });
    input.addEventListener('keydown', function(e) {
      e.stopPropagation();
      if (e.key === 'Enter') { e.preventDefault(); applyType(this.value.trim()); }
      if (e.key === 'Escape') dd.remove();
    });

    renderTypeList('');
    // Position dropdown relative to anchor
    var rect = anchor.getBoundingClientRect();
    dd.style.position = 'fixed';
    dd.style.top = rect.bottom + 'px';
    dd.style.left = rect.left + 'px';
    document.body.appendChild(dd);
    input.focus();
  }

  // ---- Type change button in panel ----
  epTypeChange.addEventListener('click', function(e) {
    e.stopPropagation();
    if (activeEditPath) showTypeDropdown(epTypeChange, activeEditPath);
  });

  // ---- Edit panel ----
  function openEditPanel(filePath) {
    var entry = findEntry(filePath);
    if (!entry) return;

    activeEditPath = filePath;
    editPanelTitle.textContent = entry._isNew ? 'New Entry' : 'Edit: ' + (entry.title || entry.slug);

    // Populate fields
    epSlug.value = entry.slug || '';
    epSlug.readOnly = !entry._isNew;
    epDraft.checked = !!entry.draft;
    epTypeValue.textContent = (entry.entryType || '').toUpperCase();
    epTitle.value = entry.title || '';
    epSubtitle.value = entry.subtitle || '';
    epDescription.value = entry.description || '';
    epDate.value = toDateInputValue(entry.date);
    renderPanelCategoryTags(entry.categories || []);
    epCategoryInput.value = '';
    epCategorySuggestions.hidden = true;
    epLink.value = entry.link || '';
    epPosition.value = entry.position != null ? entry.position : '';
    epYear.value = entry.year || '';
    epLocation.value = entry.location || '';
    epStatus.value = entry.status || '';
    epFeatured.checked = !!entry.featured;
    epFeaturedPositionGroup.hidden = !entry.featured;
    epFeaturedPosition.value = entry.featuredPosition != null ? entry.featuredPosition : '';
    epBody.value = entry.body || '';
    epBodyPreview.hidden = true;
    epBody.hidden = false;
    epPreviewToggle.textContent = 'Preview';

    // Show/hide project-only and non-project fields
    var proj = isProject(entry.entryType);
    document.querySelectorAll('.project-only').forEach(function(el) { el.hidden = !proj; });
    document.querySelectorAll('.non-project-only').forEach(function(el) { el.hidden = proj; });
    // Featured position always starts hidden, shown by featured toggle
    epFeaturedPositionGroup.hidden = !entry.featured;

    // Collaborators
    renderCollaboratorsList(entry.collaborators || []);

    // Related projects
    renderRelatedProjectTags(entry.relatedProjects || []);

    editPanel.hidden = false;
    editPanelBackdrop.hidden = false;
    epTitle.focus();
  }

  function closeEditPanel() {
    editPanel.hidden = true;
    editPanelBackdrop.hidden = true;
    activeEditPath = null;
  }

  editPanelClose.addEventListener('click', closeEditPanel);
  editPanelCloseFooter.addEventListener('click', closeEditPanel);
  editPanelBackdrop.addEventListener('click', closeEditPanel);

  // Featured toggle shows/hides position input
  epFeatured.addEventListener('change', function() {
    epFeaturedPositionGroup.hidden = !this.checked;
  });

  // Apply button
  epApplyBtn.addEventListener('click', function() {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;

    entry.draft = epDraft.checked;
    entry.categories = getPanelCategories();
    entry.title = epTitle.value.trim();
    entry.subtitle = epSubtitle.value.trim();
    entry.description = epDescription.value.trim();
    entry.date = epDate.value || null;
    entry.link = epLink.value.trim();
    entry.position = epPosition.value !== '' ? Number(epPosition.value) : null;
    entry.year = epYear.value.trim();
    entry.location = epLocation.value.trim();
    entry.status = epStatus.value.trim();
    entry.featured = epFeatured.checked;
    entry.featuredPosition = epFeatured.checked && epFeaturedPosition.value !== '' ? Number(epFeaturedPosition.value) : null;
    entry.body = epBody.value;

    // Update slug for new entries
    if (entry._isNew) {
      var oldPath = entry.filePath;
      var manualSlug = epSlug.value.trim();
      var newSlug = manualSlug || generateSlug(entry.title || 'new-entry');
      entry.slug = newSlug;
      var folder = typeFolder(entry.entryType);
      var newPath = 'entries/' + folder + '/' + newSlug + '/' + newSlug + '.md';
      entry.filePath = newPath;
      activeEditPath = newPath;
      selectedPaths.delete(oldPath);
      epSlug.value = newSlug;
    }

    // Update panel title
    editPanelTitle.textContent = entry._isNew ? 'New Entry' : 'Edit: ' + (entry.title || entry.slug);

    updateChanges();
    renderTable();
  });

  // ---- Collaborators editor ----
  function renderCollaboratorsList(collaborators) {
    epCollaboratorsList.innerHTML = '';
    (collaborators || []).forEach(function(collab, idx) {
      var row = document.createElement('div');
      row.className = 'structured-row';
      row.innerHTML =
        '<input type="text" class="collab-name" placeholder="Name" value="' + escHtml(collab.name || '') + '">' +
        '<input type="text" class="collab-role" placeholder="Role" value="' + escHtml(collab.role || '') + '">' +
        '<button class="btn btn--small btn--danger collab-remove" data-idx="' + idx + '">&times;</button>';
      epCollaboratorsList.appendChild(row);
    });
  }

  epAddCollaborator.addEventListener('click', function() {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;
    if (!entry.collaborators) entry.collaborators = [];
    entry.collaborators.push({ name: '', role: '' });
    renderCollaboratorsList(entry.collaborators);
  });

  epCollaboratorsList.addEventListener('input', function() {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;
    // Sync all name/role fields back to entry
    var rows = epCollaboratorsList.querySelectorAll('.structured-row');
    entry.collaborators = [];
    rows.forEach(function(row) {
      entry.collaborators.push({
        name: row.querySelector('.collab-name').value.trim(),
        role: row.querySelector('.collab-role').value.trim()
      });
    });
  });

  epCollaboratorsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('collab-remove')) {
      if (!activeEditPath) return;
      var entry = findEntry(activeEditPath);
      if (!entry) return;
      var idx = parseInt(e.target.dataset.idx, 10);
      entry.collaborators.splice(idx, 1);
      renderCollaboratorsList(entry.collaborators);
    }
  });

  // ---- Panel category editor ----
  function renderPanelCategoryTags(categories) {
    epCategoriesTags.innerHTML = '';
    (categories || []).forEach(function(cat) {
      var tag = document.createElement('span');
      tag.className = 'cat-tag';
      tag.innerHTML = escHtml(cat) + '<span class="cat-tag__remove" data-cat="' + escHtml(cat) + '">&times;</span>';
      epCategoriesTags.appendChild(tag);
    });
  }

  function getPanelCategories() {
    var cats = [];
    epCategoriesTags.querySelectorAll('.cat-tag__remove').forEach(function(el) {
      cats.push(el.dataset.cat);
    });
    return cats;
  }

  epCategoriesTags.addEventListener('click', function(e) {
    if (e.target.classList.contains('cat-tag__remove')) {
      e.target.closest('.cat-tag').remove();
    }
  });

  epCategoryInput.addEventListener('input', function() {
    var query = this.value.trim().toUpperCase();
    if (!query) { epCategorySuggestions.hidden = true; return; }
    var current = getPanelCategories();
    var matches = canonicalCategories.filter(function(c) {
      return current.indexOf(c) === -1 && c.indexOf(query) !== -1;
    });
    var html = matches.map(function(c) {
      return '<li data-value="' + escHtml(c) + '">' + escHtml(c) + '</li>';
    }).join('');
    if (canonicalCategories.indexOf(query) === -1) {
      html += '<li class="is-new" data-value="' + escHtml(query) + '">' + escHtml(query) + '</li>';
    }
    epCategorySuggestions.innerHTML = html;
    epCategorySuggestions.hidden = html === '';
  });

  function addPanelCategory(val) {
    val = val.toUpperCase();
    var current = getPanelCategories();
    if (!val || current.indexOf(val) !== -1) return;
    renderPanelCategoryTags(current.concat([val]));
    if (canonicalCategories.indexOf(val) === -1) {
      canonicalCategories.push(val);
      canonicalCategories.sort();
    }
    epCategoryInput.value = '';
    epCategorySuggestions.hidden = true;
  }

  epCategorySuggestions.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    addPanelCategory(li.dataset.value);
  });

  epCategoryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addPanelCategory(this.value.trim());
    }
    if (e.key === 'Escape') epCategorySuggestions.hidden = true;
  });

  // ---- Related projects editor ----
  function renderRelatedProjectTags(relatedProjects) {
    epRelatedProjectsList.innerHTML = '';
    (relatedProjects || []).forEach(function(slug) {
      var tag = document.createElement('span');
      tag.className = 'cat-tag';
      tag.innerHTML = escHtml(slug) + '<span class="cat-tag__remove" data-slug="' + escHtml(slug) + '">&times;</span>';
      epRelatedProjectsList.appendChild(tag);
    });
  }

  epRelatedProjectsList.addEventListener('click', function(e) {
    if (e.target.classList.contains('cat-tag__remove')) {
      if (!activeEditPath) return;
      var entry = findEntry(activeEditPath);
      if (!entry) return;
      var slug = e.target.dataset.slug;
      entry.relatedProjects = (entry.relatedProjects || []).filter(function(s) { return s !== slug; });
      renderRelatedProjectTags(entry.relatedProjects);
    }
  });

  epRelatedProjectInput.addEventListener('input', function() {
    var query = this.value.trim().toLowerCase();
    if (!query) { epRelatedProjectSuggestions.hidden = true; return; }

    var entry = activeEditPath ? findEntry(activeEditPath) : null;
    var current = entry ? (entry.relatedProjects || []) : [];

    var matches = projectSlugs.filter(function(s) {
      return current.indexOf(s) === -1 && s.toLowerCase().indexOf(query) !== -1;
    }).slice(0, 8);

    if (matches.length === 0) { epRelatedProjectSuggestions.hidden = true; return; }

    epRelatedProjectSuggestions.innerHTML = matches.map(function(s) {
      return '<li data-slug="' + escHtml(s) + '">' + escHtml(s) + '</li>';
    }).join('');
    epRelatedProjectSuggestions.hidden = false;
  });

  epRelatedProjectInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = this.value.trim();
      if (val) addRelatedProject(val);
    }
    if (e.key === 'Escape') epRelatedProjectSuggestions.hidden = true;
  });

  epRelatedProjectSuggestions.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    addRelatedProject(li.dataset.slug);
  });

  function addRelatedProject(slug) {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;
    if (!entry.relatedProjects) entry.relatedProjects = [];
    if (entry.relatedProjects.indexOf(slug) !== -1) return;
    entry.relatedProjects.push(slug);
    renderRelatedProjectTags(entry.relatedProjects);
    epRelatedProjectInput.value = '';
    epRelatedProjectSuggestions.hidden = true;
  }

  // ---- Markdown preview ----
  function simpleMarkdown(text) {
    if (!text) return '';
    var lines = text.split('\n');
    var html = '';
    var inList = false;
    lines.forEach(function(rawLine) {
      var line = rawLine
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`(.+?)`/g, '<code>$1</code>');
      if (/^### /.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<h3>' + line.slice(4) + '</h3>';
      } else if (/^## /.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<h2>' + line.slice(3) + '</h2>';
      } else if (/^# /.test(line)) {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<h1>' + line.slice(2) + '</h1>';
      } else if (/^[-*] /.test(line)) {
        if (!inList) { html += '<ul>'; inList = true; }
        html += '<li>' + line.slice(2) + '</li>';
      } else if (line.trim() === '') {
        if (inList) { html += '</ul>'; inList = false; }
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p>' + line + '</p>';
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  var previewMode = false;
  epPreviewToggle.addEventListener('click', function() {
    previewMode = !previewMode;
    epBody.hidden = previewMode;
    epBodyPreview.hidden = !previewMode;
    this.textContent = previewMode ? 'Edit' : 'Preview';
    if (previewMode) epBodyPreview.innerHTML = simpleMarkdown(epBody.value);
  });

  // ---- Manage labels modal (rename categories + types) ----

  function renameCategory(oldName, newName) {
    newName = newName.trim().toUpperCase();
    if (!newName || newName === oldName) return;
    // Update canonicalCategories list
    var idx = canonicalCategories.indexOf(oldName);
    if (idx !== -1) canonicalCategories.splice(idx, 1, newName);
    else canonicalCategories.push(newName);
    canonicalCategories.sort();
    // Update every entry that has this category
    entries.forEach(function(e) {
      if (!e.categories) return;
      var ci = e.categories.indexOf(oldName);
      if (ci !== -1) e.categories.splice(ci, 1, newName);
    });
    updateChanges();
    renderTable();
  }

  function renameType(oldName, newName) {
    newName = newName.trim().toLowerCase();
    if (!newName || newName === oldName) return;
    // Update knownTypes list
    var idx = knownTypes.indexOf(oldName);
    if (idx !== -1) knownTypes.splice(idx, 1, newName);
    else knownTypes.push(newName);
    // Update every entry that has this type
    entries.forEach(function(e) {
      if (e.entryType !== oldName) return;
      // If new type crosses project↔other boundary, update filePath for new entries
      if (e._isNew && typeFolder(newName) !== typeFolder(oldName)) {
        var newFolder = typeFolder(newName);
        var newPath = 'entries/' + newFolder + '/' + e.slug + '/' + e.slug + '.md';
        selectedPaths.delete(e.filePath);
        if (activeEditPath === e.filePath) activeEditPath = newPath;
        e.filePath = newPath;
      }
      e.entryType = newName;
    });
    updateChanges();
    renderTable();
  }

  function renderManageList(ul, items, onRename) {
    ul.innerHTML = '';
    items.forEach(function(name) {
      var li = document.createElement('li');
      li.className = 'manage-list-item';

      var label = document.createElement('span');
      label.className = 'manage-list-label';
      label.textContent = name.toUpperCase();

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'manage-list-input';
      input.value = name.toUpperCase();
      input.hidden = true;

      var editBtn = document.createElement('button');
      editBtn.className = 'btn btn--small';
      editBtn.textContent = 'Rename';

      editBtn.addEventListener('click', function() {
        if (input.hidden) {
          // Enter edit mode
          input.value = name.toUpperCase();
          label.hidden = true;
          input.hidden = false;
          editBtn.textContent = 'Save';
          input.focus();
          input.select();
        } else {
          // Commit rename
          var newVal = input.value.trim();
          if (newVal && newVal !== name.toUpperCase()) {
            onRename(name, newVal);
            // Refresh the whole list after rename
            renderManageList(ul, items.map(function(n) { return n === name ? newVal.toLowerCase() : n; }), onRename);
            return;
          }
          // No change — just cancel
          label.hidden = false;
          input.hidden = true;
          editBtn.textContent = 'Rename';
        }
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') editBtn.click();
        if (e.key === 'Escape') {
          label.hidden = false;
          input.hidden = true;
          editBtn.textContent = 'Rename';
        }
      });

      li.appendChild(label);
      li.appendChild(input);
      li.appendChild(editBtn);
      ul.appendChild(li);
    });
  }

  function openManageModal() {
    renderManageList(manageCategoriesList, canonicalCategories.slice(), function(oldName, newName) {
      renameCategory(oldName, newName.toUpperCase());
      renderManageList(manageCategoriesList, canonicalCategories.slice(), arguments.callee);
    });
    renderManageList(manageTypesList, knownTypes.slice(), function(oldName, newName) {
      renameType(oldName, newName.toLowerCase());
      renderManageList(manageTypesList, knownTypes.slice(), arguments.callee);
    });
    manageModal.hidden = false;
  }

  manageBtn.addEventListener('click', openManageModal);
  manageModalClose.addEventListener('click', function() { manageModal.hidden = true; });

  // Tab switching
  manageModal.addEventListener('click', function(e) {
    if (!e.target.classList.contains('manage-tab')) return;
    var tab = e.target.dataset.tab;
    manageModal.querySelectorAll('.manage-tab').forEach(function(btn) {
      btn.classList.toggle('is-active', btn.dataset.tab === tab);
    });
    manageCategoriesPanel.hidden = tab !== 'categories';
    manageTypesPanel.hidden = tab !== 'types';
  });

  // ---- Bulk operations ----
  var bulkMode = null;

  bulkAddBtn.addEventListener('click', function() {
    bulkMode = 'add';
    bulkModalTitle.textContent = 'Add Category to Selected';
    bulkCategoryInput.value = '';
    bulkCategorySuggestions.innerHTML = '';
    bulkModal.hidden = false;
    bulkCategoryInput.focus();
    renderBulkSuggestions('');
  });

  bulkRemoveBtn.addEventListener('click', function() {
    bulkMode = 'remove';
    bulkModalTitle.textContent = 'Remove Category from Selected';
    bulkCategoryInput.value = '';
    bulkCategorySuggestions.innerHTML = '';
    bulkModal.hidden = false;
    bulkCategoryInput.focus();
    renderBulkSuggestions('');
  });

  bulkModalCancel.addEventListener('click', function() { bulkModal.hidden = true; });

  bulkCategoryInput.addEventListener('input', function() {
    renderBulkSuggestions(this.value.trim());
  });

  bulkCategoryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = this.value.trim().toUpperCase();
      if (val) applyBulk(val);
    }
    if (e.key === 'Escape') bulkModal.hidden = true;
  });

  function renderBulkSuggestions(query) {
    var upper = query.toUpperCase();
    var candidates;
    if (bulkMode === 'remove') {
      var catSet = {};
      entries.forEach(function(e) {
        if (!selectedPaths.has(e.filePath)) return;
        (e.categories || []).forEach(function(c) { catSet[c] = true; });
      });
      candidates = Object.keys(catSet).sort();
    } else {
      candidates = canonicalCategories;
    }
    var filtered = candidates.filter(function(c) {
      return !upper || c.indexOf(upper) !== -1;
    });
    var html = '';
    filtered.forEach(function(c) {
      html += '<li data-value="' + escHtml(c) + '">' + escHtml(c) + '</li>';
    });
    if (bulkMode === 'add' && upper && canonicalCategories.indexOf(upper) === -1) {
      html += '<li class="is-new" data-value="' + escHtml(upper) + '">' + escHtml(upper) + '</li>';
    }
    bulkCategorySuggestions.innerHTML = html;
  }

  bulkCategorySuggestions.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    applyBulk(li.dataset.value);
  });

  bulkModalConfirm.addEventListener('click', function() {
    var val = bulkCategoryInput.value.trim().toUpperCase();
    if (val) applyBulk(val);
  });

  function applyBulk(category) {
    entries.forEach(function(e) {
      if (!selectedPaths.has(e.filePath)) return;
      if (!e.categories) e.categories = [];
      if (bulkMode === 'add') {
        if (e.categories.indexOf(category) === -1) e.categories.push(category);
      } else {
        e.categories = e.categories.filter(function(c) { return c !== category; });
      }
    });
    if (bulkMode === 'add' && canonicalCategories.indexOf(category) === -1) {
      canonicalCategories.push(category);
      canonicalCategories.sort();
    }
    bulkModal.hidden = true;
    updateChanges();
    renderTable();
  }

  // ---- Save ----
  saveBtn.addEventListener('click', function() {
    var changeList = Object.keys(changes).map(function(path) { return changes[path]; });
    if (changeList.length === 0) return;

    saveOverlay.hidden = false;
    saveStatus.textContent = 'Saving ' + changeList.length + ' change(s)...';

    fetch('/.netlify/functions/update-entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: token, changes: changeList })
    })
    .then(function(res) { return res.json().then(function(data) { return { ok: res.ok, data: data }; }); })
    .then(function(result) {
      if (!result.ok) {
        if (result.data.error === 'Invalid or expired token') {
          saveStatus.textContent = 'Session expired. Please log in again.';
          setTimeout(function() {
            saveOverlay.hidden = true;
            token = '';
            sessionStorage.removeItem('admin_token');
            showLogin();
          }, 2000);
          return;
        }
        saveStatus.textContent = 'Error: ' + (result.data.error || 'Save failed');
        setTimeout(function() { saveOverlay.hidden = true; }, 3000);
        return;
      }

      saveStatus.textContent = 'Saved! ' + (result.data.message || '');

      // Remove deleted entries from state
      entries = entries.filter(function(e) { return !e._delete; });

      // Mark new entries as no longer new
      entries.forEach(function(e) {
        if (e._isNew) delete e._isNew;
      });

      // Update originals to current state
      originals = {};
      entries.forEach(function(e) {
        originals[e.filePath] = snapshot(e);
      });

      changes = {};
      updateChanges();

      setTimeout(function() {
        saveOverlay.hidden = true;
        renderTable();
      }, 2000);
    })
    .catch(function(err) {
      saveStatus.textContent = 'Network error: ' + err.message;
      setTimeout(function() { saveOverlay.hidden = true; }, 3000);
    });
  });

})();
