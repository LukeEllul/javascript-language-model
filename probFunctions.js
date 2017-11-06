const R = require('ramda');
const { Map, List } = require('immutable');
const { text } = require('./text');

const product = (...N) => N.reduce((num, n) => num * n);

const cond = (A, ...B) => P => P(...B, A) / P(...B);

const iterateTokens = n => (...tokens) => (P, fn) =>
    tokens.map(
        (t, i) => {
            const slicedTokens = n !== 1 && tokens.slice(
                (j => j < 0 || n === 0 ? 0 : j)(i - (n - 1)), i);
            return (fn || (v => v))
                (n === 1 || i === 0 ? P(t) :
                    cond(t, ...slicedTokens)(P), t, slicedTokens)
        });

const markov = n => (...tokens) => P =>
    product(...iterateTokens(n)(...tokens)(P));

const chain = markov(0);

const generateCount = text => {
    const textNum = text.split(' ').length;
    return (...tokens) => 
        (text.match(new RegExp(tokens.join(' '), 'gi')) || []).length / textNum;
};

const v = iterateTokens(2)(...text.split(' '))(
    generateCount(text),
    (v, t, historyTokens) => ({ [t]: [v, historyTokens.toString()] })
);

console.log(v);

module.exports = {
    markov,
    chain
}