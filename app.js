/* --- TOP NAVIGATION BAR DROPDOWN & MOBILE DRAWER LOGIC --- */
function toggleTopDropdown(btnElement) {
  const group = btnElement.closest('.top-nav-dropdown-group');
  if (!group) return;

  const isActive = group.classList.contains('active');
  // Close other open dropdowns
  document.querySelectorAll('.top-nav-dropdown-group').forEach(g => g.classList.remove('active'));

  if (!isActive) {
    group.classList.add('active');
  }
}

function toggleMobileTopMenu(forceState) {
  const menu = document.getElementById('topNavMenu');
  const overlay = document.getElementById('sidebarOverlay');
  if (!menu) return;

  const isActive = forceState !== undefined ? forceState : !menu.classList.contains('mobile-show');
  if (isActive) {
    menu.classList.add('mobile-show');
    if (overlay) overlay.classList.add('active');
  } else {
    menu.classList.remove('mobile-show');
    if (overlay) overlay.classList.remove('active');
  }
}

/* --- QUICK SEARCH FILTER FOR TOP NAV CATEGORIES & LINKS --- */
function filterTopNav(query) {
  const term = query.toLowerCase().trim();
  const groups = document.querySelectorAll('.top-nav-dropdown-group');

  groups.forEach(group => {
    const btn = group.querySelector('.top-nav-btn');
    const links = group.querySelectorAll('.top-dropdown-link');
    let hasMatch = false;

    if (!term) {
      group.style.display = '';
      links.forEach(l => l.style.display = '');
      return;
    }

    if (btn && btn.textContent.toLowerCase().includes(term)) {
      hasMatch = true;
    }

    links.forEach(link => {
      const match = link.textContent.toLowerCase().includes(term);
      link.style.display = match ? 'flex' : 'none';
      if (match) hasMatch = true;
    });

    group.style.display = hasMatch ? 'inline-block' : 'none';
    if (hasMatch) {
      group.classList.add('active');
    } else {
      group.classList.remove('active');
    }
  });
}

// Close top dropdowns when clicking outside
window.addEventListener('click', function(e) {
  if (!e.target.closest('.top-nav-dropdown-group')) {
    document.querySelectorAll('.top-nav-dropdown-group').forEach(g => g.classList.remove('active'));
  }
  if (!e.target.closest('.dropdown-container')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
  }
});
