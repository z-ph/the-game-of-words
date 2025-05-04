import GameRender from './gameRender.js';
import wordList from "./getData.js";

// 如果本地存储中没有wordList，则从wordList.js中获取数据并存储到本地存储中
if (!localStorage.getItem('wordList')) {
  const wordDataList = await wordList.getWords();
  localStorage.setItem('wordList', JSON.stringify(wordDataList));
}
// 从本地存储中获取数据
const wordDataList = JSON.parse(localStorage.getItem('wordList'));
const appContainer = document.querySelector('.app .container')
// 渲染游戏
const appRender = new GameRender(appContainer, wordDataList);
appRender.renderWords();

// 获取按钮元素
const saveButton = document.querySelector('#save');
const messUpButton = document.querySelector('#mess-up');
const changeWordsGroupButton = document.querySelector('#change-words-group');
const checkResultButton = document.querySelector('#check-result');
// 添加事件监听器
saveButton.addEventListener('click', appRender.saveUserResult.bind(appRender))
messUpButton.addEventListener('click', appRender.messUp.bind(appRender))
changeWordsGroupButton.addEventListener('click', appRender.changeWordsGroup.bind(appRender))
checkResultButton.addEventListener('click', appRender.checkResult.bind(appRender))