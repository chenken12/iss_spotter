// index.js
const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  for (const time of passTimes) {
    var d = new Date(0);
    d.setUTCSeconds(time.risetime);
    console.log(`Next pass at ${d} for ${time.duration} seconds!`);
  }
  //console.log(passTimes);
});
