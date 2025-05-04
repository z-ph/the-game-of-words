class WordList {
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
    this.words = await this.fetchWords();
    return this.words;
  }
  async getPhrases() {
    this.phrase = await this.fetchPhrases();
    return this.phrase;
  }
  async fetchPhrases() {
    const response = await fetch('../public/json/words.json');
    const json = await response.json();
    let phrases = [];
    for (const data of json.CET6) {
      const wordMap = data.phrases.map(wordData => {
        return {
          word: wordData.word,
          translation: wordData.chineseMeaning
        }
      })
      phrases = [...phrases, ...wordMap]
    }
  }
}
const wordList = new WordList();

export default wordList;