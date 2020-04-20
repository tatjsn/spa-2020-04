export function fromAction(action) {
  return new CustomEvent('action', {
    detail: action,
    bubbles: true,
    composed: true,
  });
}

export function fromRequire(name) {
  return new CustomEvent('require', {
    detail: name,
    bubbles: true,
    composed: true,
  });
}