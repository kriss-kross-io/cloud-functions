/* SUBSCRIBE/UNSUBSCRIBE */
exports.toggleTopicSubscription = functions.database.ref('/topics/{topic}/{token}').onWrite(event => {
  // Setting variables
  const topic = event.params.topic;
  const token = event.params.token;
  const snapshot = event.data;
  // Exit when the data is deleted
  if (snapshot.exists()) {
    // Only subscribe when a token is first created
    if (snapshot.previous.exists()) {
      return;
    }
    // subscribing
    request({
      url: 'https://iid.googleapis.com/iid/v1/'+token+'/rel/topics/'+topic,
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+MESSAGING_SERVER_KEY
      }
    }, function(error, response, body) {
      if (error) {
        console.error('ERROR(SUBSCRIBE): ' + error);
      } else if (response.statusCode >= 400) {
        console.error('ERROR(SUBSCRIBE): ErrorCode:'+response.statusCode+' - %s', response.statusMessage);
      } else {
        console.log('SUBSCRIBED: User(%s) subscribed to topic(%s)', token, topic);
      }
      logStatus(token);
    });
  } else {
    // unsubscribing
    request({
      url: 'https://iid.googleapis.com/iid/v1:batchRemove',
      method: 'POST',
      headers: {
        'Content-Type' :' application/json',
        'Authorization': 'key='+MESSAGING_SERVER_KEY
      },
      body: JSON.stringify({
        registration_tokens: [token],
        to : '/topics/'+topic
      })
    }, function(error, response, body) {
      if (error) {
        console.error('ERROR(UNSUBSCRIBE): ' + error);
      } else if (response.statusCode >= 400) {
        console.error('ERROR(UNSUBSCRIBE): ErrorCode:'+response.statusCode+' - %s', response.statusMessage);
      } else {
        console.log('UNSUBSCRIBED: User(%s) unsubscribed from topic(%s)', token, topic);
      }
      logStatus(token);
    });
  }
});