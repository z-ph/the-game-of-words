class WordList {
  static uri = localStorage.getItem('uri') ? JSON.parse(localStorage.getItem('uri')) : './public/json/words2.json'

  async fetchWords() {
    const response = await fetch(WordList.uri);
    const json = await response.json();
    let words = [];
    let ArrayKey;
    for (const key in json) {
      if (json[key] instanceof Array) {
        ArrayKey = key;
      }
    }
    for (const data of json[ArrayKey]) {
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
    const response = await fetch(WordList.uri);
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

export default WordList;