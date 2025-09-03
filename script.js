window.addEventListener('DOMContentLoaded', function () {
    var mv = document.querySelector('model-viewer.earth-model');
    if (!mv) return;
    function disableInteractionOnce(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      mv.removeAttribute('camera-controls');
      mv.setAttribute('auto-rotate', '');
      mv.setAttribute('interaction-prompt', 'none');
      mv.style.touchAction = 'none';
    }
    mv.addEventListener('pointerdown', disableInteractionOnce, { once: true, passive: false });
    mv.addEventListener('touchstart', disableInteractionOnce, { once: true, passive: false });
  })