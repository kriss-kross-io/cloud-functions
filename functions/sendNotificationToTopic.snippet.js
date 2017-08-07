/* SEND NOTIFICATION */
exports.sendNotificationToTopic = functions.database.ref('/articles/published/{postId}').onWrite(event => {
  // Setting variables
  const topic = 'topic_placeholder';
  const snapshot = event.data;
  // Only send a notification when a post has been created
  if (snapshot.previous.exists()) {
    return;
  }
  // Exit when the data is deleted
  if (!snapshot.exists()) {
    return;
  }
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
  admin.messaging().sendToTopic(topic, payload)
    .then(function(response) {
      console.info('MESSAGE: Successfully sent message to topic('+topic+'):\n', response);
    })
    .catch(function(error) {
      console.error('ERROR(message): Failed sending a message to topic('+topic+'):\n', error);
    });
});
