/* LOGGING */
let logStatus = (token) => {
  // Import request
  const request = require('request');
  request({
    url: `https://iid.googleapis.com/iid/info/${token}?details=true`,
    method: 'POST',
    headers: {
      'Authorization': `key=${MESSAGING_SERVER_KEY}`
    }
  }, function(error, response, body) {
    if (error) {
      console.error(`ERROR(status):\nStatus for User(${token}) failed:\n`, error);
    } else if (response.statusCode >= 400) {
      console.error(`ERROR(status) - ${response.statusCode}:\nStatus for User(${token}) failed:\n${response.statusMessage}`);
    } else {
      console.info(`STATUS:\nInfo for User(${token}):\n`, body);
    }
  });
};