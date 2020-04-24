export class Module {
  constructor(tagName, modules, store) {
    this.tagName = tagName;
    this.modules = modules;
    this.store = store;
  }

  connect(Classe, useFetch) {
    const self = this;
    return class extends Classe {
      connectedCallback() {
        super.connectedCallback();
        const render = () => {
          if (this.unsubscribe) {
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
        delete this.unsubscribe;
      }
    }
  }

  setupDependencies(Classe) {
    if (!Classe.dependencies) {
      return;
    }
    for (const tagName of Classe.dependencies) {
      this.modules[tagName].setup();
    }
  }

  async setup() {
    if (customElements.get(this.tagName)) {
      return;
    }
    const Classe = await this.setupElement();
    const useSelect = Module.prototype.select !== this.select;
    const useFetchData = Module.prototype.fetchData !== this.fetchData;
    const PreparedClass = useSelect? this.connect(Classe, useFetchData): Classe;
    customElements.define(this.tagName, PreparedClass);
    this.setupDependencies(PreparedClass);
  }

  fetchData(state, dispatch) {
    // Do nothing
  }

  select() {
    return {};
  }
}

export class ModuleDepot {
  constructor(store) {
    this.store = store;
    this.modules = {};
  }

  add(dict) {
    for (const [tagName, Classe] of Object.entries(dict)) {
      this.modules[tagName] = new Classe(tagName, this.modules, this.store);
    }
  }

  render(appRoot) {
    const { view: tagName } = this.store.getState();
    this.modules[tagName].setup();
  
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