class Module {
  constructor(tagName, modules, callbacks) {
    this.tagName = tagName;
    this.modules = modules;
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
            if (this.unsubscribe) { // Guard if already unsubscribed
              this.model = self.callbacks.select();
            }
          };
          this.unsubscribe = self.callbacks.subscribe(render);
          render();
          if (useFetch) {
            self.callbacks.fetchData();
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
}

export class Byu {
  constructor() {
    this.modules = {};
  }

  register(dict) {
    for (const [tagName, callbacks] of Object.entries(dict)) {
      this.modules[tagName] = new Module(tagName, this.modules, callbacks);
    }
  }

  render(appRoot, tagName) {
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

export function withRedux(store, dict) {
  const product = {};
  for (const [tagName, callbacks] of Object.entries(dict)) {
    const cbs = {};
    cbs.subscribe = store.subscribe;
    cbs.setupElement = callbacks.setupElement;
    if (callbacks.fetchData) {
      cbs.fetchData = function () {
        callbacks.fetchData(store.getState(), store.dispatch);
      }
    }
    if (callbacks.select) {
      cbs.select = function () {
        return callbacks.select(store.getState());
      }
    }
    product[tagName] = cbs;
  }
  return product;
}