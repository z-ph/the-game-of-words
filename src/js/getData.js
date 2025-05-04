class WordList {
  constructor() {
    this.words = [];
  }

  async fetchWords() {
    const response = await fetch('../public/json/words.json');
    const json = await response.json();
    let words = [];
    for (const data of json.CET6) {
      const wordMap = data.words.map(wordData => {
        return {
          word: wordData.word,
          translation: wordData.chineseMeaning
        }
      })
      words = [...words, ...wordMap]
    }
    return words;
  }
  async getWords() {
    if (this.words.length === 0) {
      this.words = await this.fetchWords();
    }
    return this.words;
  }
}
const wordList = new WordList();

export default wordList;