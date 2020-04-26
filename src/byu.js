export class Module {
  constructor(tagName, modules, store, callbacks) {
    this.tagName = tagName;
    this.modules = modules;
    this.store = store;
    this.callbacks = callbacks;
  }

  connect(Classe, useConnect, useFetch) {
    const self = this;
    return class extends Classe {
      firstUpdated() {
        super.firstUpdated();
        const elements = this.shadowRoot.querySelectorAll("*");
        for (const element of elements) {
          if (element.tagName.includes('-')) {
            const module = self.modules[element.tagName.toLowerCase()];
            if (module) {
              module.setup();
            }
          }
        }
      }
      connectedCallback() {
        super.connectedCallback();
        if (useConnect) {
          const render = () => {
            if (this.unsubscribe) {
              this.model = self.callbacks.select(self.store.getState());
            }
          };
          this.unsubscribe = self.store.subscribe(render);
          render();
          if (useFetch) {
            self.callbacks.fetchData(self.store.getState(), self.store.dispatch);
          }
        }
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        if (useConnect) {
          this.unsubscribe();
          delete this.unsubscribe;
        }
      }
    }
  }

  async setup() {
    if (customElements.get(this.tagName)) {
      return;
    }
    const Classe = await this.callbacks.setupElement();
    const useSelect = this.callbacks.select;
    const useFetchData = this.callbacks.fetchData;
    const PreparedClass = this.connect(Classe, useSelect, useFetchData);
    customElements.define(this.tagName, PreparedClass);
  }

  fetchData(state, dispatch) {
    // Do nothing
  }

  select() {
    return {};
  }
}

export class Byu {
  constructor(store) {
    this.store = store;
    this.modules = {};
  }

  register(dict) {
    for (const [tagName, callbacks] of Object.entries(dict)) {
      this.modules[tagName] = new Module(tagName, this.modules, this.store, callbacks);
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