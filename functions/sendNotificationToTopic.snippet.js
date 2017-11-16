/* SEND NOTIFICATION - test_topic */
exports.sendNotificationToTopic = functions.database.ref('/articles/published/{postId}').onCreate(event => {
  const TOPIC = 'test_topic';
  const snapshot = event.data;
  // Setting payload
  const header = snapshot.val().header;
  const key = snapshot.val().key;
  const payload = {
    notification: {
      title: 'A new article was published on ' + `${functions.config().firebase.authDomain}`,
      body: header ? (header.length <= 100 ? header : header.substring(0, 97) + '...') : '',
      icon: `https://${functions.config().firebase.authDomain}/images/kriss-kross-square-logo-192.png`,
      click_action: key ? `https://${functions.config().firebase.authDomain}/articles/${key}` : ''
    }
  };
  // Send a message to devices subscribed to the provided topic
  return admin.messaging().sendToTopic(TOPIC, payload).then(function(response) {
    console.info(`MESSAGE:\nSuccessfully sent message to topic(${TOPIC}):\n`, response);
  }).catch(function(error) {
    console.error(`ERROR(message):\nFailed sending a message to topic(${TOPIC}):\n`, error);
  });
});