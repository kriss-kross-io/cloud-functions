/* SUBSCRIBE / UNSUBSCRIBE */
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
    admin.messaging().subscribeToTopic(token, topic)
      .then(function(response) {
        console.log('SUBSCRIBED: User(%s) subscribed to topic(%s): ' + response, token, topic);
        logStatus(token);
      })
      .catch(function(error) {
        console.error('ERROR(sub): User(%s) failed subscribing to topic(%s): ' + error, token, topic);
      });
  } else {
    // unsubscribing
    admin.messaging().unsubscribeFromTopic(token, topic)
      .then(function(response) {
        console.log('UNSUBSCRIBED: User(%s) unsubscribed from topic(%s): ' + response, token, topic);
        logStatus(token);
      })
      .catch(function(error) {
        console.error('ERROR(unsub): User(%s) failed unsubscribing from topic(%s): ' + error, token, topic);
      });
  }
});