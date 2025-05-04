import wordList from "./getData.js";
import Dragger from "./dragger.js";
class GameRender {
  constructor(container, wordList) {
    this.wordList = wordList.map((wordData, index) => {
      return {
        word: {
          value: wordData.word,
          index,
        },
        translation: {
          value: wordData.translation,
          index,
        }
      }
    })
    if (!localStorage.getItem('randomWordList')) {
      this.randomWordList = [...this.wordList].sort(() => Math.random() - 0.5).splice(0, 10);
      localStorage.setItem('randomWordList', JSON.stringify(this.randomWordList));
    } else {
      this.randomWordList = JSON.parse(localStorage.getItem('randomWordList'));
    }

    this.container = container;
  }
  createWordCard(index, word) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-word" data-index="${index}">${word}</div>
    `;
    return card;
  }
  createTranslationCard(index, translation) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
      <div class="card-translation" data-index="${index}">${translation}</div>
    `;
    return card;
  }
  render(wordList = this.randomWordList) {
    let leftList, rightList;
    if (!localStorage.getItem('userResult')) {
      leftList = wordList.map(wordData => wordData.word);
      rightList = [...wordList].sort(() => Math.random() - 0.5).map(wordData => wordData.translation);
      let userResult = [];
      for (let i = 0; i < leftList.length; i++) {
        userResult.push({
          word: leftList[i],
          translation: rightList[i],
        })
      }
      localStorage.setItem('userResult', JSON.stringify(userResult));
    }
    else {
      const userResult = JSON.parse(localStorage.getItem('userResult'));
      leftList = userResult.map(data => data.word);
      rightList = userResult.map(data => data.translation);
    }
    this.container.innerHTML = '';
    const left = document.createElement('div');
    const right = document.createElement('div');
    left.classList.add('left');
    right.classList.add('right');
    //渲染left部分
    for (const wordData of leftList) {
      const index = wordData.index;
      const wordCard = this.createWordCard(index, wordData.value);
      left.appendChild(wordCard);
    }
    //乱序渲染right部分
    for (const translation of rightList) {
      const index = translation.index;
      const translationCard = this.createTranslationCard(index, translation.value);
      right.appendChild(translationCard);
    }
    this.container.appendChild(left);
    this.container.appendChild(right);
  }
  saveUserResult() {
    let userResult = [];
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
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
    console.log(userResult)
    localStorage.setItem('userResult', JSON.stringify(userResult));
    console.log('保存成功')

  }
  messUp(callback) {
    const userResult = JSON.parse(localStorage.getItem('userResult'));
    // const messUpUserResult = [...userResult].sort(() => Math.random() - 0.5);
    let messUpUserResult = [];
    const randomWordList = [...userResult].map(data => data.word).sort(() => Math.random() - 0.5);
    const randomTranslationList = [...userResult].map(data => data.translation).sort(() => Math.random() - 0.5);
    for (let i = 0; i < randomWordList.length; i++) {
      messUpUserResult.push({
        word: randomWordList[i],
        translation: randomTranslationList[i],
      })
    }
    localStorage.setItem('userResult', JSON.stringify(messUpUserResult));
    this.render();
    callback && callback();
  }
  changeWordsGroup(callback) {
    this.randomWordList = [...this.wordList].sort(() => Math.random() - 0.5).splice(0, 10);
    localStorage.setItem('randomWordList', JSON.stringify(this.randomWordList));
    localStorage.removeItem('userResult');
    this.render();
    callback && callback();
  }
  checkResult() {
    this.saveUserResult();
    const userResult = JSON.parse(localStorage.getItem('userResult'));
    const leftMap = userResult.map(data => data.word);
    const rightMap = userResult.map(data => data.translation);
    let result = [];
    console.log(leftMap, rightMap)
    for (let i = 0; i < leftMap.length; i++) {
      if (leftMap[i].index === rightMap[i].index) {
        result.push(i)
      }
    }
    this.checkRender(result);
  }
  checkRender(result) {
    const left = document.querySelector('.left');
    const right = document.querySelector('.right');
    const leftMap = Array.from(left.querySelectorAll('.card'))
    const rightMap = Array.from(right.querySelectorAll('.card'));
    //移除所有的correct类
    leftMap.forEach(card => {
      card.classList.remove('correct');
    })
    rightMap.forEach(card => {
      card.classList.remove('correct');
    })
    result.forEach(index => {
      leftMap[index].classList.add('correct');
      rightMap[index].classList.add('correct');
    })
  }
}

function soomthDragHandle(config = { vertical: true, duration: 1000 }) {
  return function (container) {
    if (container instanceof Array) return container.forEach(soomthDragHandle(config))
    const dragHandle = new Dragger(container);
    dragHandle.soomthDrag(config);
  }
}
const soomthDrag = soomthDragHandle({ vertical: true, duration: 1000 })

if (!localStorage.getItem('wordList')) {
  const wordDataList = await wordList.getWords();
  localStorage.setItem('wordList', JSON.stringify(wordDataList));
}
const wordDataList = JSON.parse(localStorage.getItem('wordList'));
const app = document.querySelector('.app .container')
const appRender = new GameRender(app, wordDataList);
appRender.render();
const [left, right] = [...document.querySelectorAll('.left,.right')]
soomthDrag([left, right]);
const saveButton = document.querySelector('#save');
const messUpButton = document.querySelector('#mess-up');
const changeWordsGroupButton = document.querySelector('#change-words-group');
const checkResultButton = document.querySelector('#check-result');
saveButton.addEventListener('click', (e) => {
  appRender.saveUserResult();
})
const dragHandle = () => {
  const [left, right] = [...document.querySelectorAll('.left,.right')]
  soomthDrag([left, right]);
}
messUpButton.addEventListener('click', e => {
  appRender.messUp(dragHandle);
})
changeWordsGroupButton.addEventListener('click', e => {
  appRender.changeWordsGroup(dragHandle);
})
checkResultButton.addEventListener('click', e => {
  appRender.checkResult();
})