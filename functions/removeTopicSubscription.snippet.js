/* UNSUBSCRIBE */
exports.removeTopicSubscription = functions.database.ref('/topics/{topic}/{uid}/token').onDelete(event => {
  const topic = event.params.topic;
  const token = event.data.previous.val();

  // unsubscribing
  return admin.messaging().unsubscribeFromTopic(token, topic).then(function(response) {
    if (response.successCount) {
      console.info(`UNSUBSCRIBED:\nUser(${token}) unsubscribed from topic(${topic}):\n`, response);
      return logStatus(token);
    } else {
      response.errors.forEach((result, index) => {
        const errorInfo = result.error.errorInfo;
        console.error(`ERROR(unsub):\nUser(${token}) failed unsubscribing to topic(${topic}):\n`, errorInfo.code);
      });
    }
  }).catch(function(error) {
    console.error(`ERROR(unsub):\nUser(${token}) failed unsubscribing to topic(${topic}):\n`, error);
  });
});