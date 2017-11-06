const R = require('ramda');
const { Map, List } = require('immutable');
const fs = require('fs');
const { } = require("./text");

const product = (...N) => N.reduce((num, n) => num * n);

const cond = (A, ...B) => P => P(...B, A) / P(...B);

const chain = (...ch) => P =>
    product(...ch.map(
        (v, i) => i === 0 ? P(v) : cond(v, ...ch.slice(0, i))(P)
    ));