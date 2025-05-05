import Render from './render.js';
class GameRender {
  /**
   * GameRender 类的构造函数，用于初始化游戏渲染所需的数据和容器
   * @param {HTMLElement} container - 游戏渲染的容器元素
   * @param {Array} wordList - 包含单词和对应翻译的原始数据列表
   */
  constructor(container, wordList) {
    // 处理原始单词列表，为每个单词和翻译添加索引，方便后续匹配和操作
    this.wordList = wordList.map((wordData, index) => {
      return {
        // 包含单词值和对应索引的对象
        word: {
          value: wordData.word,
          index,
        },
        // 包含翻译值和对应索引的对象
        translation: {
          value: wordData.translation,
          index,
        }
      }
    })
    // 检查本地存储中是否存在随机单词列表
    if (!localStorage.getItem('randomWordList')) {
      // 若不存在，则从完整单词列表中随机选取 10 个单词作为本次游戏的随机单词列表
      this.randomWordList = [...this.wordList].sort(() => Math.random() - 0.5).splice(0, 10);
      // 将随机选取的单词列表存储到本地存储中
      localStorage.setItem('randomWordList', JSON.stringify(this.randomWordList));
    } else {
      // 若本地存储中已存在随机单词列表，则从本地存储中获取
      this.randomWordList = JSON.parse(localStorage.getItem('randomWordList'));
    }
    // 保存游戏渲染的容器元素
    this.container = container;
  }
  modifyWordList(wordList) {
    // 处理原始单词列表，为每个单词和翻译添加索引，方便后续匹配和操作
    this.wordList = wordList.map((wordData, index) => {
      return {
        // 包含单词值和对应索引的对象
        word: {
          value: wordData.word,
          index,
        },
        // 包含翻译值和对应索引的对象
        translation: {
          value: wordData.translation,
          index,
        }
      }
    })
    // 检查本地存储中是否存在随机单词列表
    if (!localStorage.getItem('randomWordList')) {
      // 若不存在，则从完整单词列表中随机选取 10 个单词作为本次游戏的随机单词列表
      this.randomWordList = [...this.wordList].sort(() => Math.random() - 0.5).splice(0, 10);
      // 将随机选取的单词列表存储到本地存储中
      localStorage.setItem('randomWordList', JSON.stringify(this.randomWordList));
    } else {
      // 若本地存储中已存在随机单词列表，则从本地存储中获取
      this.randomWordList = JSON.parse(localStorage.getItem('randomWordList'));
    }
  }
  /**
   * 获取左侧卡片容器元素
   * @returns {HTMLElement} 左侧卡片容器元素
   */
  get left() {
    return document.querySelector('.left');
  }

  /**
   * 获取右侧卡片容器元素
   * @returns {HTMLElement} 右侧卡片容器元素
   */
  get right() {
    return document.querySelector('.right');
  }

  /**
   * 获取游戏渲染配置对象
   * 该配置数据从rightChildren和leftChildren方法获取
   * @returns {Object} 包含左右两侧卡片容器配置的对象
   */
  config(left, right) {
    const config = {
      children: [
        {
          tag: 'div',
          classList: ['left'],
          children: [],
        },
        {
          tag: 'div',
          classList: ['right'],
          children: [],
        },
      ]
    }
    config.children[0].children = this.leftWordChildren;
    config.children[1].children = this.rightWordChildren;
    return config;
  }

  /**
   * 获取左侧卡片容器的子元素配置数组
   * 该方法从localStorage中获取用户的结果数据，如果不存在则从randomWordList中获取
   * @returns {Array} 包含左侧卡片元素配置的数组
   */
  get leftWordChildren() {
    let left;
    if (localStorage.getItem('userResult')) {
      const userResult = JSON.parse(localStorage.getItem('userResult'));
      left = userResult.map(data => data.word);
    }
    else {
      left = this.randomWordList.map(wordData => wordData.word);
    }
    const children = left.map(wordData => {
      return {
        tag: 'div',
        classList: ['card'],
        children: [
          {
            tag: 'div',
            classList: ['card-word'],
            dataList: [
              { key: 'data-index', value: wordData.index },
            ],
            text: wordData.value,
          }
        ],
      }
    })
    return children;
  }

  /**
   * 获取右侧卡片容器的子元素配置数组
   * 该方法从localStorage中获取用户的结果数据，如果不存在则从randomWordList中获取
   * 从randomWordList中获取时，会对翻译进行初始随机排序
   * @returns {Array} 包含右侧卡片元素配置的数组
   */
  get rightWordChildren() {
    let right;
    if (localStorage.getItem('userResult')) {
      const userResult = JSON.parse(localStorage.getItem('userResult'));
      right = userResult.map(data => data.translation);
    }
    else {
      right = this.randomWordList.map(wordData => wordData.translation).sort(() => Math.random() - 0.5);
    }
    const children = right.map(translation => {
      return {
        tag: 'div',
        classList: ['card'],
        children: [
          {
            tag: 'div',
            classList: ['card-translation'],
            dataList: [
              { key: 'data-index', value: translation.index },
            ],
            text: translation.value,
          }
        ]
      }
    })
    return children;
  }

