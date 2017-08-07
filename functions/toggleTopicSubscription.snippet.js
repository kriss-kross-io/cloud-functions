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
        console.info('SUBSCRIBED: User('+token+') subscribed to topic('+topic+'):\n', response);
        logStatus(token);
      })
      .catch(function(error) {
        console.error('ERROR(sub): User('+token+') failed subscribing to topic('+topic+'):\n', error);
      });
  } else {
    // unsubscribing
    admin.messaging().unsubscribeFromTopic(token, topic)
      .then(function(response) {
        console.log('UNSUBSCRIBED: User('+token+') unsubscribed from topic('+topic+'):\n', response);
        logStatus(token);
      })
      .catch(function(error) {
        console.error('ERROR(unsub): User('+token+') failed subscribing to topic('+topic+'):\n', error);
      });
  }
});
