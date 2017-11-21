const R = require('ramda');
const { bigram, trigram, laplace } = require('./processing');
const { text } = require('./text');
const { iterateThroughFiles } = require('./fileOps');

const matchWords = text => text.match(/\w+/gi);

const getWordCount = text => (matchWords(text) || []).length;
const getTokenCount = tokens => (tokens || []).length;

const joinTokens = (...tokens) => tokens.join(' ');

const removePunctuation = text => joinTokens(...matchWords(text));

const getSentences = text =>
    (text.match(/[A-Z\d][^.!?]*[.!?]/g) || [])
        .map(removePunctuation);

const getWordCountOfTexts = textLocations => {
    let count = 0;
    iterateThroughFiles(textLocations)(
        text => count = count + getWordCount(text.toString())
    );
    return count;
}

// const generateCountFn = text => {
//     //todo: rearrange generateCountFn to handle extra large files of
//     //sentences!!
//     const sentences = getSentences(text);
//     const textWordCount = getWordCount(text);
//     return (...tokens) =>
//         sentences.reduce((currentTokenCount, sentence) =>
//             currentTokenCount + getTokenCount(sentence.match(
//                 new RegExp(
//                     removePunctuation(joinTokens(...tokens)),
//                     'gi'
//                 )
//             )), 0) / textWordCount;
// }

const generateCountFn = textLocations => {
    const textWordCount = getWordCountOfTexts(textLocations);
    return (...tokens) => {
        let tokenCount = 0;
        iterateThroughFiles(textLocations)(
            text => tokenCount = getSentences(text.toString()).reduce((currentTokenCount, sentence) =>
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

const v = laplace(96)(bigram)(
    generateCountFn(['./text.js'])
)(...matchWords(text));

console.log(v);

//write function to count vocabulary for laplace

//fs.writeFileSync('./processedObj.json', JSON.stringify(v.toJS()));