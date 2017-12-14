const { unigram, bigram, trigram, laplace } = require('./processing');
const { generateCountFn, matchWords } = require('./tokens');
const { storeInDatabase, openStore } = require('./lang-model-storage/store');
const { calcVocab } = require('./model');
const { iterateThroughFiles } = require('./fileOps');

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

// //location of plain text file
// const location = './corpus-cleaner/cleanTexts/B0B.txt';

// //build bigram
// buildNGram(bigram)([location])
// .then(
//     () => console.log('done building bigram ' + location),
//     err => console.log(err)
// );

// //build trigram
// buildNGram(trigram)([location])
// .then(
//     () => console.log('done building trigram ' + location),
//     err => console.log(err)
// );

// //build bigram with laplace smoothing
// calcVocab('bigram')
// .then(
//     i => buildNGram(laplace(i)(bigram))([location])
// )
// .then(
//     () => console.log('done building laplace bigram' + location),
//     err => console.log(err)
// );

// //build trigram with laplace smoothing
// calcVocab('trigram')
// .then(
//     i => buildNGram(laplace(i)(trigram))([location])
// )
// .then(
//     () => console.log('done building laplace trigram' + location),
//     err => console.log(err)
// );