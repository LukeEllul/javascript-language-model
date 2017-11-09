const R = require('ramda');
const { Map, List } = require('immutable');

const product = (...N) => N.reduce((num, n) => num * n);

const cond = (A, ...B) => (P, V) => 
    (P(...B, A) + (V ? 1 : 0)) / (P(...B) + (V ? V : 0));

const iterateTokens = n => (...tokens) => (P, fn, V) =>
    tokens.map(
        (t, i) => {
            const slicedTokens = n !== 1 && tokens.slice(
                (j => j < 0 || n === 0 ? 0 : j)(i - (n - 1)), i);
            return (fn || (v => v))
                (
                    n === 1 || i === 0 ? P(t) : cond(t, ...slicedTokens)(P, V),
                    t,
                    slicedTokens,
                    P(t)
                )
        });

const markov = n => (...tokens) => P =>
    product(...iterateTokens(n)(...tokens)(P));

const chain = markov(0);

module.exports = {
    markov,
    chain,
    iterateTokens
}