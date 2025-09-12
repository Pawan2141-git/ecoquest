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
    
    if (level === maxUnlocked) {
      item.classList.add('current');
    }

    var next = items[idx + 1];
    if (next) {
      var getPos = function (el) {
        var styles = window.getComputedStyle(el);
        var x = parseFloat(styles.getPropertyValue('--x'));
        var y = parseFloat(styles.getPropertyValue('--y'));
        return { x: x, y: y };
      };
      var a = getPos(item);
      var b = getPos(next);
      if (!isNaN(a.x) && !isNaN(a.y) && !isNaN(b.x) && !isNaN(b.y)) {
        var dx = b.x - a.x;
        var dy = b.y - a.y;
        var len = Math.sqrt(Math.pow(dx * window.innerWidth / 100, 2) + Math.pow(dy * window.innerHeight / 100, 2));
        var angle = Math.atan2((dy * window.innerHeight / 100), (dx * window.innerWidth / 100)) * 180 / Math.PI;
        item.style.setProperty('--len', Math.max(120, Math.min(500, len)) + 'px');
        item.style.setProperty('--angle', angle + 'deg');
        
        var droplet1 = document.createElement('div');
        droplet1.className = 'water-droplet';
        droplet1.style.transform = 'translateY(-50%) rotate(' + angle + 'deg)';
        item.appendChild(droplet1);
        
        var droplet2 = document.createElement('div');
        droplet2.className = 'water-droplet';
        droplet2.style.transform = 'translateY(-50%) rotate(' + angle + 'deg)';
        item.appendChild(droplet2);
      }
    }
  });

  // Clicking the Start button on the current level
  path.addEventListener('click', function (e) {
    var btn = e.target.closest('.Start-btn');
    if (!btn) return;

    var li = btn.closest('.level');
    if (!li || li.classList.contains('locked')) return;

    var current = parseInt(li.getAttribute('data-level') || '0', 10);
    var next = current + 1;

    
    if (next > maxUnlocked) {
      maxUnlocked = next;
      localStorage.setItem(STORAGE_KEY, String(maxUnlocked));

      var nextLi = path.querySelector('.level[data-level="' + next + '"]');
      if (nextLi) {
        nextLi.classList.remove('locked');
        var nextBtn = nextLi.querySelector('.island');
        if (nextBtn) nextBtn.removeAttribute('aria-disabled');

        document.querySelectorAll('.level.current').forEach(function (el) {
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
