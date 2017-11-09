const R = require('ramda');
const { Map, List } = require('immutable');
const { iterateTokens } = require('./probFunctions');
const fs = require('fs');

const { text } = require('./text');

const generateCount = text => {
    const textNum = text.split(' ').length;
    return (...tokens) =>
        (text.match(new RegExp(tokens.join(' '), 'gi')) || []).length / textNum;
};

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