  /**
   * 渲染游戏界面，清空容器并重新渲染左右两侧卡片，同时初始化拖拽功能
   * 渲染数据从 config 属性中获取，config 属性是一个包含左右两侧卡片容器配置的对象
   */
  renderWords() {
    this.container.innerHTML = '';
    Render.render(this.container, this.config(this.leftWordChildren, this.rightWordChildren));
    Render.dragHandle(this.left, { vertical: true, duration: 1000 });
    Render.dragHandle(this.right, { vertical: true, duration: 1000 });
    return;
  }

  /**
   * 保存用户当前排列的单词和翻译结果到本地存储
   */
  saveUserResult() {
    let userResult = [];
    const left = this.left;
    const right = this.right;
    let rightMap = Array.from(right.querySelectorAll('.card')).map(card => {
      const index = card.querySelector('.card-translation').dataset.index;
      const value = card.querySelector('.card-translation').innerText;
      return { index, value };
    });
    let leftMap = Array.from(left.querySelectorAll('.card')).map(card => {
      const index = card.querySelector('.card-word').dataset.index;
      const value = card.querySelector('.card-word').innerText;
      return { index, value };
    })
    rightMap.forEach((rightData, index) => {
      const leftData = leftMap[index];
      userResult.push({
        word: leftData,
        translation: rightData,
      })
    })
    localStorage.setItem('userResult', JSON.stringify(userResult));
  }

  /**
   * 打乱当前单词和翻译的排列顺序，并保存到本地存储，然后重新渲染界面
   */
  messUp() {
    let userResult;
    // 如果本地存储中没有 userResult，则使用随机单词列表作为初始用户结果
    if (!localStorage.getItem('userResult')) {
      userResult = this.randomWordList;
    }
    else {
      userResult = JSON.parse(localStorage.getItem('userResult'));
    }
    // 打乱用户结果的单词和翻译顺序
    let messUpUserResult = [];
    const randomWordList = [...userResult].map(data => data.word).sort(() => Math.random() - 0.5);
    const randomTranslationList = [...userResult].map(data => data.translation).sort(() => Math.random() - 0.5);
    // 将打乱后的单词和翻译组合成新的用户结果数组，并保存到本地存储中
    for (let i = 0; i < randomWordList.length; i++) {
      messUpUserResult.push({
        word: randomWordList[i],
        translation: randomTranslationList[i],
      })
    }
    localStorage.setItem('userResult', JSON.stringify(messUpUserResult));
    this.renderWords();
  }

  /**
   * 更新单词组，从完整单词列表中重新随机选取 10 个单词，清除用户结果并重新渲染界面
   */
  changeWordsGroup() {
    this.randomWordList = [...this.wordList].sort(() => Math.random() - 0.5).splice(0, 10);
    localStorage.setItem('randomWordList', JSON.stringify(this.randomWordList));
    localStorage.removeItem('userResult');
    this.renderWords();
  }

  /**
   * 检查用户当前排列的结果是否正确，保存结果并调用渲染方法显示检查结果,并保存到本地存储中
   */
  checkResult() {
    //保存用户当前排列的单词和翻译结果到本地存储
    this.saveUserResult();
    const userResult = JSON.parse(localStorage.getItem('userResult'));
    const leftMap = userResult.map(data => data.word);
    const rightMap = userResult.map(data => data.translation);
    let result = [];
    for (let i = 0; i < leftMap.length; i++) {
      if (leftMap[i].index === rightMap[i].index) {
        result.push(i)
      }
    }
    this.checkRender(result);
  }

  /**
   * 根据检查结果渲染卡片的状态（正确或错误）
   * @param {Array<number>} result - 包含正确匹配索引的数组
   */
  checkRender(result) {
    // 获取左侧和右侧的容器元素
    const left = this.left;
    const right = this.right;
    // 将左侧和右侧容器内的所有卡片元素转换为数组
    const leftMap = Array.from(left.querySelectorAll('.card'))
    const rightMap = Array.from(right.querySelectorAll('.card'));

    // 移除所有卡片上的 'correct' 类和 'error' 类，重置卡片状态
    leftMap.forEach(card => {
      card.classList.remove('correct');
      card.classList.remove('error');
    })
    rightMap.forEach(card => {
      card.classList.remove('correct');
      card.classList.remove('error');
    })

    // 为正确匹配的卡片添加 'correct' 类
    result.forEach(index => {
      leftMap[index].classList.add('correct');
      rightMap[index].classList.add('correct');
    })

    // 为未正确匹配的卡片添加 'error' 类
    for (let i = 0; i < leftMap.length; i++) {
      if (!result.includes(i)) {
        leftMap[i].classList.add('error');
        rightMap[i].classList.add('error');
      }
    }
  }
  static removeLocalStorage() {
    localStorage.removeItem('userResult');
    localStorage.removeItem('randomWordList');
  }
  static removeColor() {
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const leftMap = Array.from(left.querySelectorAll('.card'));
    const rightMap = Array.from(right.querySelectorAll('.card'));
    leftMap.forEach(card => {
      card.classList.remove('correct');
      card.classList.remove('error');
    })
    rightMap.forEach(card => {
      card.classList.remove('correct');
      card.classList.remove('error');
    })
  }
}
export default GameRender;