const fs = require('fs');

const iterateThroughFiles = locations => cb => 
    locations.reduce((promise, location) =>
        promise.then(() => new Promise((res, rej) => 
            fs.readFile(location, data => res(cb(data))))),
        Promise.resolve());

module.exports = {
    iterateThroughFiles
}