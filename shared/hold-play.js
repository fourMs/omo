/**
 * Play while any pointer is down on a zone (whole screen), without pointer capture.
 */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * @param {HTMLElement} zone
 * @param {{ ignore?: string, onStart?: (e: PointerEvent) => void | Promise<void>, onMove?: (e: PointerEvent) => void, onEnd?: (e: PointerEvent) => void }} handlers
 */
export function wireScreenHold(zone, { ignore = ".back-link, #learnBtn", onStart, onMove, onEnd } = {}) {
  const pointers = new Set();
  let primaryId = null;

  function ignored(e) {
    return ignore && e.target instanceof Element && !!e.target.closest(ignore);
  }

  function isHolding() {
    return pointers.size > 0;
  }

  function primaryEvent(e) {
    return primaryId == null || e.pointerId === primaryId;
  }

  function onPointerDown(e) {
    if (ignored(e)) return;
    const wasEmpty = pointers.size === 0;
    pointers.add(e.pointerId);
    if (wasEmpty) {
      primaryId = e.pointerId;
      void onStart?.(e);
    }
  }

  function onPointerMove(e) {
    if (!pointers.has(e.pointerId)) return;
    if (onMove && primaryEvent(e)) onMove(e);
  }

  function onPointerUp(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      onEnd?.(e);
      primaryId = null;
    } else if (e.pointerId === primaryId) {
      primaryId = pointers.values().next().value ?? null;
    }
  }

  zone.addEventListener("pointerdown", onPointerDown, { passive: false });
  zone.addEventListener("pointermove", onPointerMove);
  zone.addEventListener("pointerup", onPointerUp);
  zone.addEventListener("pointercancel", onPointerUp);

  return { isHolding };
}

export { clamp };
