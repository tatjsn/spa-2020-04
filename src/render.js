export async function render(modules, state, dispatch) {
  const { view } = state;
  const tagName = `app-${view}`;
  if (!customElements.get(tagName)) {
    await modules[view].setupElement();
  }

  const appRoot = document.getElementById('app');
  const prevView = appRoot.firstChild;

  if (!prevView.tagName || prevView.tagName.toLowerCase() !== tagName) {
    const element = document.createElement(tagName);
    element.dispatch = dispatch;
    while (appRoot.firstChild) {
      appRoot.removeChild(appRoot.firstChild);
    }
    appRoot.appendChild(element);

    modules[view].fetchData(state, dispatch);
  }

  const element = appRoot.firstChild;
  element.model = modules[view].select(state);
}
