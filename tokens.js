const R = require('ramda');

const { text } = require('./text');

const matchWords = text => text.match(/\w+/gi);

const getWordCount = text => (matchWords(text) || []).length;
const getTokenCount = tokens => (tokens || []).length;

const joinTokens = (...tokens) => tokens.join(' ');

const removePunctuation = text => joinTokens(...matchWords(text));

const getSentences = text => 
    (text.match(/[A-Z\d][^.!?]*[.!?]/g) || [])
    .map(removePunctuation);

const generateCountFn = text => {
    const sentences = getSentences(text);
    const textWordCount = getWordCount(text);
    return (...tokens) =>
        sentences.reduce((currentTokenCount, sentence) =>
            currentTokenCount + getTokenCount(sentence.match(
                new RegExp(
                    removePunctuation(joinTokens(...tokens)),
                    'gi'
                )
            )), 0) / textWordCount;
}

//todo: rearrange generateCountFn to handle extra large files of
//sentences!!