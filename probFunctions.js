const R = require('ramda');
const { Map, List } = require('immutable');
const fs = require('fs');

const product = (...N) => N.reduce((num, n) => num * n);

const cond = (A, ...B) => P => P(...B, A) / P(...B);

const markov = n => (...tokens) => P =>
    product(...tokens.map(
        (t, i) => n === 1 || i === 0 ? P(t) :
            cond(t, ...tokens.slice(
                (j => j < 0 || n === 0 ? 0 : j)(i - (n - 1)), i))(P)
    ));

const chain = markov(0);
const unigram = markov(1);
const bigram = markov(2);

const count = (...tokens) => console.log(tokens) ||
    (text.match(new RegExp(tokens.join(' '), 'gi')) || []).length / textNum;