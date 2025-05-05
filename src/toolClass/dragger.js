import FLIP from "./flip.js";
class Dragger {
  constructor(container, FLIPObj) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("传入的参数必须为一个元素节点");
    }
    this.container = container;
    this.FLIP = FLIPObj || new FLIP({
      duration: 1000,
      elementList: container.children
    });
  }
  allDropable(container = this.container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error("传入的参数必须为一个元素节点");
    }
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
    });
    this.dropable = true;
    return this;
  }
  childrenDragable() {
    if (!(this.container instanceof HTMLElement)) {
      throw new Error("传入的参数必须为一个元素节点");
    }
    const children = Array.from(this.container.children);
    children.forEach((child) => {
      child.style.cursor = "grab";
      child.setAttribute("draggable", true);
    });
    this.container.addEventListener("dragstart", (e) => {
      setTimeout(() => {
        e.target.style.visibility = "hidden";
      }, 0);
      this.draggingNode = {
        node: e.target,
        index: children.indexOf(e.target),
      }
      this.dragStart = {
        x: e.pageX,
        y: e.pageY,
      }
    });
    this.container.addEventListener("dragend", (e) => {
      e.target.style.visibility = "visible";
      e.target.style.transition = '';
      this.draggingNode = null;
    });
    this.dragable = true;
    return this;
  }
  /**
   * 实现平滑拖拽排序功能
   * @param {Object} options - 配置对象
   * @param {boolean} [options.vertical=true] - 是否为垂直方向拖拽
   * @param {number} [options.duration=1500] - 动画持续时间(毫秒)
   * @returns {Object} 返回实例自身以支持链式调用
   */
  soomthDrag(config = { vertical: true, duration: 1500 }) {

    const children = Array.from(this.container.children);
    // 按需初始化拖放功能
    !this.dragable && this.childrenDragable();
    !this.dropable && this.allDropable();

    // 核心拖拽事件处理器
    const handleDragEnter = (e) => {
      // 过滤无效触发条件
      let target = e.target;

      if (e.target === this.draggingNode) return;
      //如果不是子元素则向上查找, 直到找到子元素为止或者到达容器边界
      while (target) {
        if (children.includes(target)) {
          break;
        }
        target = target.parentNode;
      }
      if (!children.includes(target)) {
        return;
      }
      // 计算相对位移
      const mousePoint = { x: e.pageX, y: e.pageY };
      const relativePos = config.vertical ? mousePoint.y - this.dragStart.y : mousePoint.x - this.dragStart.x;
      // 通过位移阈值实现防抖功能
      if (Math.abs(relativePos) < 3) return;

      // 执行FLIP动画并更新节点位置
      this.FLIP.play(() => {
        config.vertical ? this.dragStart.y = mousePoint.y : this.dragStart.x = mousePoint.x;
        const method = relativePos > 0 ? 'after' : 'before';
        target[method](this.draggingNode.node);
      }, config.duration);
    };
    this.container.addEventListener('dragenter', handleDragEnter)
    return this;
  }
}
export default Dragger;