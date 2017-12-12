const fs = require('fs');

function iterateThroughFiles(locations, origLocs = locations) {
    locations.length === 0 || this[locations[0]] || (this[locations[0]] = fs.readFileSync(locations[0]));
    return cb => locations.length === 0 ? origLocs :
        (cb(this[locations[0]], locations[0]), iterateThroughFiles(locations.slice(1), origLocs)(cb));
}

module.exports = {
    iterateThroughFiles
}