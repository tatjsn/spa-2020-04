export async function render(appRoot, modules, state) {
  const { view } = state;
  const tagName = `app-${view}`;
  if (!customElements.get(tagName)) {
    modules[view].setupElement();
  }

  const prevView = appRoot.firstChild;

  if (!prevView.tagName || prevView.tagName.toLowerCase() !== tagName) {
    const element = document.createElement(tagName);
    while (appRoot.firstChild) {
      appRoot.removeChild(appRoot.firstChild);
    }
    appRoot.appendChild(element);
  }

  const element = appRoot.firstChild;
  const model = modules[view].select(state);
  if (!model.deps) {
    model.deps = {};
  }
  element.model = model;
}
