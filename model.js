const { unigram, bigram, trigram, laplace } = require('./processing');
const { generateCountFn, matchWords } = require('./tokens');
const { storeInDatabase, openStore } = require('./lang-model-storage/store');
const fs = require('fs');
const { fromJS } = require('immutable');

// const x = trigram(
//     generateCountFn(['./texts/text.js'])
// )(...matchWords(text));

// storeInDatabase('trigram')(x)
// .then(() => console.log('done'), err => console.log(err));

// storeInDatabase('bigram')(fromJS(JSON.parse(fs.readFileSync('./texts/organizedText.json'))))
// .then(() => console.log('done'), err => console.log(err));

const location = './lang-model-storage/databases/';

// openStore(location + 'trigram')
//     .then(db =>
//         db.createReadStream()
//             .on('data', data => console.log(data.key) || console.log(data.value))
//             .on('end', () => console.log('ended'))
//     );

const getExpo = n => {
    const expo = n.toExponential();
    const index = expo.lastIndexOf('-') === -1 ? expo.lastIndexOf('+') : expo.lastIndexOf('-');
    return Number(expo.slice(index));
}

const calcNextWord = (inverse = false) => o => {
    const obj = fromJS(o);
    let i = 0;
    const newObj = obj.map(v => [i, (i = i + (!inverse ? v || 0 : !v ? 0 : (1 / v)), !inverse || v ? i : 0)]);
    const randomNum = Math.random() * i;
    return newObj.findKey(v => v[1] === 0 && Math.random() < 0.7) || newObj.findKey(v => randomNum >= v[0] && randomNum < v[1]);
}

const nextWord = calcNextWord();
const nextWrongWord = calcNextWord(true);

const operateModel = fn => nGram => sentence => {
    const nGramNo = nGram('getN');
    if (nGramNo === 1) {
        const rand = Math.random() * (1 - 0.5) + 0.5;
        return new Promise(res => {
            openStore(location + 'bigram')
                .then(db =>
                    db.createReadStream()
                        .on('data', data =>
                            data.value.P > (rand * Math.pow(10, getExpo(data.value.P))) &&
                            Math.random() < 0.7 &&
                            res(data.key)
                        )
                )
        });
    }
    const nGramType = (x => nGram('isLaplace') ? x + 'Laplace' : x)(nGramNo === 1 ? 'unigram' :
        nGramNo === 2 ? 'bigram' : 'trigram');
    const lastWords = matchWords(sentence.toLowerCase()).slice((nGramNo * -1) + 1);
    return new Promise((res, rej) => {
        openStore(location + nGramType)
            .then(db =>
                db.get(lastWords[0], (err, data) => {
                    if (err && err.notFound) {
                        // console.log('word cannot be found in corpus so starting from undefined');
                        // db.get('undefined', (err, data) => res(fn(data.tri['undefined'])));
                        //console.log('word cannot be found in corpus');
                        rej('word not found');
                    }
                    else if (nGramNo === 2)
                        res(fn(data.bi || (lastWords[0] === 'undefined' && data.tri['undefined'])));
                    else if (nGramNo === 3)
                        (x => x ? res(fn(x)) : rej("trigram not found"))(data.tri[lastWords[1]] || (lastWords[0] === 'undefined' && data.tri['undefined']))
                })
            )
    });
}

const calcVocab = databaseName => {
    let i = 0;
    return new Promise((res, rej) => {
        openStore(location + databaseName).then(
            db => db.createReadStream()
                .on('data', () => i++)
                .on('end', () => res(i))
        );
    });
}

const GenerateText = operateModel(nextWord);
const WrongWord = operateModel(nextWrongWord);

const backoff = sentence => fn => new Promise((res, rej) => {
    fn(trigram)(sentence).then(
        v => res(v),
        v => v === "trigram not found" && fn(bigram)(sentence).then(
            v => res(v),
            v => v === 'word not found' && fn(unigram)(sentence).then(
                v => res(v),
                err => console.log('backoff error\n' + err) || rej(err)
            )
        )
    )
});

// calcVocab('bigram').then(
//     n => GenerateText(laplace(n)(bigram))('there are').then(
//         console.log,
//         console.log
//     )
// )

// openStore(location + 'bigramLaplace')
// .then(db => db.createReadStream().on('data', (data) => console.log(data.value)).on('end', () => console.log('end')));

// WrongWord(bigram)('since there are a lof of').then(
//     console.log,
//     console.log
// );

module.exports = {
    GenerateText,
    WrongWord,
    backoff,
    calcVocab
};