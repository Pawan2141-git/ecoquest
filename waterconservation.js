// Simple level lock/unlock using localStorage
(function () {
  var STORAGE_KEY = 'wc_progress_level';
  var maxUnlocked = parseInt(localStorage.getItem(STORAGE_KEY) || '1', 10);
  if (isNaN(maxUnlocked) || maxUnlocked < 1) maxUnlocked = 1;

  var path = document.getElementById('levelPath');
  if (!path) return;

  var items = Array.prototype.slice.call(path.querySelectorAll('.level'));
  items.forEach(function (item, idx) {
    var level = parseInt(item.getAttribute('data-level') || '0', 10);
    if (level > maxUnlocked) {
      item.classList.add('locked');
      item.querySelector('.island').setAttribute('aria-disabled', 'true');
    }
    
    // Mark the highest unlocked level as current
    if (level === maxUnlocked) {
      item.classList.add('current');
    }

    // For horizontal layout, we don't need to compute vectors
    // Just add connector elements for the horizontal layout
    var next = items[idx + 1];
    if (next) {
      // Add horizontal connector with fixed width
      var connector = document.createElement('div');
      connector.className = 'horizontal-connector';
      if (level <= maxUnlocked) {
        connector.classList.add('completed');
      }
      item.appendChild(connector);
      
      // Add water droplet elements with horizontal positioning
      var droplet1 = document.createElement('div');
      droplet1.className = 'water-droplet';
      // Set style for horizontal layout
      droplet1.style.transform = 'translateY(-50%)';
      item.appendChild(droplet1);
      
      var droplet2 = document.createElement('div');
      droplet2.className = 'water-droplet';
      // Set style for horizontal layout
      droplet2.style.transform = 'translateY(-50%)';
      item.appendChild(droplet2);
    }
  });

  // Clicking an unlocked level: simulate completion and unlock next level
  path.addEventListener('click', function (e) {
    var btn = e.target.closest('.island');
    if (!btn) return;
    var li = btn.closest('.level');
    if (!li || li.classList.contains('locked')) return;

    var current = parseInt(li.getAttribute('data-level') || '0', 10);
    var next = current + 1;
    if (next > maxUnlocked) {
      maxUnlocked = next;
      localStorage.setItem(STORAGE_KEY, String(maxUnlocked));
      // unlock next li if exists
      var nextLi = path.querySelector('.level[data-level="' + next + '"]');
      if (nextLi) {
        nextLi.classList.remove('locked');
        var nextBtn = nextLi.querySelector('.island');
        if (nextBtn) nextBtn.removeAttribute('aria-disabled');
        
        // Update current level highlight
        document.querySelectorAll('.level.current').forEach(function(el) {
          el.classList.remove('current');
        });
        nextLi.classList.add('current');
      }
    }
  });

  // Reset control
  var resetBtn = document.getElementById('resetProgress');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      localStorage.setItem(STORAGE_KEY, '1');
      location.reload();
    });
  }
})();


