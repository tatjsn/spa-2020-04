export class Module {
  constructor(modules, store) {
    this.modules = modules;
    this.store = store;
  }

  connect(Classe, useFetch) {
    const self = this;
    return class extends Classe {
      connectedCallback() {
        super.connectedCallback();
        const render = () => {
          if (!this.didUnsubscribe) {
            this.model = self.select(self.store.getState());
          }
        };
        this.unsubscribe = self.store.subscribe(render);
        render();
        if (useFetch) {
          self.fetchData(self.store.getState(), self.store.dispatch);
        }
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.unsubscribe();
        this.didUnsubscribe = true;
      }
    }
  }

  setupDependencies(Classe) {
    if (!Classe.dependencies) {
      return;
    }
    for (const dep of Classe.dependencies) {
      const name = dep.slice(4);
      this.modules[name].setup();
    }
  }

  async setup() {
    const [tagName, Classe] = await this.setupElement();
    Classe.module = this;
    customElements.define(tagName, Classe);
    this.setupDependencies(Classe);
  }

  fetchData(state, dispatch) {
    // Do nothing
  }

  select() {
    return {};
  }
}

export class ModuleStore {
  constructor(store) {
    this.store = store;
    this.modules = {};
  }

  add(dict) {
    for (const [name, Classe] of Object.entries(dict)) {
      this.modules[name] = new Classe(this.modules, this.store);
    }
  }

  render(appRoot) {
    const { view } = this.store.getState();
    const tagName = `app-${view}`;
    if (!customElements.get(tagName)) {
      this.modules[view].setup();
    }
  
    const prevView = appRoot.firstChild;
  
    if (!prevView.tagName || prevView.tagName.toLowerCase() !== tagName) {
      const element = document.createElement(tagName);
      while (appRoot.firstChild) {
        appRoot.removeChild(appRoot.firstChild);
      }
      appRoot.appendChild(element);
    }
  }
}