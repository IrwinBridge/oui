import components from './components';

const plugin = {
  install(Vue) {
    Object.keys(components).forEach((prop) => {
      if (Object.prototype.hasOwnProperty.call(components, prop)) {
        const component = components[prop];
        Vue.component(component.name, component);
      }
    });
  },
};

export default plugin;
