/* SUBSCRIBE */
exports.addTopicSubscription = functions.database.ref('/topics/{topic}/{uid}/token').onCreate(event => {
  const topic = event.params.topic;
  const token = event.data.val();

  // subscribing
  return admin.messaging().subscribeToTopic(token, topic).then(function(response) {
    if (response.successCount) {
      console.info(`SUBSCRIBED:\nUser(${token}) subscribed to topic(${topic}):\n`, response);
      return logStatus(token);
    } else {
      response.errors.forEach((result, index) => {
        const errorInfo = result.error.errorInfo;
        console.error(`ERROR(sub):\nUser(${token}) failed subscribing to topic(${topic}):\n`, errorInfo.code);
      });
    }
  }).catch(function(error) {
    console.error(`ERROR(sub):\nUser(${token}) failed subscribing to topic(${topic}):\n`, error);
  });
});