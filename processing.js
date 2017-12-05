const R = require('ramda');
const { Map, List } = require('immutable');
const { iterateTokens } = require('./probFunctions');

const organize = (v, t, historyTokens, PoV) => [
    t.toLowerCase(),
    List([v, historyTokens.map(v => v.toLowerCase())]),
    PoV
];

const processOrganizedInfo = v => {
    const preTokens = v[1].get(1);
    const afterToken = v[0];
    const PoV = v[2];
    return Map({
        [preTokens[0]]: preTokens.length === 1 ?
            Map({
                'bi': Map({
                    [afterToken]: v[1].get(0)
                }),
                P: PoV
            }) :
            Map({
                'tri': Map({
                    [preTokens[1]]: Map({
                        [afterToken]: v[1].get(0)
                    })
                }),
                P: PoV
            })
    });
}

const nGram = (n, V) => countFn => countFn === 'getN' ? n : (...tokens) =>
    iterateTokens(n)(...tokens)(
        countFn, 
        R.pipe(
            organize,
            processOrganizedInfo
        ), 
        V
    );

const unigram = nGram(1);
const bigram = nGram(2);
const trigram = nGram(3);

const laplace = V => ngram => nGram(ngram('getN'), V);

module.exports = {
    unigram,
    bigram,
    trigram,
    laplace
};