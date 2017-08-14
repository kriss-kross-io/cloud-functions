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
        if (response.successCount) {
          console.info('SUBSCRIBED:\nUser('+token+') subscribed to topic('+topic+'):\n', response);
          logStatus(token);
        } else {
          response.errors.forEach((result, index) => {
            const errorInfo = result.error.errorInfo;
            console.error('ERROR(sub):\nUser('+token+') failed subscribing to topic('+topic+'):\n', errorInfo.code);
          });
        }

      })
      .catch(function(error) {
        console.error('ERROR(sub):\nUser('+token+') failed subscribing to topic('+topic+'):\n', error);
      });
  } else {
    // unsubscribing
    admin.messaging().unsubscribeFromTopic(token, topic)
      .then(function(response) {
        if (response.successCount) {
          console.info('UNSUBSCRIBED:\nUser('+token+') unsubscribed from topic('+topic+'):\n', response);
          logStatus(token);
        } else {
          response.errors.forEach((result, index) => {
            const errorInfo = result.error.errorInfo;
            console.error('ERROR(unsub):\nUser('+token+') failed unsubscribing to topic('+topic+'):\n', errorInfo.code);
          });
        }
      })
      .catch(function(error) {
        console.error('ERROR(unsub):\nUser('+token+') failed unsubscribing to topic('+topic+'):\n', error);
      });
  }
});
