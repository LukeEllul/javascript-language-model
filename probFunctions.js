const product = (...N) => N.reduce((num, n) => num * n);

const cond = (A, ...B) => (P, V) => 
    (P(...B, A) + (V ? 1 : 0)) / (P(...B) + (V ? V : 0));

const iterateTokens = n => (...tokens) => (P, fn, V) => {
    let count = 0;
    let length = tokens.length;
    return tokens.map(
        (t, i) => {
            console.log(((++count / length) * 100) + '%');
            const slicedTokens = n !== 1 && tokens.slice(
                (j => j < 0 || n === 0 ? 0 : j)(i - (n - 1)), i);
            const Pt = P(t);
            return (fn || (v => v))
                (
                    n === 1 || i === 0 ? Pt : cond(t, ...slicedTokens)(P, V),
                    t,
                    slicedTokens,
                    Pt
                )
        });
    }

const markov = n => (...tokens) => P =>
    product(...iterateTokens(n)(...tokens)(P));

const chain = markov(0);

module.exports = {
    markov,
    chain,
    iterateTokens
}