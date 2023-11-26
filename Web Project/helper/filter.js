const Filter = require("bad-words");
const Words = require("../models/words");

const filterHelper = async (stringToBeFilter) => {
  const filter = new Filter({ emptyList: true });

  const inappropriateWords = await Words.find().select({
    _id: 0,
    word: 1,
  });
  const arrayOfWords = inappropriateWords.map((obj) => obj.word.toLowerCase());

  filter.addWords(...arrayOfWords);
  const filteredString = filter.clean(stringToBeFilter);
  return filteredString;
};

module.exports = filterHelper;
