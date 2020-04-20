export function fromAction(action) {
  return new CustomEvent('action', {
    detail: action,
    bubbles: true,
    composed: true,
  });
}

export function fromRequire(name, hostNode) {
  const host = hostNode.tagName.toLowerCase();
  return new CustomEvent('require', {
    detail: { name, host },
    bubbles: true,
    composed: true,
  });
}