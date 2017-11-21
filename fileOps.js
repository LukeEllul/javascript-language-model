const fs = require('fs');

// const iterateThroughFiles = locations => cb => 
//     locations.reduce((promise, location) =>
//         promise.then(() => new Promise((res, rej) => 
//             fs.readFile(location, (err, data) =>
//                 err ? rej(err) : res(cb(data))))),
//         Promise.resolve());

const iterateThroughFiles = (locations, origLocs = locations) => cb =>
    locations.length === 0 ? origLocs :
    (cb(fs.readFileSync(locations[0])), iterateThroughFiles(locations.slice(1), origLocs));

module.exports = {
    iterateThroughFiles
}