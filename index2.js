// index2.js

const { nextISSTimesForMyLocation } = require('./iss_promised');

nextISSTimesForMyLocation()
  .then((passTimes) => {
    for (const time of passTimes) {
      var d = new Date(0);
      d.setUTCSeconds(time.risetime);
      console.log(`Next pass at ${d} for ${time.duration} seconds!`);
    }
  })
  .catch((error) => {
    console.log("It didn't work: ", error.message);
  });



  // const risetime = JSON.parse(body).response;
  // console.log(risetime);