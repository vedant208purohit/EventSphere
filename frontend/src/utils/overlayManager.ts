let _count = 0;
let _scrollCloseCount = 0;
let _handler: EventListener | null = null;

// DEPRECATED: previously prevented background scroll. Kept for API compatibility but no-op.
export function lockScroll() {
  _count += 1;
}

export function unlockScroll() {
  _count = Math.max(0, _count - 1);
}

export function resetScrollLocks() {
  _count = 0;
}

export function getLockCount() {
  return _count;
}

export function enableScrollToClose() {
  _scrollCloseCount += 1;
  if (_scrollCloseCount === 1 && typeof window !== 'undefined') {
    _handler = () => {
      // allow the scroll to continue; just broadcast close
      window.dispatchEvent(new CustomEvent('close-all-overlays'));
    };
    // listen to wheel (desktop) and touchmove (mobile)
    window.addEventListener('wheel', _handler as EventListener, { passive: true });
    window.addEventListener('touchmove', _handler as EventListener, { passive: true });
  }
}

export function disableScrollToClose() {
  _scrollCloseCount = Math.max(0, _scrollCloseCount - 1);
  if (_scrollCloseCount === 0 && typeof window !== 'undefined' && _handler) {
    window.removeEventListener('wheel', _handler as EventListener);
    window.removeEventListener('touchmove', _handler as EventListener);
    _handler = null;
  }
}

export function resetScrollToClose() {
  _scrollCloseCount = 0;
  if (typeof window !== 'undefined' && _handler) {
    window.removeEventListener('wheel', _handler as EventListener);
    window.removeEventListener('touchmove', _handler as EventListener);
    _handler = null;
  }
}
