import Dragger from "./dragger.js";
class Render {
  static render(container, config = {}) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          Render.render(element, child);
        }
        container.appendChild(element);
      })
    }
  }
  static dragHandle(container, config = { vertical: true, duration: 1000 }) {
    if (container instanceof Array) return container.forEach(Render.dragHandle)
    const dragHandle = new Dragger(container);
    dragHandle.soomthDrag(config);
  }
  static dataToConfig(data, callback) {
    return callback(data);
  }
  constructor(container, config = {}) {
    this.container = container;
    this.config = config;
    this.init();
  }
  init() {
    this.render(this.container, this.config);
  }
  dataToConfig(data, callback) {
    this.config = callback(data);
  }
  render(container, config = {}) {
    if (config.children) {
      config.children.forEach((child) => {
        const element = document.createElement(child.tag);
        if (child.classList) {
          element.classList.add(...child.classList);
        }
        if (child.dataList) {
          child.dataList.forEach((item) => {
            element.setAttribute(item.key, item.value);
          })
        }
        if (child.text) {
          element.textContent = child.text;
        }
        if (child.children) {
          this.render(element, child);
        }
        container.appendChild(element);
      })
    }
  }
}
export default Render;