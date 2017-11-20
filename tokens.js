const R = require('ramda');
const {bigram, trigram, laplace} = require('./processing');
const { text } = require('./text');
const fs = require('fs');

const matchWords = text => text.match(/\w+/gi);

const getWordCount = text => (matchWords(text) || []).length;
const getTokenCount = tokens => (tokens || []).length;

const joinTokens = (...tokens) => tokens.join(' ');

const removePunctuation = text => joinTokens(...matchWords(text));

const getSentences = text =>
    (text.match(/[A-Z\d][^.!?]*[.!?]/g) || [])
        .map(removePunctuation);

const generateCountFn = text => {
    //todo: rearrange generateCountFn to handle extra large files of
    //sentences!!
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

const v = laplace(96)(bigram)(
    generateCountFn(text)
)(...matchWords(text));

console.log(v);

//write function to count vocabulary for laplace

//fs.writeFileSync('./processedObj.json', JSON.stringify(v.toJS()));