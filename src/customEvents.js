export function fromAction(action) {
  return new CustomEvent('action', {
    detail: action,
    bubbles: true,
    composed: true,
  });
}
