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
    // 初始化子元素信息存储数组
    this.childrenInfoList = [];
    const children = Array.from(this.container.children);

    // 按需初始化拖放功能
    !this.dragable && this.childrenDragable();
    !this.dropable && this.allDropable();

    // 核心拖拽事件处理器
    const handleDragEnter = (e) => {
      let target = e.target;
      // 过滤无效触发条件
      if (!this.childrenInfoList.length || e.target === this.draggingNode) return;
      //如果不是子元素则向上查找, 直到找到子元素为止或者到达容器边界
      while (target) {
        if (children.includes(target)) {
          break;
        }
        target = target.parentNode;
      }
      // 计算相对位移
      const mousePoint = { x: e.pageX, y: e.pageY };
      const relativePos = config.vertical ? mousePoint.y - this.dragStart.y : mousePoint.x - this.dragStart.x;
      // 执行FLIP动画并更新节点位置
      this.FLIP.play(() => {
        config.vertical ? this.dragStart.y = mousePoint.y : this.dragStart.x = mousePoint.x;
        const method = relativePos > 0 ? 'after' : 'before';
        target[method](this.draggingNode.node);
      }, config.duration);
    };

    // 初始化子元素布局信息
    children.forEach((child, index) => {
      // 计算元素中心点坐标
      const { offsetLeft: x, offsetTop: y, offsetWidth: width, offsetHeight: height } = child;
      this.childrenInfoList.push({
        node: child,
        index,
        middlePoint: { x: x + width / 2, y: y + height / 2 }
      });

      // 注册拖拽事件监听器
      child.addEventListener('dragenter', handleDragEnter);
    });
    return this;
  }
}
export default Dragger;