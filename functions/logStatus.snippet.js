/* LOGGING */
var logStatus = (token) => {
  request({
    url: 'https://iid.googleapis.com/iid/info/'+token+'?details=true',
    method: 'POST',
    headers: {
      'Authorization': 'key='+MESSAGING_SERVER_KEY
    }
  }, function(error, response, body) {
    if (error) {
      console.error('ERROR(status):\n', error);
    } else if (response.statusCode >= 400) {
      console.error('ERROR(status): ErrorCode: %i - %s', response.statusCode, response.statusMessage);
    } else {
      console.info('STATUS: Info for User('+token+'):\n' + body);
    }
  });
};
