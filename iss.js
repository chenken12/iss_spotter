/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */

const request = require('request');

const fetchMyIP = function(callback) {
  // use request to fetch IP address from JSON API
  request('https://api.ipify.org?format=json', (error, response, body) => {
    //console.log('error:', error); // Print the error if one occurred
    //console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.log('body:', body); // Print the HTML for the Google homepage.
    
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).ip;
    callback(null, data);
  });
  
};

const fetchCoordsByIP = function(ip, callback) {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const latitude = JSON.parse(body).latitude;
    const longitude = JSON.parse(body).longitude;
    //console.log(data.latitude);
    callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coord, callback) {
  request(`https://iss-pass.herokuapp.com/json/?lat=${coord.latitude}&lon=${coord.longitude}`, (error, response, body) => {

    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coordinates. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const data = JSON.parse(body).response;
    //console.log('data:', data);
    callback(null, data);
  });
};

/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  // empty for now
  fetchMyIP((error, ip) => {
    if (error) {
      //console.log("It didn't work!" , error);
      return callback(error, null);
    }
    // console.log('It worked! Returned IP:' , ip);
  
    fetchCoordsByIP(ip, (error, coordinates) => {
      if (error) {
        //console.log("It didn't work!" , error);
        return callback(error, null);
      }
      // console.log('It worked! Returned Coordinates:' , coordinates);
  
      fetchISSFlyOverTimes(coordinates, (error, risetime) => {
        if (error) {
          //console.log("It didn't work!" , error);
          return callback(error, null);
        }
        // console.log('It worked! Returned flyover times:' , risetime);
        callback(null, risetime);
      });
    });
  });
}

module.exports = { nextISSTimesForMyLocation };
