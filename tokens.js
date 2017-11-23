const R = require('ramda');
const { bigram, trigram, laplace } = require('./processing');
//const { text } = require('./text');
const { iterateThroughFiles } = require('./fileOps');
const memoize = require('memoize-immutable');
const fs = require('fs');

const matchWords = memoize(text => text.match(/\w+/gi));

const getWordCount = text => (matchWords(text) || []).length;
const getTokenCount = tokens => (tokens || []).length;

const joinTokens = (...tokens) => tokens.join(' ');

const removePunctuation = text => joinTokens(...matchWords(text) || []);

const getPhrases = memoize(text =>
    (text.match(/[\w\d][^.!?,:;()]*[.!?,:;()]/g) || [])
        .map(removePunctuation));

const getWordCountOfTexts = textLocations => {
    let count = 0;
    iterateThroughFiles(textLocations)(
        text => count = count + getWordCount(text.toString())
    );
    return count;
}

const generateCountFn = textLocations => {
    const textWordCount = getWordCountOfTexts(textLocations);
    return (...tokens) => {
        let tokenCount = 0;
        iterateThroughFiles(textLocations)(
            text => tokenCount = getPhrases(text.toString()).reduce((currentTokenCount, sentence) =>
                currentTokenCount + getTokenCount(sentence.match(
                    new RegExp(
                        removePunctuation(joinTokens(...tokens)),
                        'gi'
                    )
                )), tokenCount)
        );
        return tokenCount / textWordCount;
    }
}

module.exports = {
    generateCountFn
};