const { unigram, bigram, trigram, laplace } = require('./processing');
const { generateCountFn, matchWords } = require('./tokens');
const { storeInDatabase, openStore } = require('./lang-model-storage/store');
const { calcVocab } = require('./model');
const { iterateThroughFiles } = require('./fileOps');

//const location = './corpus-cleaner/cleanTexts/A1B.txt';

const buildNGram = nGram => texts =>
    storeInDatabase(
        (
            (x, y) => (x === 1 ? 'unigram' :
                x === 2 ? 'bigram' : 'trigram') +
                (y ? 'Laplace' : '')
        )(nGram('getN'), nGram('isLaplace'))
    )
        (
        nGram(
            generateCountFn(texts)
        )(
            ...(() => {
                let theseWords = [];
                iterateThroughFiles(texts)(
                    text => theseWords.push(...matchWords(text.toString()))
                );
                return theseWords;
            })()
            )
        );

// calcVocab('bigram')
//     .then(i => buildNGram(laplace(i)(trigram))(['./texts/text.js']))
//     .then(() => console.log('done'));

// buildNGram(bigram)([location])
// .then(() => console.log('done'), err => console.log(err));