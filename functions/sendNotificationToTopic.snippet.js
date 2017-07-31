/* SEND NOTIFICATION */
exports.sendNotificationToTopic = functions.database.ref('/articles/published/{postId}').onWrite(event => {
  // Setting variables
  const topic = 'articles';
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
      click_action: `https://${functions.config().firebase.authDomain}/articles/${key}`
    }
  };
  // Send a message to devices subscribed to the provided topic
  admin.messaging().sendToTopic(topic, payload).then(function(response) {
    // See the MessagingTopicResponse reference documentation for the contents of response
    console.log('MESSAGE: Successfully sent message to a topic(%s): ' + response, topic);
  }).catch(function(error) {
    console.error('ERROR: Failed sending a message to a topic(%s): ' + error, topic);
  });
});