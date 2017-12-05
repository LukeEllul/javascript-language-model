openStore(location + 'bigram')
// .then(db => 
//     db.createReadStream()
//     .on('data', data => console.log(data.key) || console.log(data.value))
//     .on('end', () => console.log('ended'))
// );