class FLIP {
  constructor({ elementList, duration = 1000 }) {
    this.elemList = elementList;
    this.elemArray = Array.from(elementList);
    this.duration = duration;
  }
  updateElementList(elementList) {
    this.elemArray = Array.from(elementList);
  }
  get start() {
    return this.elemArray.map(elem => elem.getBoundingClientRect())
  }
  get end() {
    return this.elemArray.map(elem => elem.getBoundingClientRect())
  }
  /**
   * 播放 FLIP 动画，通过计算元素位置变化并应用过渡效果实现平滑动画。
   * @param {Function} callback - 用于更新元素位置的回调函数，在获取起始位置后执行。
   * @param {number} [duration=this.duration] - 动画持续时间，默认为构造函数中设置的 duration。
   */
  play(callback, duration = this.duration) {
    // 获取每个元素的起始位置
    const start = this.start;
    // 执行回调函数，更新元素的位置
    callback();
    // 获取每个元素更新位置后的最终位置
    const end = this.end;
    // 遍历每个元素，为其应用 FLIP 动画
    this.elemArray.forEach((elem, i) => {
      // 计算元素从起始位置到最终位置的水平和垂直偏移量
      const diff = {
        x: end[i].x - start[i].x,
        y: end[i].y - start[i].y,
      }
      // 如果元素没有发生位置变化，则跳过动画
      if (diff.x === 0 && diff.y === 0) {
        return;
      }

      // 将元素暂时移动到起始位置
      elem.style.transform = `translate(${-diff.x}px, ${-diff.y}px)`;
      // 清除之前的过渡效果，确保位置立即更新
      elem.style.transition = '';
      // 在下一帧中开始动画
      requestAnimationFrame(() => {
        // 设置过渡效果，指定动画持续时间
        elem.style.transition = `transform ${duration}ms`;
        // 移除临时的位置偏移，让元素平滑过渡到最终位置
        elem.style.transform = '';
      })
    })
  }
}
export default FLIP;