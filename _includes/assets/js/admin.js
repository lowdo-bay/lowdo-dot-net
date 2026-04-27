// LowDO Admin - Entry Manager
(function() {
  'use strict';

  // ---- State ----
  var entries = JSON.parse(JSON.stringify(window.__ENTRIES__ || []));
  var entryTypes = window.__ENTRY_TYPES__ || [];
  var canonicalCategories = (window.__CATEGORIES__ || []).slice();
  var projectSlugs = (window.__PROJECT_SLUGS__ || []).slice();
  var nonProjectEntries = (window.__NON_PROJECT_ENTRIES__ || []).slice();
  var token = '';

  // Derive dynamic lookup data from all entries
  var knownCollaboratorNames = [];
  var collaboratorRoleMap = {}; // { name: [roles] }
  var knownStatuses = [];
  (function() {
    entries.forEach(function(e) {
      // Collect collaborator names and roles
      (e.collaborators || []).forEach(function(c) {
        var name = (c.name || '').trim();
        var role = (c.role || '').trim();
        if (name && knownCollaboratorNames.indexOf(name) === -1) {
          knownCollaboratorNames.push(name);
        }
        if (name) {
          if (!collaboratorRoleMap[name]) collaboratorRoleMap[name] = [];
          if (role && collaboratorRoleMap[name].indexOf(role) === -1) {
            collaboratorRoleMap[name].push(role);
          }
        }
      });
      // Collect statuses
      var status = (e.status || '').trim();
      if (status && knownStatuses.indexOf(status) === -1) {
        knownStatuses.push(status);
      }
    });
    knownCollaboratorNames.sort();
    knownStatuses.sort();
  })();
  var changes = {};
  var fileOps = {}; // { [filePath]: { header, gallery[], drawings[], toolkit[] } }
  var fileListCache = {}; // { [filePath]: rawFiles[] } — avoids re-fetching on each open
  var sortField = 'date';
  var sortDir = 'desc';
  var searchQuery = '';
  var typeFilter = 'all';
  var categoryFilter = 'all';
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
      slug: e.slug,
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
      showInAwardsTable: e.showInAwardsTable,
      active: e.active,
      collaborators: JSON.stringify(e.collaborators || []),
      relatedProjects: JSON.stringify(e.relatedProjects || []),
      relatedEntries: JSON.stringify(e.relatedEntries || []),
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
  var categoryFiltersEl = document.getElementById('category-filters');
  var draftFiltersEl = document.getElementById('draft-filters');
  var selectAllCb = document.getElementById('select-all');
  var bulkActions = document.getElementById('bulk-actions');
  var selectedCountEl = document.getElementById('selected-count');
  var saveBtn = document.getElementById('save-btn');
  var clearBtn = document.getElementById('clear-btn');
  var clearModal = document.getElementById('clear-modal');
  var clearModalConfirm = document.getElementById('clear-modal-confirm');
  var clearModalCancel = document.getElementById('clear-modal-cancel');
  var changeCountEl = document.getElementById('change-count');
  var logoutBtn = document.getElementById('logout-btn');
  var newEntryBtn = document.getElementById('new-entry-btn');
  var bulkModal = document.getElementById('bulk-modal');
  var bulkCategoryInput = document.getElementById('bulk-category-input');
  var bulkCategorySuggestions = document.getElementById('bulk-category-suggestions');
  var bulkModalConfirm = document.getElementById('bulk-modal-confirm');
  var bulkModalCancel = document.getElementById('bulk-modal-cancel');
  var bulkActionsBtn = document.getElementById('bulk-actions-btn');
  var bulkTabAdd = document.getElementById('bulk-tab-add');
  var bulkTabRemove = document.getElementById('bulk-tab-remove');
  var manageBtn = document.getElementById('manage-btn');
  var manageModal = document.getElementById('manage-modal');
  var manageModalClose = document.getElementById('manage-modal-close');
  var manageCategoriesList = document.querySelector('#manage-categories-list tbody');
  var manageTypesList = document.querySelector('#manage-types-list tbody');
  var manageCategoriesPanel = document.getElementById('manage-categories-panel');
  var manageTypesPanel = document.getElementById('manage-types-panel');
  var manageCombineBtn = document.getElementById('manage-combine-btn');
  var deleteModal = document.getElementById('delete-modal');
  var deleteModalMsg = document.getElementById('delete-modal-msg');
  var deleteModalConfirm = document.getElementById('delete-modal-confirm');
  var deleteModalCancel = document.getElementById('delete-modal-cancel');
  var saveOverlay = document.getElementById('save-overlay');
  var saveStatus = document.getElementById('save-status');
  var docsBtn = document.getElementById('docs-btn');
  var docsModal = document.getElementById('docs-modal');
  var docsModalClose = document.getElementById('docs-modal-close');
  var docsNav = document.getElementById('docs-nav');
  var docsBody = document.getElementById('docs-body');

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
  var epFeaturedPosition = document.getElementById('ep-featured-position');
  var epShowInAwardsTable = document.getElementById('ep-show-in-awards-table');
  var epCollaboratorsList = document.getElementById('ep-collaborators-list');
  var epAddCollaborator = document.getElementById('ep-add-collaborator');
  var epRelatedProjectsList = document.getElementById('ep-related-projects-list');
  var epRelatedProjectInput = document.getElementById('ep-related-project-input');
  var epRelatedProjectSuggestions = document.getElementById('ep-related-project-suggestions');
  var epRelatedEntriesList = document.getElementById('ep-related-entries-list');
  var epRelatedEntriesInput = document.getElementById('ep-related-entries-input');
  var epRelatedEntriesSuggestions = document.getElementById('ep-related-entries-suggestions');
  var epStatusSuggestions = document.getElementById('ep-status-suggestions');
  var epBody = document.getElementById('ep-body');
  var epSlug = document.getElementById('ep-slug');
  var epDraft = document.getElementById('ep-draft');
  var epActive = document.getElementById('ep-active');
  var epTypeDropdown = document.getElementById('ep-type-dropdown');
  var epTypeLabel = document.getElementById('ep-type-label');
  var epTypeDrawer = document.getElementById('ep-type-drawer');
  var epCategoriesTags = document.getElementById('ep-categories-tags');
  var epCategoryDropdown = document.getElementById('ep-category-dropdown');
  var epCategoryDropdownBtn = document.getElementById('ep-category-dropdown-btn');
  var epCategoryDrawer = document.getElementById('ep-category-drawer');
  var epCategoryInput = document.getElementById('ep-category-input');
  var epCategorySuggestions = document.getElementById('ep-category-suggestions');
  var epFilesPanel = document.getElementById('ep-files-panel');
  var epFilesLoading = document.getElementById('ep-files-loading');
  var epFilesHeaderName = document.getElementById('ep-files-header-name');
  var epFilesHeaderUpload = document.getElementById('ep-files-header-upload');
  var epFilesHeaderDelete = document.getElementById('ep-files-header-delete');
  var epFilesHeaderInput = document.getElementById('ep-files-header-input');
  var epFilesGalleryList = document.getElementById('ep-files-gallery-list');
  var epFilesGalleryAdd = document.getElementById('ep-files-gallery-add');
  var epFilesGalleryInput = document.getElementById('ep-files-gallery-input');
  var epFilesDrawingsList = document.getElementById('ep-files-drawings-list');
  var epFilesDrawingsAdd = document.getElementById('ep-files-drawings-add');
  var epFilesDrawingsInput = document.getElementById('ep-files-drawings-input');
  var epFilesToolkitList = document.getElementById('ep-files-toolkit-list');
  var epFilesToolkitAdd = document.getElementById('ep-files-toolkit-add');
  var epFilesToolkitInput = document.getElementById('ep-files-toolkit-input');

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
      // Lock body scroll whenever any modal is open
      var modalObserver = new MutationObserver(function() {
        var anyOpen = !!document.querySelector('.modal:not([hidden])');
        document.body.classList.toggle('modal-open', anyOpen);
      });
      document.querySelectorAll('.modal').forEach(function(m) {
        modalObserver.observe(m, { attributes: true, attributeFilter: ['hidden'] });
      });
      buildTypeFilters();
      buildCategoryFilters();
      // Set initial sort indicator
      var initialSortTh = document.querySelector('th[data-sort="date"]');
      if (initialSortTh) initialSortTh.classList.add('sort-desc');
      // Track actual toolbar height for sticky table header
      var adminToolbar = document.querySelector('.admin-toolbar');
      function updateToolbarHeight() {
        var h = Math.ceil(adminToolbar.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--admin-toolbar-actual-height', h + 'px');
      }
      updateToolbarHeight();
      var ro = new ResizeObserver(updateToolbarHeight);
      ro.observe(adminToolbar);
    }
    renderTable();
  }

  // ---- Draft filter dropdown ----
  (function() {
    var btn = draftFiltersEl.querySelector('.admin-dropdown__button');
    var label = draftFiltersEl.querySelector('.admin-dropdown__label');
    var drawer = draftFiltersEl.querySelector('.admin-dropdown__drawer');
    var items = draftFiltersEl.querySelectorAll('.admin-dropdown__item');

    function openDropdown() {
      draftFiltersEl.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function closeDropdown() {
      draftFiltersEl.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      draftFiltersEl.classList.contains('is-open') ? closeDropdown() : openDropdown();
    });

    items.forEach(function(item) {
      item.addEventListener('click', function() {
        draftFilter = item.dataset.value;
        label.textContent = item.dataset.value === 'all' ? 'STATUS' : item.textContent;
        items.forEach(function(i) { i.classList.remove('is-selected'); });
        item.classList.add('is-selected');
        closeDropdown();
        renderTable();
      });
    });

    document.addEventListener('click', function(e) {
      if (!draftFiltersEl.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeDropdown();
    });
  })();

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
    var btn = typeFiltersEl.querySelector('.admin-dropdown__button');
    var label = typeFiltersEl.querySelector('.admin-dropdown__label');
    var drawer = typeFiltersEl.querySelector('.admin-dropdown__drawer');
    var allItem = drawer.querySelector('[data-value="all"]');
    var selectedTypes = new Set(); // empty = all

    // Populate items from entryTypes
    var frag = document.createDocumentFragment();
    entryTypes.forEach(function(t) {
      var item = document.createElement('button');
      item.className = 'admin-dropdown__item';
      item.type = 'button';
      item.dataset.value = t.toLowerCase();
      item.textContent = t;
      frag.appendChild(item);
    });
    if (entries.some(function(e) { return !e.entryType; })) {
      var noTypeItem = document.createElement('button');
      noTypeItem.className = 'admin-dropdown__item';
      noTypeItem.type = 'button';
      noTypeItem.dataset.value = '';
      noTypeItem.textContent = 'NO TYPE';
      frag.appendChild(noTypeItem);
    }
    drawer.appendChild(frag);

    function updateLabel() {
      label.textContent = selectedTypes.size === 0 ? 'ALL TYPES' : Array.from(selectedTypes).join(', ').toUpperCase();
    }

    function openDropdown() {
      typeFiltersEl.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function closeDropdown() {
      typeFiltersEl.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      typeFiltersEl.classList.contains('is-open') ? closeDropdown() : openDropdown();
    });

    drawer.addEventListener('click', function(e) {
      var item = e.target.closest('.admin-dropdown__item');
      if (!item) return;
      var val = item.dataset.value;
      if (val === 'all') {
        selectedTypes.clear();
        drawer.querySelectorAll('.admin-dropdown__item').forEach(function(i) { i.classList.remove('is-selected'); });
        allItem.classList.add('is-selected');
        typeFilter = 'all';
      } else {
        allItem.classList.remove('is-selected');
        if (selectedTypes.has(val)) {
          selectedTypes.delete(val);
          item.classList.remove('is-selected');
        } else {
          selectedTypes.add(val);
          item.classList.add('is-selected');
        }
        if (selectedTypes.size === 0) {
          allItem.classList.add('is-selected');
          typeFilter = 'all';
        } else {
          typeFilter = Array.from(selectedTypes);
        }
      }
      updateLabel();
      renderTable();
    });

    document.addEventListener('click', function(e) {
      if (!typeFiltersEl.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeDropdown();
    });
  }

  // ---- Category filters ----
  function buildCategoryFilters() {
    var btn = categoryFiltersEl.querySelector('.admin-dropdown__button');
    var label = categoryFiltersEl.querySelector('.admin-dropdown__label');
    var drawer = categoryFiltersEl.querySelector('.admin-dropdown__drawer');
    var allItem = drawer.querySelector('[data-value="all"]');
    var selectedCategories = new Set();

    // Collect all unique categories from entries
    var allCategories = [];
    entries.forEach(function(e) {
      (e.categories || []).forEach(function(c) {
        if (allCategories.indexOf(c) === -1) allCategories.push(c);
      });
    });
    allCategories.sort();

    var frag = document.createDocumentFragment();
    allCategories.forEach(function(c) {
      var item = document.createElement('button');
      item.className = 'admin-dropdown__item';
      item.type = 'button';
      item.dataset.value = c.toLowerCase();
      item.textContent = c;
      frag.appendChild(item);
    });
    if (entries.some(function(e) { return !e.categories || e.categories.length === 0; })) {
      var noCatItem = document.createElement('button');
      noCatItem.className = 'admin-dropdown__item';
      noCatItem.type = 'button';
      noCatItem.dataset.value = '';
      noCatItem.textContent = 'NO CATEGORY';
      frag.appendChild(noCatItem);
    }
    drawer.appendChild(frag);

    function updateLabel() {
      label.textContent = selectedCategories.size === 0 ? 'ALL CATEGORIES' : Array.from(selectedCategories).join(', ').toUpperCase();
    }

    function openDropdown() {
      categoryFiltersEl.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      drawer.setAttribute('aria-hidden', 'false');
    }
    function closeDropdown() {
      categoryFiltersEl.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      categoryFiltersEl.classList.contains('is-open') ? closeDropdown() : openDropdown();
    });

    drawer.addEventListener('click', function(e) {
      var item = e.target.closest('.admin-dropdown__item');
      if (!item) return;
      var val = item.dataset.value;
      if (val === 'all') {
        selectedCategories.clear();
        drawer.querySelectorAll('.admin-dropdown__item').forEach(function(i) { i.classList.remove('is-selected'); });
        allItem.classList.add('is-selected');
        categoryFilter = 'all';
      } else {
        allItem.classList.remove('is-selected');
        if (selectedCategories.has(val)) {
          selectedCategories.delete(val);
          item.classList.remove('is-selected');
        } else {
          selectedCategories.add(val);
          item.classList.add('is-selected');
        }
        if (selectedCategories.size === 0) {
          allItem.classList.add('is-selected');
          categoryFilter = 'all';
        } else {
          categoryFilter = Array.from(selectedCategories);
        }
      }
      updateLabel();
      renderTable();
    });

    document.addEventListener('click', function(e) {
      if (!categoryFiltersEl.contains(e.target)) closeDropdown();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeDropdown();
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
    var origKey = entry._renameFrom || entry.filePath;
    var orig = originals[origKey];
    if (!orig) return entry._isNew === true; // new entries are always modified
    var s = snapshot(entry);
    return JSON.stringify(s) !== JSON.stringify(orig);
  }

  function isProject(entryType) {
    return entryType === 'project';
  }

  function isStaff(entryType) {
    return entryType === 'staff';
  }

  function applyTypeVisibility(entryType) {
    var proj = isProject(entryType);
    var staff = isStaff(entryType);
    document.querySelectorAll('.project-only').forEach(function(el) { el.hidden = !proj; });
    document.querySelectorAll('.non-project-only').forEach(function(el) { el.hidden = proj; });
    document.querySelectorAll('.staff-only').forEach(function(el) { el.hidden = !staff; });
  }

  function toDateInputValue(dateVal) {
    if (!dateVal) return '';
    var s = String(dateVal);
    // If already YYYY-MM-DD, use directly — avoids UTC→local shift when parsing bare dates
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // Otherwise parse ISO string and extract the date portion in UTC
    var d = new Date(s);
    if (isNaN(d)) return '';
    return d.getUTCFullYear() + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0');
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
  var canonicalCategoriesChanged = false;

  function updateChanges() {
    changes = {};
    entries.forEach(function(e) {
      if (!isModified(e)) return;

      var origKey = e._renameFrom || e.filePath;
      var orig = originals[origKey];
      var change = { filePath: e.filePath };

      if (e._isNew) {
        change.action = 'create';
        change.entryType = e.entryType;
        change.slug = e.slug;
      } else if (e._renameFrom) {
        change.action = 'rename';
        change.oldFilePath = e._renameFrom;
        change.newSlug = e.slug;
        // Also flag type change so server can handle cross-folder rename
        if (orig && e.entryType !== orig.entryType) {
          change.newEntryType = e.entryType;
        }
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
      change.showInAwardsTable = e.showInAwardsTable;
      change.active = e.active;
      change.collaborators = e.collaborators;
      change.relatedProjects = e.relatedProjects;
      change.relatedEntries = e.relatedEntries;
      var orig = originals[e.filePath];
      if (!orig || e.body !== orig.body) {
        change.body = e.body;
      }

      changes[e.filePath] = change;
    });

    if (canonicalCategoriesChanged) {
      changes['_data/canonicalCategories.yaml'] = {
        filePath: '_data/canonicalCategories.yaml',
        action: 'updateCategories',
        categories: canonicalCategories.slice()
      };
    }

    var count = Object.keys(changes).length;
    Object.keys(fileOps).forEach(function(path) {
      if (changes[path]) return;
      if (buildFileOpsList(path, fileOps[path]).length > 0) count++;
    });
    changeCountEl.hidden = count === 0;
    changeCountEl.textContent = count + ' change' + (count === 1 ? '' : 's');
    saveBtn.disabled = count === 0;
    clearBtn.disabled = count === 0;
    clearBtn.hidden = count === 0;
  }

  // ---- Render table ----
  function getFilteredEntries() {
    var filtered = entries.filter(function(e) { return !e._delete; });

    if (typeFilter !== 'all') {
      filtered = filtered.filter(function(e) {
        return typeFilter.indexOf((e.entryType || '').toLowerCase()) !== -1;
      });
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(function(e) {
        var cats = (e.categories || []).map(function(c) { return c.toLowerCase(); });
        return categoryFilter.some(function(c) {
          return c === '' ? cats.length === 0 : cats.indexOf(c) !== -1;
        });
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

      // Type (read-only)
      html += '<td class="col-type">';
      if (entry.entryType) {
        html += '<span class="cat-tag">' + escHtml(entry.entryType.toUpperCase()) + '</span>';
      } else {
        html += '<span class="cat-tag cat-tag--muted">NO TYPE</span>';
      }
      html += '</td>';

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
      showInAwardsTable: false,
      active: true,
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
  var initialKnownTypes = knownTypes.slice();

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
        epTypeLabel.textContent = typeName.toUpperCase();
        renderEpTypeDrawer(entry);
        applyTypeVisibility(typeName);
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

  // ---- Type dropdown in edit panel ----
  function renderEpTypeDrawer(entry) {
    epTypeDrawer.innerHTML = '';
    knownTypes.forEach(function(typeName) {
      var item = document.createElement('button');
      item.className = 'admin-dropdown__item' + (typeName === entry.entryType ? ' is-selected' : '');
      item.type = 'button';
      item.textContent = typeName.toUpperCase();
      item.addEventListener('click', function(e) {
        e.stopPropagation();
        epTypeDropdown.classList.remove('is-open');
        epTypeDropdown.querySelector('.admin-dropdown__button').setAttribute('aria-expanded', 'false');
        epTypeDrawer.setAttribute('aria-hidden', 'true');
        applyTypeFromPanel(typeName, entry);
      });
      epTypeDrawer.appendChild(item);
    });
  }

  function applyTypeFromPanel(typeName, entry) {
    typeName = typeName.toLowerCase().trim();
    if (!typeName || typeName === entry.entryType) return;
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
    epTypeLabel.textContent = typeName.toUpperCase();
    renderEpTypeDrawer(entry);
    applyTypeVisibility(typeName);
    updateChanges();
    renderTable();
  }

  (function() {
    var btn = epTypeDropdown.querySelector('.admin-dropdown__button');
    function openEpDropdown() {
      epTypeDropdown.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      epTypeDrawer.setAttribute('aria-hidden', 'false');
    }
    function closeEpDropdown() {
      epTypeDropdown.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      epTypeDrawer.setAttribute('aria-hidden', 'true');
    }
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      epTypeDropdown.classList.contains('is-open') ? closeEpDropdown() : openEpDropdown();
    });
    document.addEventListener('click', function(e) {
      if (!epTypeDropdown.contains(e.target)) closeEpDropdown();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeEpDropdown();
    });
  })();

  // ---- File management helpers ----

  function getExtension(name) {
    var m = (name || '').match(/\.([^.]+)$/);
    return m ? m[1].toLowerCase() : '';
  }

  function isImageExt(ext) {
    return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif' || ext === 'webp';
  }

  function getPreviewSrc(item) {
    if (!item || item.status === 'delete') return null;
    var ext = getExtension(item.origPath || item.path || '');
    if (!isImageExt(ext)) return null;
    if (item.status === 'upload' && item.base64 && item.mimeType) {
      return 'data:' + item.mimeType + ';base64,' + item.base64;
    }
    if (item.path) {
      return 'https://raw.githubusercontent.com/lowdo-bay/lowdo-dot-net/main/' + item.path;
    }
    return null;
  }

  function entryDirFromFilePath(filePath) {
    var parts = filePath.split('/');
    return parts.slice(0, parts.length - 1).join('/');
  }

  function parseEntryFiles(rawFiles) {
    var result = { header: null, gallery: [], drawings: [], toolkit: [] };
    (rawFiles || []).forEach(function(f) {
      var name = f.name;
      if (/^header\.(jpg|jpeg|png|gif|webp)$/i.test(name)) {
        result.header = { status: 'existing', sha: f.sha, path: f.path, displayName: name };
      } else if (/^\d{2}_/.test(name)) {
        var m = name.match(/^(\d{2})_(.+)$/);
        var displayName = m ? m[2].replace(/\.[^.]+$/, '') : name;
        result.gallery.push({ status: 'existing', sha: f.sha, path: f.path, origPath: f.path, displayName: displayName, prefix: m ? m[1] : '00' });
      } else if (/^drawing-/.test(name)) {
        var base = name.replace(/^drawing-/, '').replace(/\.[^.]+$/, '');
        result.drawings.push({ status: 'existing', sha: f.sha, path: f.path, origPath: f.path, displayName: base });
      } else if (/^toolkit-/.test(name)) {
        var base = name.replace(/^toolkit-/, '').replace(/\.[^.]+$/, '');
        result.toolkit.push({ status: 'existing', sha: f.sha, path: f.path, origPath: f.path, displayName: base });
      }
    });
    result.gallery.sort(function(a, b) { return a.prefix < b.prefix ? -1 : 1; });
    return result;
  }

  function renderFilesHeader(ops) {
    var existing = document.querySelector('.ep-files-header-thumb');
    if (existing) existing.parentNode.removeChild(existing);

    if (ops && ops.header && ops.header.status !== 'delete') {
      var h = ops.header;
      var src = getPreviewSrc(h);
      var el;
      if (src) {
        el = document.createElement('img');
        el.src = src;
        el.className = 'ep-files-thumb ep-files-header-thumb';
        el.alt = '';
      } else {
        var ext = getExtension(h.origPath || h.path || '').toUpperCase() || 'FILE';
        el = document.createElement('div');
        el.className = 'ep-files-thumb-placeholder ep-files-header-thumb';
        el.textContent = ext;
      }
      var row = epFilesHeaderName.parentNode;
      row.insertBefore(el, row.firstChild);
      epFilesHeaderName.textContent = h.displayName || 'header';
      epFilesHeaderName.classList.add('has-file');
      epFilesHeaderDelete.hidden = false;
    } else {
      epFilesHeaderName.textContent = 'None';
      epFilesHeaderName.classList.remove('has-file');
      epFilesHeaderDelete.hidden = true;
    }
  }

  function renderFilesList(listEl, items) {
    listEl.innerHTML = '';
    (items || []).forEach(function(item, idx) {
      if (item.status === 'delete') return;
      var row = document.createElement('div');
      row.className = 'ep-files-row' + (item.status === 'upload' ? ' is-pending-upload' : '');
      row.draggable = true;
      row.dataset.idx = String(idx);

      var handle = document.createElement('span');
      handle.className = 'ep-files-drag-handle';
      handle.textContent = '\u2630';

      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.value = item.displayName || '';
      nameInput.placeholder = 'Display name';

      var ext = getExtension(item.origPath || item.path || '');
      var badge = document.createElement('span');
      badge.className = 'ep-files-type-badge';
      badge.textContent = ext ? '.' + ext : '';

      var tipEl = document.createElement('div');
      tipEl.className = 'ep-files-preview-tip';
      var previewSrc = getPreviewSrc(item);
      if (previewSrc) {
        var tipImg = document.createElement('img');
        tipImg.src = previewSrc;
        tipImg.alt = '';
        tipEl.appendChild(tipImg);
      } else {
        var tipLabel = document.createElement('div');
        tipLabel.className = 'ep-files-tip-label';
        tipLabel.textContent = (ext ? ext.toUpperCase() : 'FILE') + ' \u2014 no preview';
        tipEl.appendChild(tipLabel);
      }

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'btn btn--small btn--danger';
      delBtn.textContent = '\u00d7';
      delBtn.dataset.idx = String(idx);

      row.appendChild(tipEl);
      row.appendChild(handle);
      row.appendChild(nameInput);
      row.appendChild(badge);
      row.appendChild(delBtn);
      listEl.appendChild(row);

      row.addEventListener('dragstart', function(e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(idx));
        row.classList.add('is-dragging');
      });
      row.addEventListener('dragend', function() {
        row.classList.remove('is-dragging');
        listEl.querySelectorAll('.drag-over').forEach(function(el) { el.classList.remove('drag-over'); });
      });
      row.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        listEl.querySelectorAll('.drag-over').forEach(function(el) { el.classList.remove('drag-over'); });
        row.classList.add('drag-over');
      });
      row.addEventListener('drop', function(e) {
        e.preventDefault();
        row.classList.remove('drag-over');
        var fromIdx = parseInt(e.dataTransfer.getData('text/plain'), 10);
        var toIdx = idx;
        if (fromIdx === toIdx) return;
        syncFileNamesFromRows(listEl, items);
        var moved = items.splice(fromIdx, 1)[0];
        items.splice(toIdx, 0, moved);
        renderFilesList(listEl, items);
        updateChanges();
      });
    });
  }

  function syncFileNamesFromRows(listEl, items) {
    var rows = listEl.querySelectorAll('.ep-files-row');
    var visibleIdx = 0;
    (items || []).forEach(function(item) {
      if (item.status === 'delete') return;
      var row = rows[visibleIdx];
      if (row) {
        var input = row.querySelector('input[type="text"]');
        if (input) item.displayName = input.value.trim() || item.displayName;
      }
      visibleIdx++;
    });
  }

  function renderFilesPanel(filePath) {
    var ops = fileOps[filePath];
    if (!ops) return;
    renderFilesHeader(ops);
    renderFilesList(epFilesGalleryList, ops.gallery);
    renderFilesList(epFilesDrawingsList, ops.drawings);
    renderFilesList(epFilesToolkitList, ops.toolkit);
  }

  function loadEntryFiles(filePath) {
    var entry = findEntry(filePath);
    if (entry && entry._isNew) {
      if (!fileOps[filePath]) fileOps[filePath] = { header: null, gallery: [], drawings: [], toolkit: [] };
      epFilesLoading.hidden = true;
      renderFilesPanel(filePath);
      return;
    }
    if (fileListCache[filePath]) {
      if (!fileOps[filePath]) fileOps[filePath] = parseEntryFiles(fileListCache[filePath]);
      epFilesLoading.hidden = true;
      renderFilesPanel(filePath);
      return;
    }
    epFilesLoading.hidden = false;
    epFilesLoading.textContent = 'Loading files...';
    var dirPath = entryDirFromFilePath(filePath);
    var url = '/.netlify/functions/update-entries?action=listFiles&dirPath=' +
      encodeURIComponent(dirPath) + '&token=' + encodeURIComponent(token);
    fetch(url)
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) {
          epFilesLoading.textContent = 'Error: ' + data.error;
          return;
        }
        fileListCache[filePath] = data.files || [];
        if (!fileOps[filePath]) fileOps[filePath] = parseEntryFiles(fileListCache[filePath]);
        epFilesLoading.hidden = true;
        renderFilesPanel(filePath);
      })
      .catch(function(err) {
        epFilesLoading.textContent = 'Failed to load files: ' + err.message;
      });
  }

  function readFileAsBase64(file, cb) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = e.target.result;
      var base64 = dataUrl.split(',')[1];
      cb(base64, file.type);
    };
    reader.readAsDataURL(file);
  }

  function ensureFileOps(filePath) {
    if (!fileOps[filePath]) fileOps[filePath] = { header: null, gallery: [], drawings: [], toolkit: [] };
  }

  // ---- File panel event handlers ----

  epFilesHeaderUpload.addEventListener('click', function() {
    epFilesHeaderInput.value = '';
    epFilesHeaderInput.click();
  });

  epFilesHeaderInput.addEventListener('change', function() {
    if (!this.files || !this.files[0] || !activeEditPath) return;
    var file = this.files[0];
    readFileAsBase64(file, function(base64, mimeType) {
      var ext = getExtension(file.name);
      var dirPath = entryDirFromFilePath(activeEditPath);
      ensureFileOps(activeEditPath);
      fileOps[activeEditPath].header = {
        status: 'upload',
        base64: base64,
        mimeType: mimeType,
        path: dirPath + '/header.' + ext,
        displayName: 'header.' + ext
      };
      renderFilesHeader(fileOps[activeEditPath]);
    });
  });

  epFilesHeaderDelete.addEventListener('click', function() {
    if (!activeEditPath) return;
    ensureFileOps(activeEditPath);
    var h = fileOps[activeEditPath].header;
    if (!h) return;
    if (h.status === 'upload') {
      var cached = fileListCache[activeEditPath];
      fileOps[activeEditPath].header = cached ? parseEntryFiles(cached).header : null;
    } else {
      fileOps[activeEditPath].header = { status: 'delete', path: h.path, sha: h.sha };
    }
    renderFilesHeader(fileOps[activeEditPath]);
  });

  epFilesGalleryAdd.addEventListener('click', function() {
    epFilesGalleryInput.value = '';
    epFilesGalleryInput.click();
  });

  epFilesGalleryInput.addEventListener('change', function() {
    if (!this.files || !this.files[0] || !activeEditPath) return;
    var file = this.files[0];
    readFileAsBase64(file, function(base64, mimeType) {
      var ext = getExtension(file.name);
      var defaultName = file.name.replace(/\.[^.]+$/, '');
      ensureFileOps(activeEditPath);
      syncFileNamesFromRows(epFilesGalleryList, fileOps[activeEditPath].gallery);
      fileOps[activeEditPath].gallery.push({
        status: 'upload', base64: base64, mimeType: mimeType,
        displayName: defaultName, path: '', origPath: null,
        _ext: ext
      });
      renderFilesList(epFilesGalleryList, fileOps[activeEditPath].gallery);
    });
  });

  epFilesDrawingsAdd.addEventListener('click', function() {
    epFilesDrawingsInput.value = '';
    epFilesDrawingsInput.click();
  });

  epFilesDrawingsInput.addEventListener('change', function() {
    if (!this.files || !this.files[0] || !activeEditPath) return;
    var file = this.files[0];
    readFileAsBase64(file, function(base64, mimeType) {
      var ext = getExtension(file.name);
      var defaultName = file.name.replace(/\.[^.]+$/, '');
      ensureFileOps(activeEditPath);
      syncFileNamesFromRows(epFilesDrawingsList, fileOps[activeEditPath].drawings);
      fileOps[activeEditPath].drawings.push({
        status: 'upload', base64: base64, mimeType: mimeType,
        displayName: defaultName, path: '', origPath: null,
        _ext: ext
      });
      renderFilesList(epFilesDrawingsList, fileOps[activeEditPath].drawings);
    });
  });

  epFilesToolkitAdd.addEventListener('click', function() {
    epFilesToolkitInput.value = '';
    epFilesToolkitInput.click();
  });

  epFilesToolkitInput.addEventListener('change', function() {
    if (!this.files || !this.files[0] || !activeEditPath) return;
    var file = this.files[0];
    readFileAsBase64(file, function(base64, mimeType) {
      var ext = getExtension(file.name);
      var defaultName = file.name.replace(/\.[^.]+$/, '');
      ensureFileOps(activeEditPath);
      syncFileNamesFromRows(epFilesToolkitList, fileOps[activeEditPath].toolkit);
      fileOps[activeEditPath].toolkit.push({
        status: 'upload', base64: base64, mimeType: mimeType,
        displayName: defaultName, path: '', origPath: null,
        _ext: ext
      });
      renderFilesList(epFilesToolkitList, fileOps[activeEditPath].toolkit);
    });
  });

  function wireFilesListEvents(listEl, getItems) {
    listEl.addEventListener('click', function(e) {
      var delBtn = e.target.closest('.ep-files-row .btn--danger');
      if (!delBtn || !activeEditPath) return;
      var items = getItems();
      var idx = parseInt(delBtn.dataset.idx, 10);
      if (isNaN(idx) || idx < 0 || idx >= items.length) return;
      syncFileNamesFromRows(listEl, items);
      var item = items[idx];
      if (item.status === 'upload') {
        items.splice(idx, 1);
      } else {
        item.status = 'delete';
      }
      renderFilesList(listEl, items);
    });
  }

  wireFilesListEvents(epFilesGalleryList, function() { return fileOps[activeEditPath] ? fileOps[activeEditPath].gallery : []; });
  wireFilesListEvents(epFilesDrawingsList, function() { return fileOps[activeEditPath] ? fileOps[activeEditPath].drawings : []; });
  wireFilesListEvents(epFilesToolkitList, function() { return fileOps[activeEditPath] ? fileOps[activeEditPath].toolkit : []; });

  function buildFileOpsList(filePath, ops) {
    var dirPath = entryDirFromFilePath(filePath);
    var result = [];

    if (ops.header) {
      if (ops.header.status === 'upload') {
        result.push({ action: 'upload', path: ops.header.path, base64: ops.header.base64, mimeType: ops.header.mimeType });
      } else if (ops.header.status === 'delete') {
        result.push({ action: 'delete', path: ops.header.path });
      }
    }

    function processNumberedList(items) {
      var survivors = items.filter(function(item) { return item.status !== 'delete'; });
      items.forEach(function(item) {
        if (item.status === 'delete' && item.origPath) {
          result.push({ action: 'delete', path: item.origPath });
        }
      });
      survivors.forEach(function(item, i) {
        var numStr = String(i).padStart(2, '0');
        var ext = item._ext || getExtension(item.origPath || item.path || '');
        var newPath = dirPath + '/' + numStr + '_' + (item.displayName || 'image') + '.' + ext;
        if (item.status === 'upload') {
          result.push({ action: 'upload', path: newPath, base64: item.base64, mimeType: item.mimeType });
        } else if (item.status === 'existing' && item.origPath && item.origPath !== newPath) {
          result.push({ action: 'rename', oldPath: item.origPath, newPath: newPath, sha: item.sha });
        }
      });
    }

    function processPrefixedList(items, prefix) {
      items.forEach(function(item) {
        if (item.status === 'delete' && item.origPath) {
          result.push({ action: 'delete', path: item.origPath });
        }
      });
      var survivors = items.filter(function(item) { return item.status !== 'delete'; });
      survivors.forEach(function(item) {
        var ext = item._ext || getExtension(item.origPath || item.path || '');
        var newPath = dirPath + '/' + prefix + (item.displayName || 'file') + '.' + ext;
        if (item.status === 'upload') {
          result.push({ action: 'upload', path: newPath, base64: item.base64, mimeType: item.mimeType });
        } else if (item.status === 'existing' && item.origPath && item.origPath !== newPath) {
          result.push({ action: 'rename', oldPath: item.origPath, newPath: newPath, sha: item.sha });
        }
      });
    }

    processNumberedList(ops.gallery);
    processPrefixedList(ops.drawings, 'drawing-');
    processPrefixedList(ops.toolkit, 'toolkit-');

    return result;
  }

  // ---- Edit panel ----
  var editPanelSnapshot = null; // snapshot of entry state when panel was opened

  function openEditPanel(filePath) {
    var entry = findEntry(filePath);
    if (!entry) return;

    activeEditPath = filePath;
    // Capture a deep snapshot of the entry so Cancel can restore it
    editPanelSnapshot = {
      filePath: entry.filePath,
      slug: entry.slug,
      draft: entry.draft,
      categories: (entry.categories || []).slice(),
      entryType: entry.entryType,
      title: entry.title,
      subtitle: entry.subtitle,
      description: entry.description,
      date: entry.date,
      link: entry.link,
      position: entry.position,
      year: entry.year,
      location: entry.location,
      status: entry.status,
      featured: entry.featured,
      featuredPosition: entry.featuredPosition,
      showInAwardsTable: entry.showInAwardsTable,
      collaborators: JSON.parse(JSON.stringify(entry.collaborators || [])),
      relatedProjects: (entry.relatedProjects || []).slice(),
      relatedEntries: (entry.relatedEntries || []).slice(),
      body: entry.body,
      active: entry.active,
      fileOpsCopy: fileOps[filePath] ? JSON.parse(JSON.stringify(fileOps[filePath])) : null
    };
    editPanelTitle.textContent = entry._isNew ? 'New Entry' : 'Edit: ' + (entry.title || entry.slug);

    // Populate fields
    epSlug.value = entry.slug || '';
    epSlug.readOnly = false;
    epSlug.placeholder = '20260101_entry-name';
    epDraft.checked = !!entry.draft;
    epTypeLabel.textContent = (entry.entryType || '—').toUpperCase();
    renderEpTypeDrawer(entry);
    epTitle.value = entry.title || '';
    epSubtitle.value = entry.subtitle || '';
    epDescription.value = entry.description || '';
    epDate.value = toDateInputValue(entry.date);
    renderPanelCategoryTags(entry.categories || []);
    closeEpCategoryDropdown();
    epCategoryInput.value = '';
    epLink.value = entry.link || '';
    epPosition.value = entry.position != null ? entry.position : '';
    epYear.value = entry.year || '';
    epLocation.value = entry.location || '';
    epStatus.value = entry.status || '';
    epStatusSuggestions.hidden = true;
    epFeatured.checked = !!entry.featured;
    epFeaturedPosition.value = entry.featuredPosition != null ? entry.featuredPosition : '';
    epShowInAwardsTable.checked = !!entry.showInAwardsTable;
    setBodyHtml(entry.body || '');

    // Show/hide type-conditional fields
    applyTypeVisibility(entry.entryType);
    epActive.checked = entry.active !== false; // default true if unset
    // Featured position always starts hidden, shown by featured toggle
    document.querySelectorAll('.ep-featured-position-row').forEach(function(el) { el.hidden = !entry.featured; });

    // Collaborators
    renderCollaboratorsList(entry.collaborators || []);

    // Related projects
    renderRelatedProjectTags(entry.relatedProjects || []);

    // Related entries (project → non-project)
    renderRelatedEntriesTags(entry.relatedEntries || []);
    epRelatedEntriesInput.value = '';
    epRelatedEntriesSuggestions.hidden = true;

    editPanel.hidden = false;
    editPanelBackdrop.hidden = false;
    epTitle.focus();

    // Load files for project entries
    if (isProject(entry.entryType)) {
      loadEntryFiles(filePath);
    } else {
      epFilesLoading.hidden = true;
    }
  }

  function closeEditPanel() {
    editPanel.hidden = true;
    editPanelBackdrop.hidden = true;
    activeEditPath = null;
    editPanelSnapshot = null;
  }

  function cancelEditPanel() {
    // Restore entry to the state it had when the panel was opened
    if (editPanelSnapshot && activeEditPath) {
      var entry = findEntry(activeEditPath);
      if (entry) {
        if (entry._isNew && !originals[entry.filePath]) {
          // Brand-new entry that was never applied/saved — remove it entirely
          entries = entries.filter(function(e) { return e.filePath !== activeEditPath; });
          selectedPaths.delete(activeEditPath);
        } else {
          entry.filePath = editPanelSnapshot.filePath;
          entry.slug = editPanelSnapshot.slug;
          activeEditPath = editPanelSnapshot.filePath;
          entry.draft = editPanelSnapshot.draft;
          entry.categories = editPanelSnapshot.categories.slice();
          entry.entryType = editPanelSnapshot.entryType;
          entry.title = editPanelSnapshot.title;
          entry.subtitle = editPanelSnapshot.subtitle;
          entry.description = editPanelSnapshot.description;
          entry.date = editPanelSnapshot.date;
          entry.link = editPanelSnapshot.link;
          entry.position = editPanelSnapshot.position;
          entry.year = editPanelSnapshot.year;
          entry.location = editPanelSnapshot.location;
          entry.status = editPanelSnapshot.status;
          entry.featured = editPanelSnapshot.featured;
          entry.featuredPosition = editPanelSnapshot.featuredPosition;
          entry.showInAwardsTable = editPanelSnapshot.showInAwardsTable;
          entry.active = editPanelSnapshot.active;
          entry.collaborators = JSON.parse(JSON.stringify(editPanelSnapshot.collaborators));
          entry.relatedProjects = editPanelSnapshot.relatedProjects.slice();
          entry.relatedEntries = editPanelSnapshot.relatedEntries.slice();
          entry.body = editPanelSnapshot.body;
        }
        updateChanges();
        renderTable();
      }
      // Restore file ops to state at panel open
      if (editPanelSnapshot.fileOpsCopy !== null) {
        fileOps[activeEditPath] = editPanelSnapshot.fileOpsCopy;
      } else {
        delete fileOps[activeEditPath];
      }
    }
    closeEditPanel();
  }

  editPanelClose.addEventListener('click', cancelEditPanel);
  editPanelCloseFooter.addEventListener('click', cancelEditPanel);
  editPanelBackdrop.addEventListener('click', cancelEditPanel);

  // Featured toggle shows/hides position input
  epFeatured.addEventListener('change', function() {
    document.querySelectorAll('.ep-featured-position-row').forEach(function(el) { el.hidden = !this.checked; }.bind(this));
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
    entry.showInAwardsTable = epShowInAwardsTable.checked;
    entry.active = isStaff(entry.entryType) ? epActive.checked : entry.active;
    entry.relatedEntries = getPanelRelatedEntries();
    entry.body = getBodyMarkdown();

    // Update slug (new or existing entries)
    var manualSlug = epSlug.value.trim();
    var oldPath = entry.filePath;
    var oldSlug = entry.slug;
    if (entry._isNew) {
      var newSlug = manualSlug || generateSlug(entry.title || 'new-entry');
      entry.slug = newSlug;
      var folder = typeFolder(entry.entryType);
      var newPath = 'entries/' + folder + '/' + newSlug + '/' + newSlug + '.md';
      entry.filePath = newPath;
      activeEditPath = newPath;
      selectedPaths.delete(oldPath);
      epSlug.value = newSlug;
    } else if (manualSlug && manualSlug !== oldSlug) {
      // Existing entry slug change — flag for rename on save
      // Preserve the very first _renameFrom so we always rename from the original path
      var originalPath = entry._renameFrom || oldPath;
      var folder = typeFolder(entry.entryType);
      var newPath = 'entries/' + folder + '/' + manualSlug + '/' + manualSlug + '.md';
      entry.slug = manualSlug;
      entry.filePath = newPath;
      // If the slug was reverted to the original, clear the rename flag
      var origSlug = originals[originalPath] ? originals[originalPath].slug : null;
      if (manualSlug === origSlug) {
        delete entry._renameFrom;
      } else {
        entry._renameFrom = originalPath;
      }
      activeEditPath = newPath;
      selectedPaths.delete(oldPath);
      epSlug.value = manualSlug;
    }

    // Update panel title
    editPanelTitle.textContent = entry._isNew ? 'New Entry' : 'Edit: ' + (entry.title || entry.slug);

    // Update snapshot so Cancel reverts to this applied state
    editPanelSnapshot = {
      filePath: entry.filePath,
      slug: entry.slug,
      draft: entry.draft,
      categories: (entry.categories || []).slice(),
      entryType: entry.entryType,
      title: entry.title,
      subtitle: entry.subtitle,
      description: entry.description,
      date: entry.date,
      link: entry.link,
      position: entry.position,
      year: entry.year,
      location: entry.location,
      status: entry.status,
      featured: entry.featured,
      featuredPosition: entry.featuredPosition,
      showInAwardsTable: entry.showInAwardsTable,
      collaborators: JSON.parse(JSON.stringify(entry.collaborators || [])),
      relatedProjects: (entry.relatedProjects || []).slice(),
      relatedEntries: (entry.relatedEntries || []).slice(),
      body: entry.body,
      active: entry.active,
      fileOpsCopy: fileOps[activeEditPath] ? JSON.parse(JSON.stringify(fileOps[activeEditPath])) : null
    };

    // Sync file display names from DOM before closing
    if (fileOps[activeEditPath]) {
      syncFileNamesFromRows(epFilesGalleryList, fileOps[activeEditPath].gallery);
      syncFileNamesFromRows(epFilesDrawingsList, fileOps[activeEditPath].drawings);
      syncFileNamesFromRows(epFilesToolkitList, fileOps[activeEditPath].toolkit);
    }

    updateChanges();
    renderTable();
    closeEditPanel();
  });

  // ---- Collaborators editor ----
  function syncCollaboratorsFromDOM() {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;
    var rows = epCollaboratorsList.querySelectorAll('.structured-row');
    entry.collaborators = [];
    rows.forEach(function(row) {
      entry.collaborators.push({
        name: row.querySelector('.collab-name').value.trim(),
        role: row.querySelector('.collab-role').value.trim()
      });
    });
  }

  function renderCollaboratorsList(collaborators) {
    epCollaboratorsList.innerHTML = '';
    (collaborators || []).forEach(function(collab, idx) {
      var row = document.createElement('div');
      row.className = 'structured-row';

      var nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.className = 'collab-name';
      nameInput.placeholder = 'Name';
      nameInput.value = collab.name || '';
      nameInput.autocomplete = 'off';

      var nameSugg = document.createElement('ul');
      nameSugg.className = 'tag-suggestions collab-name-suggestions';
      nameSugg.hidden = true;

      var roleInput = document.createElement('input');
      roleInput.type = 'text';
      roleInput.className = 'collab-role';
      roleInput.placeholder = 'Role';
      roleInput.value = collab.role || '';
      roleInput.autocomplete = 'off';

      var roleSugg = document.createElement('ul');
      roleSugg.className = 'tag-suggestions collab-role-suggestions';
      roleSugg.hidden = true;

      var removeBtn = document.createElement('button');
      removeBtn.className = 'btn btn--small btn--danger collab-remove';
      removeBtn.dataset.idx = idx;
      removeBtn.textContent = '\u00d7';

      // Name input suggestions
      nameInput.addEventListener('input', function() {
        var query = this.value.trim().toLowerCase();
        nameSugg.innerHTML = '';
        if (!query) { nameSugg.hidden = true; return; }
        var matches = knownCollaboratorNames.filter(function(n) {
          return n.toLowerCase().indexOf(query) !== -1;
        }).slice(0, 8);
        if (matches.length === 0) { nameSugg.hidden = true; return; }
        matches.forEach(function(n) {
          var li = document.createElement('li');
          li.textContent = n;
          li.dataset.value = n;
          nameSugg.appendChild(li);
        });
        nameSugg.hidden = false;
      });
      nameSugg.addEventListener('click', function(e) {
        var li = e.target.closest('li');
        if (!li) return;
        nameInput.value = li.dataset.value;
        nameSugg.hidden = true;
        syncCollaboratorsFromDOM();
        // Pre-fill role suggestions for this name
        roleInput.focus();
      });
      nameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') nameSugg.hidden = true;
      });
      nameInput.addEventListener('blur', function() {
        setTimeout(function() { nameSugg.hidden = true; }, 150);
      });

      // Role input suggestions (filtered by current name if known)
      roleInput.addEventListener('input', function() {
        var query = this.value.trim().toLowerCase();
        var currentName = nameInput.value.trim();
        var pool = (collaboratorRoleMap[currentName] && collaboratorRoleMap[currentName].length)
          ? collaboratorRoleMap[currentName]
          : Object.keys(collaboratorRoleMap).reduce(function(acc, k) {
              collaboratorRoleMap[k].forEach(function(r) { if (acc.indexOf(r) === -1) acc.push(r); });
              return acc;
            }, []);
        roleSugg.innerHTML = '';
        if (!query) { roleSugg.hidden = true; return; }
        var matches = pool.filter(function(r) {
          return r.toLowerCase().indexOf(query) !== -1;
        }).slice(0, 8);
        if (matches.length === 0) { roleSugg.hidden = true; return; }
        matches.forEach(function(r) {
          var li = document.createElement('li');
          li.textContent = r;
          li.dataset.value = r;
          roleSugg.appendChild(li);
        });
        roleSugg.hidden = false;
      });
      roleSugg.addEventListener('click', function(e) {
        var li = e.target.closest('li');
        if (!li) return;
        roleInput.value = li.dataset.value;
        roleSugg.hidden = true;
        syncCollaboratorsFromDOM();
      });
      roleInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') roleSugg.hidden = true;
      });
      roleInput.addEventListener('blur', function() {
        setTimeout(function() { roleSugg.hidden = true; }, 150);
      });

      // Sync on plain text input
      nameInput.addEventListener('input', syncCollaboratorsFromDOM);
      roleInput.addEventListener('input', syncCollaboratorsFromDOM);

      var nameWrap = document.createElement('div');
      nameWrap.className = 'tag-input-wrap';
      nameWrap.appendChild(nameInput);
      nameWrap.appendChild(nameSugg);

      var roleWrap = document.createElement('div');
      roleWrap.className = 'tag-input-wrap';
      roleWrap.appendChild(roleInput);
      roleWrap.appendChild(roleSugg);

      row.appendChild(nameWrap);
      row.appendChild(roleWrap);
      row.appendChild(removeBtn);
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
  function openEpCategoryDropdown() {
    epCategoryDropdown.classList.add('is-open');
    epCategoryDropdownBtn.setAttribute('aria-expanded', 'true');
    epCategoryDrawer.setAttribute('aria-hidden', 'false');
    epCategoryInput.value = '';
    renderCategoryDrawerTags('');
    epCategoryInput.focus();
  }

  function closeEpCategoryDropdown() {
    epCategoryDropdown.classList.remove('is-open');
    epCategoryDropdownBtn.setAttribute('aria-expanded', 'false');
    epCategoryDrawer.setAttribute('aria-hidden', 'true');
  }

  epCategoryDropdownBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    epCategoryDropdown.classList.contains('is-open') ? closeEpCategoryDropdown() : openEpCategoryDropdown();
  });

  document.addEventListener('click', function(e) {
    // Use composedPath so detached nodes (removed by DOM re-render during click) still resolve correctly
    var path = e.composedPath ? e.composedPath() : [];
    var insideDropdown = path.indexOf(epCategoryDropdown) !== -1 || epCategoryDropdown.contains(e.target);
    if (!insideDropdown) closeEpCategoryDropdown();
  });

  function renderCategoryDrawerTags(query) {
    var upper = query.toUpperCase();
    var current = getPanelCategories();
    epCategorySuggestions.innerHTML = '';

    var matches = canonicalCategories.filter(function(c) {
      return current.indexOf(c) === -1 && (!upper || c.indexOf(upper) !== -1);
    });

    matches.forEach(function(cat) {
      var tag = document.createElement('span');
      tag.className = 'cat-tag cat-tag--pick';
      tag.textContent = cat;
      tag.dataset.value = cat;
      epCategorySuggestions.appendChild(tag);
    });

    // Show "create" option if typed value doesn't match any existing category
    if (upper && canonicalCategories.indexOf(upper) === -1) {
      var newTag = document.createElement('span');
      newTag.className = 'cat-tag cat-tag--pick cat-tag--new';
      newTag.textContent = '+ ' + upper;
      newTag.dataset.value = upper;
      epCategorySuggestions.appendChild(newTag);
    }
  }

  epCategorySuggestions.addEventListener('click', function(e) {
    var tag = e.target.closest('.cat-tag--pick');
    if (!tag) return;
    addPanelCategory(tag.dataset.value);
  });

  epCategoryInput.addEventListener('input', function() {
    renderCategoryDrawerTags(this.value.trim());
  });

  epCategoryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = this.value.trim();
      if (val) { addPanelCategory(val); }
    }
    if (e.key === 'Escape') closeEpCategoryDropdown();
  });

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
      // Refresh drawer if open so removed tag becomes available again
      if (epCategoryDropdown.classList.contains('is-open')) {
        renderCategoryDrawerTags(epCategoryInput.value.trim());
      }
    }
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
    // Refresh drawer tags to remove just-added category
    renderCategoryDrawerTags('');
  }

  // ---- Status combobox ----
  epStatus.addEventListener('input', function() {
    var query = this.value.trim().toLowerCase();
    if (!query) { epStatusSuggestions.hidden = true; return; }
    var matches = knownStatuses.filter(function(s) {
      return s.toLowerCase().indexOf(query) !== -1;
    }).slice(0, 8);
    if (matches.length === 0) { epStatusSuggestions.hidden = true; return; }
    epStatusSuggestions.innerHTML = matches.map(function(s) {
      return '<li data-value="' + escHtml(s) + '">' + escHtml(s) + '</li>';
    }).join('');
    epStatusSuggestions.hidden = false;
  });
  epStatusSuggestions.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    epStatus.value = li.dataset.value;
    epStatusSuggestions.hidden = true;
    // Extend known statuses if new value
    var val = li.dataset.value;
    if (knownStatuses.indexOf(val) === -1) {
      knownStatuses.push(val);
      knownStatuses.sort();
    }
  });
  epStatus.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') epStatusSuggestions.hidden = true;
  });
  epStatus.addEventListener('blur', function() {
    setTimeout(function() { epStatusSuggestions.hidden = true; }, 150);
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

  // ---- Related entries editor (project → non-project) ----
  function renderRelatedEntriesTags(relatedEntries) {
    epRelatedEntriesList.innerHTML = '';
    (relatedEntries || []).forEach(function(slug) {
      var entry = nonProjectEntries.filter(function(e) { return e.slug === slug; })[0];
      var label = entry ? (entry.title + ' [' + slug + ']') : slug;
      var tag = document.createElement('span');
      tag.className = 'cat-tag';
      tag.innerHTML = escHtml(label) + '<span class="cat-tag__remove" data-slug="' + escHtml(slug) + '">&times;</span>';
      epRelatedEntriesList.appendChild(tag);
    });
  }

  function getPanelRelatedEntries() {
    var slugs = [];
    epRelatedEntriesList.querySelectorAll('.cat-tag__remove').forEach(function(el) {
      slugs.push(el.dataset.slug);
    });
    return slugs;
  }

  epRelatedEntriesList.addEventListener('click', function(e) {
    if (e.target.classList.contains('cat-tag__remove')) {
      if (!activeEditPath) return;
      var entry = findEntry(activeEditPath);
      if (!entry) return;
      var slug = e.target.dataset.slug;
      entry.relatedEntries = (entry.relatedEntries || []).filter(function(s) { return s !== slug; });
      renderRelatedEntriesTags(entry.relatedEntries);
    }
  });

  epRelatedEntriesInput.addEventListener('input', function() {
    var query = this.value.trim().toLowerCase();
    if (!query) { epRelatedEntriesSuggestions.hidden = true; return; }

    var entry = activeEditPath ? findEntry(activeEditPath) : null;
    var current = entry ? (entry.relatedEntries || []) : [];

    var matches = nonProjectEntries.filter(function(e) {
      return current.indexOf(e.slug) === -1 &&
        (e.slug.toLowerCase().indexOf(query) !== -1 || e.title.toLowerCase().indexOf(query) !== -1);
    }).slice(0, 8);

    if (matches.length === 0) { epRelatedEntriesSuggestions.hidden = true; return; }

    epRelatedEntriesSuggestions.innerHTML = matches.map(function(e) {
      return '<li data-slug="' + escHtml(e.slug) + '">' + escHtml(e.title) + ' <span style="opacity:0.5">' + escHtml(e.slug) + '</span></li>';
    }).join('');
    epRelatedEntriesSuggestions.hidden = false;
  });

  epRelatedEntriesInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var val = this.value.trim();
      if (val) addRelatedEntry(val);
    }
    if (e.key === 'Escape') epRelatedEntriesSuggestions.hidden = true;
  });

  epRelatedEntriesSuggestions.addEventListener('click', function(e) {
    var li = e.target.closest('li');
    if (!li) return;
    addRelatedEntry(li.dataset.slug);
  });

  function addRelatedEntry(slug) {
    if (!activeEditPath) return;
    var entry = findEntry(activeEditPath);
    if (!entry) return;
    if (!entry.relatedEntries) entry.relatedEntries = [];
    if (entry.relatedEntries.indexOf(slug) !== -1) return;
    entry.relatedEntries.push(slug);
    renderRelatedEntriesTags(entry.relatedEntries);
    epRelatedEntriesInput.value = '';
    epRelatedEntriesSuggestions.hidden = true;
  }

  // ---- Rich body editor (contenteditable, stores as markdown) ----

  // Convert markdown string → HTML for the editor
  function markdownToHtml(text) {
    if (!text) return '';
    var lines = text.split('\n');
    var html = '';
    var inList = false;
    lines.forEach(function(raw) {
      // Inline: escape HTML first, then apply inline markdown
      var line = raw
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
      if (/^## /.test(line)) {
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
        // empty line → paragraph break (br keeps spacing in contenteditable)
        html += '<p><br></p>';
      } else {
        if (inList) { html += '</ul>'; inList = false; }
        html += '<p>' + line + '</p>';
      }
    });
    if (inList) html += '</ul>';
    return html;
  }

  // Convert the contenteditable DOM back to markdown string for storage
  function htmlToMarkdown(el) {
    function nodeToMd(node) {
      if (node.nodeType === Node.TEXT_NODE) return node.textContent;
      var tag = node.tagName ? node.tagName.toLowerCase() : '';
      var inner = Array.from(node.childNodes).map(nodeToMd).join('');
      if (tag === 'strong' || tag === 'b') return '**' + inner + '**';
      if (tag === 'em' || tag === 'i') return '*' + inner + '*';
      if (tag === 'a') return '[' + inner + '](' + (node.getAttribute('href') || '') + ')';
      if (tag === 'br') return '';
      if (tag === 'h1') return '# ' + inner;
      if (tag === 'h2') return '## ' + inner;
      if (tag === 'li') return '- ' + inner;
      if (tag === 'ul' || tag === 'ol') {
        return Array.from(node.children).map(function(li) { return '- ' + Array.from(li.childNodes).map(nodeToMd).join(''); }).join('\n');
      }
      if (tag === 'p') {
        if (inner === '' || inner === '\n') return '';
        return inner;
      }
      if (tag === 'div') return inner;
      return inner;
    }
    var lines = [];
    var node = el.firstChild;
    while (node) {
      var tag = node.tagName ? node.tagName.toLowerCase() : '';
      if (tag === 'ul' || tag === 'ol') {
        Array.from(node.children).forEach(function(li) {
          lines.push('- ' + Array.from(li.childNodes).map(nodeToMd).join(''));
        });
      } else {
        var md = nodeToMd(node).replace(/\n$/, '');
        lines.push(md);
      }
      node = node.nextSibling;
    }
    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  }

  function getBodyMarkdown() {
    return htmlToMarkdown(epBody);
  }

  function setBodyHtml(markdown) {
    epBody.innerHTML = markdownToHtml(markdown) || '<p><br></p>';
  }

  // Update active state of toolbar buttons based on cursor position
  function updateToolbarState() {
    var boldActive = document.queryCommandState('bold');
    var italicActive = document.queryCommandState('italic');
    var sel = window.getSelection();
    var h2Active = false;
    var ulActive = false;
    if (sel && sel.anchorNode) {
      var block = sel.anchorNode;
      while (block && block !== epBody) {
        if (block.nodeType === Node.ELEMENT_NODE) {
          var t = block.tagName.toLowerCase();
          if (t === 'h2' || t === 'h1') h2Active = true;
          if (t === 'ul' || t === 'li') ulActive = true;
        }
        block = block.parentNode;
      }
    }
    document.querySelectorAll('.ep-fmt-btn').forEach(function(btn) {
      var fmt = btn.dataset.fmt;
      btn.classList.toggle('is-active',
        (fmt === 'bold' && boldActive) ||
        (fmt === 'italic' && italicActive) ||
        (fmt === 'h2' && h2Active) ||
        (fmt === 'ul' && ulActive)
      );
    });
  }

  epBody.addEventListener('keyup', updateToolbarState);
  epBody.addEventListener('mouseup', updateToolbarState);
  epBody.addEventListener('focus', updateToolbarState);

  // ---- Link mini-modal ----
  var linkModal = document.getElementById('link-modal');
  var linkModalText = document.getElementById('link-modal-text');
  var linkModalUrl = document.getElementById('link-modal-url');
  var linkModalConfirm = document.getElementById('link-modal-confirm');
  var linkModalCancel = document.getElementById('link-modal-cancel');
  var savedRange = null;

  function openLinkModal() {
    // savedRange was already captured in mousedown before focus shifted
    var selectedText = savedRange ? savedRange.toString() : '';
    // Pre-fill if the range sits inside an existing <a>
    var anchorEl = null;
    if (savedRange) {
      var node = savedRange.commonAncestorContainer;
      while (node && node !== epBody) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          anchorEl = node;
          break;
        }
        node = node.parentNode;
      }
    }
    if (anchorEl) {
      linkModalText.value = anchorEl.textContent;
      linkModalUrl.value = anchorEl.getAttribute('href') || '';
    } else {
      linkModalText.value = selectedText;
      linkModalUrl.value = '';
    }
    linkModal.hidden = false;
    (linkModalUrl.value ? linkModalUrl : (linkModalText.value ? linkModalUrl : linkModalText)).focus();
  }

  function closeLinkModal() {
    linkModal.hidden = true;
    savedRange = null;
    epBody.focus();
  }

  linkModalConfirm.addEventListener('click', function() {
    var text = linkModalText.value.trim() || linkModalUrl.value.trim();
    var url = linkModalUrl.value.trim();
    if (!url) { linkModalUrl.focus(); return; }

    epBody.focus();

    // Check if savedRange sits inside an existing <a> to update it in place
    var anchorEl = null;
    if (savedRange) {
      var node = savedRange.commonAncestorContainer;
      while (node && node !== epBody) {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
          anchorEl = node;
          break;
        }
        node = node.parentNode;
      }
    }

    if (anchorEl && epBody.contains(anchorEl)) {
      anchorEl.textContent = text;
      anchorEl.href = url;
    } else {
      var a = document.createElement('a');
      a.href = url;
      a.textContent = text;
      if (savedRange) {
        savedRange.deleteContents();
        savedRange.insertNode(a);
        var sel = window.getSelection();
        var range = document.createRange();
        range.setStartAfter(a);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      } else {
        // No saved range — insert at end of editor
        epBody.appendChild(a);
      }
    }
    closeLinkModal();
  });

  linkModalCancel.addEventListener('click', closeLinkModal);
  linkModal.addEventListener('click', function(e) { if (e.target === linkModal) closeLinkModal(); });
  linkModalUrl.addEventListener('keydown', function(e) { if (e.key === 'Enter') linkModalConfirm.click(); });

  // ---- Formatting toolbar ----
  document.querySelectorAll('.ep-fmt-btn').forEach(function(btn) {
    btn.addEventListener('mousedown', function(e) {
      // Prevent the editor from losing focus so selection is preserved
      e.preventDefault();
      // For the link button, capture selection now before the modal opens
      if (this.dataset.fmt === 'link') {
        var sel = window.getSelection();
        savedRange = (sel && sel.rangeCount && epBody.contains(sel.anchorNode))
          ? sel.getRangeAt(0).cloneRange()
          : null;
      }
    });
    btn.addEventListener('click', function() {
      var fmt = this.dataset.fmt;
      if (fmt === 'link') {
        openLinkModal();
        return;
      }
      epBody.focus();
      var sel = window.getSelection();
      if (fmt === 'bold') {
        document.execCommand('bold', false, null);
      } else if (fmt === 'italic') {
        document.execCommand('italic', false, null);
      } else if (fmt === 'h2') {
        // Toggle heading: if already in h2, switch to paragraph
        var inH2 = document.queryCommandValue('formatBlock') === 'h2';
        document.execCommand('formatBlock', false, inH2 ? 'p' : 'h2');
      } else if (fmt === 'ul') {
        document.execCommand('insertUnorderedList', false, null);
      }
      updateToolbarState();
    });
  });

  // ---- Manage labels modal (rename categories + types) ----

  function createCategory(name) {
    var normalized = name.trim().toUpperCase();
    if (!normalized) return 'Enter a name.';
    if (canonicalCategories.indexOf(normalized) !== -1) return 'Already exists.';
    canonicalCategories.push(normalized);
    canonicalCategoriesChanged = true;
    updateChanges();
    return null;
  }

  function createType(name) {
    var normalized = name.trim().toLowerCase();
    if (!normalized) return 'Enter a name.';
    if (normalized === 'project') return 'Reserved name.';
    if (knownTypes.indexOf(normalized) !== -1) return 'Already exists.';
    knownTypes.push(normalized);
    updateChanges();
    return null;
  }

  function renameCategory(oldName, newName) {
    newName = newName.trim().toUpperCase();
    if (!newName || newName === oldName) return;
    // Update canonicalCategories list
    var idx = canonicalCategories.indexOf(oldName);
    if (idx !== -1) canonicalCategories.splice(idx, 1, newName);
    else canonicalCategories.push(newName);
    canonicalCategories.sort();
    canonicalCategoriesChanged = true;
    // Update every entry that has this category
    entries.forEach(function(e) {
      if (!e.categories) return;
      var ci = e.categories.indexOf(oldName);
      if (ci !== -1) e.categories.splice(ci, 1, newName);
    });
    updateChanges();
    renderTable();
  }

  function deleteCategory(name) {
    var idx = canonicalCategories.indexOf(name);
    if (idx !== -1) canonicalCategories.splice(idx, 1);
    canonicalCategoriesChanged = true;
    // Strip category from every entry that has it
    entries.forEach(function(e) {
      if (!e.categories) return;
      var ci = e.categories.indexOf(name);
      if (ci !== -1) e.categories.splice(ci, 1);
    });
    updateChanges();
    renderTable();
  }

  function deleteType(name) {
    if (name === 'project') {
      alert('The "project" type cannot be deleted.');
      return;
    }
    var idx = knownTypes.indexOf(name);
    if (idx !== -1) knownTypes.splice(idx, 1);
    entries.forEach(function(e) {
      if (e.entryType === name) e.entryType = null;
    });
    updateChanges();
    renderTable();
    refreshTypeFilterNoTypeItem();
  }

  function refreshTypeFilterNoTypeItem() {
    var drawer = typeFiltersEl.querySelector('.admin-dropdown__drawer');
    var existing = drawer.querySelector('[data-value=""]');
    var hasNoType = entries.some(function(e) { return !e.entryType; });
    if (hasNoType && !existing) {
      var item = document.createElement('button');
      item.className = 'admin-dropdown__item';
      item.type = 'button';
      item.dataset.value = '';
      item.textContent = 'NO TYPE';
      drawer.appendChild(item);
    } else if (!hasNoType && existing) {
      existing.remove();
    }
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

  function renderManageList(tbody, items, onRename, onDelete, isCategories, onSelectionChange) {
    tbody.innerHTML = '';
    items.forEach(function(name) {
      // Count entries using this label
      var count = 0;
      if (isCategories) {
        entries.forEach(function(e) {
          if (e.categories && e.categories.indexOf(name) !== -1) count++;
        });
      } else {
        entries.forEach(function(e) {
          if (e.entryType === name) count++;
        });
      }

      var tr = document.createElement('tr');

      // Select cell
      var tdSelect = document.createElement('td');
      tdSelect.className = 'manage-col-select';
      var cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'manage-row-checkbox';
      cb.dataset.name = name;
      cb.addEventListener('change', function() {
        if (onSelectionChange) onSelectionChange();
      });
      tdSelect.appendChild(cb);
      tr.appendChild(tdSelect);

      // Label cell
      var tdLabel = document.createElement('td');
      tdLabel.className = 'manage-col-label';

      var label = document.createElement('span');
      label.className = 'manage-list-label';
      label.textContent = name.toUpperCase();

      var input = document.createElement('input');
      input.type = 'text';
      input.className = 'manage-list-input';
      input.value = name.toUpperCase();
      input.hidden = true;

      tdLabel.appendChild(label);
      tdLabel.appendChild(input);

      // Count cell
      var tdCount = document.createElement('td');
      tdCount.className = 'manage-col-count';
      tdCount.textContent = count || '';

      // Actions cell
      var tdActions = document.createElement('td');
      tdActions.className = 'manage-col-actions';

      var editBtn = document.createElement('button');
      editBtn.className = 'btn btn--small btn--secondary';
      editBtn.textContent = 'Rename';

      editBtn.addEventListener('click', function() {
        if (input.hidden) {
          // Enter edit mode
          input.value = name.toUpperCase();
          label.hidden = true;
          if (delBtn) delBtn.hidden = true;
          input.hidden = false;
          editBtn.textContent = 'Save';
          input.focus();
          input.select();
        } else {
          // Commit rename
          var newVal = input.value.trim();
          if (newVal && newVal !== name.toUpperCase()) {
            onRename(name, newVal);
            return;
          }
          // No change — just cancel
          label.hidden = false;
          if (delBtn) delBtn.hidden = false;
          input.hidden = true;
          editBtn.textContent = 'Rename';
        }
      });

      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') editBtn.click();
        if (e.key === 'Escape') {
          label.hidden = false;
          if (delBtn) delBtn.hidden = false;
          input.hidden = true;
          editBtn.textContent = 'Rename';
        }
      });

      var delBtn = null;
      if (onDelete) {
        delBtn = document.createElement('button');
        delBtn.className = 'btn btn--small btn--danger';
        delBtn.textContent = 'Del';
        delBtn.addEventListener('click', function() {
          if (count > 0 && !window.confirm('Remove "' + name.toUpperCase() + '" from all ' + count + ' entries?')) return;
          onDelete(name);
        });
      }
      tdActions.appendChild(editBtn);
      if (delBtn) tdActions.appendChild(delBtn);

      tr.appendChild(tdLabel);
      tr.appendChild(tdCount);
      tr.appendChild(tdActions);
      tbody.appendChild(tr);
    });

  }

  function getSelectedManageNames(tbody) {
    var checked = tbody.querySelectorAll('.manage-row-checkbox:checked');
    return Array.prototype.map.call(checked, function(cb) { return cb.dataset.name; });
  }

  function updateCombineBtn() {
    // Determine which panel is active
    var activeIsCategories = !manageCategoriesPanel.hidden;
    var tbody = activeIsCategories ? manageCategoriesList : manageTypesList;
    var selected = getSelectedManageNames(tbody);
    if (selected.length >= 2) {
      manageCombineBtn.textContent = 'Combine ' + selected.length + ' Labels';
      manageCombineBtn.hidden = false;
    } else {
      manageCombineBtn.hidden = true;
    }
  }

  function openManageModal() {
    var manageCreateInput = document.getElementById('manage-create-input');
    var manageCreateBtn = document.getElementById('manage-create-btn');
    var manageCreateError = document.getElementById('manage-create-error');

    function renderCategories() {
      renderManageList(manageCategoriesList, canonicalCategories.slice(), onCategoryRename, onCategoryDelete, true, updateCombineBtn);
      updateCombineBtn();
    }
    function renderTypes() {
      renderManageList(manageTypesList, knownTypes.slice(), onTypeRename, onTypeDelete, false, updateCombineBtn);
      updateCombineBtn();
    }
    function onCategoryRename(oldName, newName) {
      renameCategory(oldName, newName.toUpperCase());
      renderCategories();
    }
    function onCategoryDelete(name) {
      deleteCategory(name);
      renderCategories();
    }
    function onTypeRename(oldName, newName) {
      renameType(oldName, newName.toLowerCase());
      renderTypes();
    }
    function onTypeDelete(name) {
      deleteType(name);
      renderTypes();
    }

    function doCreate() {
      var activeIsCategories = !manageCategoriesPanel.hidden;
      var err = activeIsCategories ? createCategory(manageCreateInput.value) : createType(manageCreateInput.value);
      if (err) {
        manageCreateError.textContent = err;
        manageCreateInput.addEventListener('input', function clear() {
          manageCreateError.textContent = '';
          manageCreateInput.removeEventListener('input', clear);
        });
        return;
      }
      manageCreateInput.value = '';
      if (activeIsCategories) renderCategories(); else renderTypes();
    }

    manageCreateBtn.onclick = doCreate;
    manageCreateInput.onkeydown = function(e) { if (e.key === 'Enter') doCreate(); };

    function combineSelected() {
      var activeIsCategories = !manageCategoriesPanel.hidden;
      var tbody = activeIsCategories ? manageCategoriesList : manageTypesList;
      var selected = getSelectedManageNames(tbody);
      if (selected.length < 2) return;
      var target = window.prompt('Combine into label (all selected will be renamed to this):', selected[0].toUpperCase());
      if (!target) return;
      target = target.trim();
      if (!target) return;
      // Apply renames: for each selected name, rename to target
      selected.forEach(function(name) {
        if (activeIsCategories) {
          renameCategory(name, target.toUpperCase());
        } else {
          renameType(name, target.toLowerCase());
        }
      });
      // Deduplicate in case the target already existed before combining
      if (activeIsCategories) {
        var seen = {};
        canonicalCategories = canonicalCategories.filter(function(c) {
          if (seen[c]) return false;
          seen[c] = true;
          return true;
        });
        renderCategories();
      } else {
        var seenT = {};
        knownTypes = knownTypes.filter(function(t) {
          if (seenT[t]) return false;
          seenT[t] = true;
          return true;
        });
        renderTypes();
      }
    }

    manageCombineBtn.onclick = combineSelected;

    renderCategories();
    renderTypes();
    manageCombineBtn.hidden = true;
    manageCreateInput.value = '';
    manageCreateError.textContent = '';
    manageCreateInput.placeholder = 'New type\u2026';
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
    var createInput = document.getElementById('manage-create-input');
    if (createInput) createInput.placeholder = tab === 'categories' ? 'New category\u2026' : 'New type\u2026';
    updateCombineBtn();
  });

  // ---- Bulk operations ----
  var bulkMode = null;

  function openBulkModal(mode) {
    bulkMode = mode;
    bulkTabAdd.classList.toggle('is-active', mode === 'add');
    bulkTabRemove.classList.toggle('is-active', mode === 'remove');
    var tbody = document.getElementById('bulk-entries-body');
    tbody.innerHTML = '';
    entries.forEach(function(e) {
      if (!selectedPaths.has(e.filePath)) return;
      var tr = document.createElement('tr');
      var tdTitle = document.createElement('td');
      tdTitle.className = 'bulk-col-title manage-list-label';
      tdTitle.textContent = e.title || e.slug;
      var tdCats = document.createElement('td');
      tdCats.className = 'bulk-col-categories manage-list-label';
      tdCats.textContent = (e.categories || []).join(', ');
      tr.appendChild(tdTitle);
      tr.appendChild(tdCats);
      tbody.appendChild(tr);
    });
    bulkCategoryInput.value = '';
    bulkCategorySuggestions.innerHTML = '';
    bulkModal.hidden = false;
    bulkCategoryInput.focus();
    renderBulkSuggestions('');
  }

  bulkActionsBtn.addEventListener('click', function() {
    openBulkModal('add');
  });

  bulkTabAdd.addEventListener('click', function() {
    openBulkModal('add');
  });

  bulkTabRemove.addEventListener('click', function() {
    openBulkModal('remove');
  });

  bulkModalCancel.addEventListener('click', function() { bulkModal.hidden = true; });

  bulkCategoryInput.addEventListener('input', function() {
    renderBulkSuggestions(this.value.trim());
  });

  bulkCategoryInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
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
    bulkCategoryInput.value = li.dataset.value;
    bulkCategorySuggestions.innerHTML = '';
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

  // ---- Clear changes ----
  clearBtn.addEventListener('click', function() {
    clearModal.hidden = false;
  });
  clearModalCancel.addEventListener('click', function() {
    clearModal.hidden = true;
  });
  clearModalConfirm.addEventListener('click', function() {
    clearModal.hidden = true;
    // Revert entries to originals, remove new/deleted entries
    entries = entries.filter(function(e) { return !e._isNew; });
    entries.forEach(function(e) {
      // For renamed entries, restore original filePath and slug before looking up originals
      var originalFilePath = e._renameFrom || e.filePath;
      delete e._delete;
      delete e._renameFrom;
      var orig = originals[originalFilePath];
      if (!orig) return;
      e.filePath = originalFilePath;
      e.slug = orig.slug;
      e.categories = orig.categories.slice();
      e.entryType = orig.entryType;
      e.draft = orig.draft;
      e.title = orig.title;
      e.subtitle = orig.subtitle;
      e.description = orig.description;
      e.date = orig.date;
      e.link = orig.link;
      e.position = orig.position;
      e.year = orig.year;
      e.location = orig.location;
      e.status = orig.status;
      e.featured = orig.featured;
      e.featuredPosition = orig.featuredPosition;
      e.showInAwardsTable = orig.showInAwardsTable;
      e.active = orig.active;
      e.collaborators = JSON.parse(orig.collaborators);
      e.relatedProjects = JSON.parse(orig.relatedProjects);
      e.relatedEntries = JSON.parse(orig.relatedEntries || '[]');
      e.body = orig.body;
    });
    canonicalCategories = (window.__CATEGORIES__ || []).slice();
    canonicalCategoriesChanged = false;
    knownTypes = initialKnownTypes.slice();
    changes = {};
    fileOps = {};
    fileListCache = {};
    closeEditPanel();
    updateChanges();
    renderTable();
  });

  // ---- Save confirmation modal ----
  var saveConfirmModal = document.getElementById('save-confirm-modal');
  var saveConfirmTbody = document.getElementById('save-confirm-tbody');
  var saveConfirmBtn = document.getElementById('save-confirm-btn');
  var saveConfirmCancel = document.getElementById('save-confirm-cancel');

  // Human-readable labels for diffable fields (in display order)
  var DIFF_FIELDS = [
    { key: 'entryType',        label: 'Type' },
    { key: 'slug',             label: 'Slug' },
    { key: 'title',            label: 'Title' },
    { key: 'subtitle',         label: 'Subtitle' },
    { key: 'description',      label: 'Description' },
    { key: 'date',             label: 'Date' },
    { key: 'year',             label: 'Year' },
    { key: 'draft',            label: 'Draft' },
    { key: 'active',           label: 'Active' },
    { key: 'link',             label: 'Link' },
    { key: 'location',         label: 'Location' },
    { key: 'status',           label: 'Status' },
    { key: 'position',         label: 'Position' },
    { key: 'featured',         label: 'Featured' },
    { key: 'featuredPosition', label: 'Feat. position' },
    { key: 'showInAwardsTable',label: 'Awards table' },
    { key: 'categories',       label: 'Categories' },
    { key: 'collaborators',    label: 'Collaborators' },
    { key: 'relatedProjects',  label: 'Related projects' },
    { key: 'relatedEntries',   label: 'Related entries' },
    { key: 'body',             label: 'Body' }
  ];

  // Normalise a snapshot value to a stable comparable string and a readable display string
  function normField(key, val) {
    // snapshot() stores categories as array, collaborators/related* as JSON strings
    if (key === 'categories') {
      var arr = Array.isArray(val) ? val : (val || []);
      return { cmp: JSON.stringify(arr.slice().sort()), display: arr.length ? arr.join(', ') : '—' };
    }
    if (key === 'collaborators' || key === 'relatedProjects' || key === 'relatedEntries') {
      var parsed = typeof val === 'string' ? JSON.parse(val || '[]') : (val || []);
      if (key === 'collaborators') {
        var entries2 = parsed.map(function(c) { return c.role ? (c.name + ' (' + c.role + ')') : c.name; });
        var sorted2 = entries2.slice().sort();
        return { cmp: JSON.stringify(sorted2), display: entries2.length ? entries2.join(', ') : '—' };
      }
      var sortedArr = parsed.slice().sort();
      return { cmp: JSON.stringify(sortedArr), display: sortedArr.length ? sortedArr.join(', ') : '—' };
    }
    if (key === 'date') {
      var d = val ? String(val).slice(0, 10) : '';
      return { cmp: d, display: d || '—' };
    }
    if (key === 'draft' || key === 'featured' || key === 'showInAwardsTable' || key === 'active') {
      var b = val === true || val === 'true';
      return { cmp: String(b), display: b ? 'Yes' : 'No' };
    }
    if (key === 'body') {
      var s = (val || '').trim();
      return { cmp: s, display: s.length > 80 ? s.slice(0, 80) + '…' : (s || '—') };
    }
    var str = val !== null && val !== undefined ? String(val) : '';
    return { cmp: str, display: str || '—' };
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function buildSaveConfirmRows() {
    var html = '';
    var changeList = Object.keys(changes).map(function(k) { return changes[k]; });

    changeList.forEach(function(c) {
      var action = c.action || 'edit';
      var actionLabel = { create: 'New', rename: 'Rename', delete: 'Delete', edit: 'Edit', updateCategories: 'Edit' }[action] || action;
      var actionClass = { create: 'sct-action--create', rename: 'sct-action--rename', delete: 'sct-action--delete' }[action] || '';

      var entry = entries.filter(function(e) { return e.filePath === c.filePath; })[0];
      var entryName = entry ? (entry.title || entry.slug || c.filePath) : c.filePath;

      // Build list of { label, oldVal, newVal } rows
      var fieldRows = [];

      if (action === 'updateCategories') {
        entryName = 'Category labels';
        fieldRows.push({ label: 'Categories', oldVal: '—', newVal: 'canonical list updated' });
      } else if (action === 'delete') {
        fieldRows.push({ label: '—', oldVal: 'Entry will be deleted', newVal: '—' });
      } else if (action === 'create') {
        var cur = snapshot(entry);
        DIFF_FIELDS.forEach(function(f) {
          var n = normField(f.key, cur[f.key]);
          if (n.cmp !== '' && n.cmp !== 'false' && n.cmp !== '[]' && n.cmp !== 'null') {
            fieldRows.push({ label: f.label, oldVal: '—', newVal: esc(n.display) });
          }
        });
      } else {
        // edit or rename
        var origKey = (entry && entry._renameFrom) || c.filePath;
        var orig = originals[origKey];
        var cur2 = snapshot(entry);

        DIFF_FIELDS.forEach(function(f) {
          var o = normField(f.key, orig ? orig[f.key] : undefined);
          var n = normField(f.key, cur2[f.key]);
          if (o.cmp !== n.cmp) {
            fieldRows.push({ label: f.label, oldVal: esc(o.display), newVal: esc(n.display) });
          }
        });

        if (fieldRows.length === 0) {
          fieldRows.push({ label: '—', oldVal: '—', newVal: '—' });
        }
      }

      var rowspan = fieldRows.length;
      fieldRows.forEach(function(fr, i) {
        var rowClasses = (i === 0 ? 'sct-entry-first' : 'sct-entry-cont') + (i === rowspan - 1 ? ' sct-entry-last' : '');
        html += '<tr class="' + rowClasses + '">';
        if (i === 0) {
          html += '<td class="sct-col-entry" rowspan="' + rowspan + '">' + esc(entryName) + '</td>';
          html += '<td class="sct-col-action" rowspan="' + rowspan + '"><span class="sct-action ' + actionClass + '">' + actionLabel + '</span></td>';
        }
        html += '<td class="sct-col-field">' + fr.label + '</td>';
        html += '<td class="sct-col-old">' + fr.oldVal + '</td>';
        html += '<td class="sct-col-new">' + fr.newVal + '</td>';
        html += '</tr>';
      });
    });

    Object.keys(fileOps).forEach(function(path) {
      if (changes[path]) return;
      var opsList = buildFileOpsList(path, fileOps[path]);
      if (opsList.length === 0) return;
      var entry = entries.filter(function(e) { return e.filePath === path; })[0];
      var entryName = entry ? (entry.title || entry.slug || path) : path;
      html += '<tr class="sct-entry-first sct-entry-last">';
      html += '<td class="sct-col-entry">' + esc(entryName) + '</td>';
      html += '<td class="sct-col-action"><span class="sct-action">Edit</span></td>';
      html += '<td class="sct-col-field">Files</td>';
      html += '<td class="sct-col-old">—</td>';
      html += '<td class="sct-col-new">' + opsList.length + ' file operation(s)</td>';
      html += '</tr>';
    });

    return html;
  }

  function syncRelatedEntries() {
    // Two-way sync: relatedEntries on projects → relatedProjects on non-project entries
    entries.forEach(function(projectEntry) {
      if (!isProject(projectEntry.entryType)) return;
      var orig = originals[projectEntry.filePath];
      var origRelated = orig ? JSON.parse(orig.relatedEntries || '[]') : [];
      var newRelated = projectEntry.relatedEntries || [];

      newRelated.forEach(function(slug) {
        if (origRelated.indexOf(slug) !== -1) return;
        var target = findEntry('entries/other/' + slug + '/' + slug + '.md') ||
          entries.filter(function(e) { return e.slug === slug && !isProject(e.entryType); })[0];
        if (!target) return;
        if (!target.relatedProjects) target.relatedProjects = [];
        if (target.relatedProjects.indexOf(projectEntry.slug) === -1) {
          target.relatedProjects.push(projectEntry.slug);
          updateChanges();
        }
      });

      origRelated.forEach(function(slug) {
        if (newRelated.indexOf(slug) !== -1) return;
        var target = entries.filter(function(e) { return e.slug === slug && !isProject(e.entryType); })[0];
        if (!target) return;
        target.relatedProjects = (target.relatedProjects || []).filter(function(s) { return s !== projectEntry.slug; });
        updateChanges();
      });
    });
  }

  function doSave() {
    var changeList = Object.keys(changes).map(function(path) {
      var change = changes[path];
      var ops = fileOps[path];
      if (ops) {
        var opsList = buildFileOpsList(path, ops);
        if (opsList.length > 0) change.fileOps = opsList;
      }
      return change;
    });
    // Include entries that have file ops but no frontmatter changes
    Object.keys(fileOps).forEach(function(path) {
      if (changes[path]) return;
      var opsList = buildFileOpsList(path, fileOps[path]);
      if (opsList.length > 0) {
        changeList.push({ filePath: path, action: 'fileOpsOnly', fileOps: opsList });
      }
    });
    if (changeList.length === 0) return;

    saveConfirmModal.hidden = true;
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

      entries = entries.filter(function(e) { return !e._delete; });
      entries.forEach(function(e) {
        if (e._isNew) delete e._isNew;
        if (e._renameFrom) delete e._renameFrom;
      });

      originals = {};
      entries.forEach(function(e) {
        originals[e.filePath] = snapshot(e);
      });

      canonicalCategoriesChanged = false;
      changes = {};
      fileOps = {};
      fileListCache = {};
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
  }

  // ---- Docs modal ----
  var docsTree = null;
  var docsActiveFile = null;
  var markedLoaded = false;

  function loadMarked(cb) {
    if (markedLoaded) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
    s.onload = function() { markedLoaded = true; cb(); };
    document.head.appendChild(s);
  }

  function labelFromFolder(folderName) {
    // "01-understanding-the-site" → "Understanding The Site"
    return folderName.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  function labelFromFile(filePath) {
    var name = filePath.split('/').pop().replace(/\.md$/, '');
    return name.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });
  }

  function buildDocsNav(files) {
    var folders = {};
    var rootFiles = [];

    files.forEach(function(f) {
      var parts = f.path.split('/'); // ['docs', 'folder', 'file.md'] or ['docs', 'file.md']
      if (parts.length === 2) {
        rootFiles.push(f);
      } else {
        var folder = parts[1];
        if (!folders[folder]) folders[folder] = [];
        folders[folder].push(f);
      }
    });

    var html = '';

    // Root-level files first
    rootFiles.forEach(function(f) {
      html += '<button class="docs-nav__root-file" data-path="' + f.path + '">' + labelFromFile(f.path) + '</button>';
    });

    // Folders
    Object.keys(folders).sort().forEach(function(folder) {
      html += '<div class="docs-nav__folder is-open">';
      html += '<div class="docs-nav__folder-label"><span class="docs-nav__folder-chevron">&#9658;</span>' + labelFromFolder(folder) + '</div>';
      html += '<ul class="docs-nav__files">';
      folders[folder].forEach(function(f) {
        html += '<li><button class="docs-nav__file" data-path="' + f.path + '">' + labelFromFile(f.path) + '</button></li>';
      });
      html += '</ul></div>';
    });

    docsNav.innerHTML = html;

    docsNav.querySelectorAll('.docs-nav__folder-label').forEach(function(label) {
      label.addEventListener('click', function() {
        var folder = label.parentElement;
        folder.classList.toggle('is-open');
      });
    });

    docsNav.querySelectorAll('[data-path]').forEach(function(btn) {
      btn.addEventListener('click', function() {
        loadDocsFile(btn.dataset.path);
      });
    });
  }

  function loadDocsFile(filePath) {
    if (docsActiveFile === filePath) return;
    docsActiveFile = filePath;

    docsNav.querySelectorAll('[data-path]').forEach(function(btn) {
      btn.classList.toggle('is-active', btn.dataset.path === filePath);
    });

    docsBody.innerHTML = '<div class="docs-body__loading">Loading...</div>';

    fetch('/.netlify/functions/read-docs?action=file&path=' + encodeURIComponent(filePath) + '&token=' + encodeURIComponent(token))
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) { docsBody.innerHTML = '<p style="color:red">' + data.error + '</p>'; return; }
        loadMarked(function() {
          docsBody.innerHTML = window.marked.parse(data.content);
          // Intercept .md links — navigate within the modal instead of the browser
          docsBody.querySelectorAll('a[href]').forEach(function(a) {
            var href = a.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#')) return;
            if (!href.endsWith('.md')) return;
            a.addEventListener('click', function(e) {
              e.preventDefault();
              // Resolve relative to current doc's directory
              var base = filePath.split('/').slice(0, -1).join('/');
              var resolved = base + '/' + href.replace(/^\.\//, '');
              // Normalise any ../ segments
              var parts = resolved.split('/');
              var stack = [];
              parts.forEach(function(p) {
                if (p === '..') stack.pop();
                else if (p && p !== '.') stack.push(p);
              });
              loadDocsFile(stack.join('/'));
            });
          });
        });
      })
      .catch(function(err) {
        docsBody.innerHTML = '<p style="color:red">Failed to load: ' + err.message + '</p>';
      });
  }

  function openDocsModal() {
    docsModal.hidden = false;

    if (docsTree) return; // already loaded

    docsNav.innerHTML = '<div class="docs-nav__loading">Loading...</div>';
    docsBody.innerHTML = '<div class="docs-body__placeholder">Select a document from the sidebar.</div>';

    fetch('/.netlify/functions/read-docs?action=tree&token=' + encodeURIComponent(token))
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.error) { docsNav.innerHTML = '<div class="docs-nav__loading" style="color:red">' + data.error + '</div>'; return; }
        docsTree = data.files;
        buildDocsNav(docsTree);
        // Auto-open the first root file or first file
        var first = docsTree.find(function(f) { return f.path.split('/').length === 2; }) || docsTree[0];
        if (first) loadDocsFile(first.path);
      })
      .catch(function(err) {
        docsNav.innerHTML = '<div class="docs-nav__loading" style="color:red">Failed to load: ' + err.message + '</div>';
      });
  }

  docsBtn.addEventListener('click', openDocsModal);
  docsModalClose.addEventListener('click', function() { docsModal.hidden = true; });
  docsModal.addEventListener('click', function(e) { if (e.target === docsModal) docsModal.hidden = true; });

  // ---- Save ----
  saveBtn.addEventListener('click', function() {
    syncRelatedEntries();
    var hasPendingFileOps = Object.keys(fileOps).some(function(path) {
      return buildFileOpsList(path, fileOps[path]).length > 0;
    });
    var changeList = Object.keys(changes).map(function(path) { return changes[path]; });
    if (changeList.length === 0 && !hasPendingFileOps) return;
    saveConfirmTbody.innerHTML = buildSaveConfirmRows();
    saveConfirmModal.hidden = false;
  });

  saveConfirmBtn.addEventListener('click', doSave);
  saveConfirmCancel.addEventListener('click', function() { saveConfirmModal.hidden = true; });
  saveConfirmModal.addEventListener('click', function(e) { if (e.target === saveConfirmModal) saveConfirmModal.hidden = true; });

  // ---- Tooltips ----
  function initTooltips() {
    var tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(function(el) {
      var tooltipBox = null;

      function createTooltip() {
        if (tooltipBox) return;
        var text = el.getAttribute('data-tooltip');
        if (!text) return;
        tooltipBox = document.createElement('div');
        tooltipBox.className = 'tooltip-box';
        tooltipBox.setAttribute('role', 'tooltip');
        tooltipBox.textContent = text;
        document.body.appendChild(tooltipBox);
        positionTooltip();
      }

      function positionTooltip() {
        if (!tooltipBox) return;
        var elRect = el.getBoundingClientRect();
        var tooltipRect = tooltipBox.getBoundingClientRect();
        var viewport = { width: window.innerWidth, height: window.innerHeight };

        var placements = [
          { name: 'top', top: elRect.top - tooltipRect.height - 8, left: elRect.left + elRect.width / 2 - tooltipRect.width / 2 },
          { name: 'bottom', top: elRect.bottom + 8, left: elRect.left + elRect.width / 2 - tooltipRect.width / 2 },
          { name: 'right', top: elRect.top + elRect.height / 2 - tooltipRect.height / 2, left: elRect.right + 8 },
          { name: 'left', top: elRect.top + elRect.height / 2 - tooltipRect.height / 2, left: elRect.left - tooltipRect.width - 8 }
        ];

        var best = placements[0];
        for (var i = 0; i < placements.length; i++) {
          var p = placements[i];
          var fitsH = p.left >= 0 && p.left + tooltipRect.width <= viewport.width;
          var fitsV = p.top >= 0 && p.top + tooltipRect.height <= viewport.height;
          if (fitsH && fitsV) {
            best = p;
            break;
          }
        }
        tooltipBox.style.position = 'fixed';
        tooltipBox.style.top = Math.max(0, Math.min(best.top, viewport.height - tooltipRect.height)) + 'px';
        tooltipBox.style.left = Math.max(0, Math.min(best.left, viewport.width - tooltipRect.width)) + 'px';
      }

      function showTooltip() {
        createTooltip();
        if (tooltipBox) tooltipBox.style.display = 'block';
      }

      function hideTooltip() {
        if (tooltipBox) tooltipBox.style.display = 'none';
      }

      el.addEventListener('mouseenter', showTooltip);
      el.addEventListener('mouseleave', hideTooltip);
      el.addEventListener('focus', showTooltip);
      el.addEventListener('blur', hideTooltip);
    });
  }

  // Wait for DOM to be fully interactive before initializing tooltips
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
  } else {
    initTooltips();
  }

})();
