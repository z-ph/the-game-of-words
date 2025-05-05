import GameRender from './toolClass/gameRender.js';
import WordList from "./toolClass/getData.js";
const wordList = new WordList();
async function changeWordsSource(uri) {
  WordList.uri = uri;
  localStorage.setItem('uri', JSON.stringify(uri));
  localStorage.removeItem('wordList');
  GameRender.removeLocalStorage();
  const wordDataList = await wordList.getWords();
  localStorage.setItem('wordList', JSON.stringify(wordDataList));
  renderGame();
}
function renderGame() {
  // 从本地存储中获取数据
  const wordDataList = JSON.parse(localStorage.getItem('wordList'));
  appRender.modifyWordList(wordDataList);
  // 渲染游戏
  appRender.renderWords();
}
export { changeWordsSource }
// 如果本地存储中没有wordList，则从wordList.js中获取数据并存储到本地存储中
if (!localStorage.getItem('wordList')) {
  const wordDataList = await wordList.getWords();
  localStorage.setItem('wordList', JSON.stringify(wordDataList));
}
if (!localStorage.getItem('uri')) {
  localStorage.setItem('uri', JSON.stringify(WordList.uri));
}
// 从本地存储中获取数据
const wordDataList = JSON.parse(localStorage.getItem('wordList'));
const appContainer = document.querySelector('.app .container')
const appRender = new GameRender(appContainer, wordDataList);
// 渲染游戏
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
