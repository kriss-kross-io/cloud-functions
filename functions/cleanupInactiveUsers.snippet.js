/* CLEANUP */
exports.cleanupInactiveUsers = functions.https.onRequest((req, res) => {
  // Import request-promise
  const rp = require('request-promise');
  //  Import secure-compare
  const secureCompare = require('secure-compare');
  // db reference
  const ref = admin.database().ref();
  // query reference
  const query = req.query;
  // exit if the keys don't match
  // TODO: only allow authenticated Firebase users: https://stackoverflow.com/a/43239529
  if (!query.key || !secureCompare(query.key, functions.config().cron.key)) {
    console.error(`ERROR(cleanup) - 403:\nThe key provided in the request does not match the key set in the environment. Check that your ´key´ URL query parameter matches the cron.key attribute in ´firebase functions:config:get´`);
    res.status(403).send('403 - Unauthorized: Security key does not match. Make sure your ´key´ URL query parameter matches the cron.key environment variable.');
    return null;
  }
  // convert snapshot to array of tokens
  const snapshotToArray = snapshot => {
    let returner = [];
    snapshot.forEach(childSnapshot => {
      // push token
      let item = childSnapshot.val();
      item.uid = childSnapshot.key;

      returner.push(item);
    });
    return returner;
  };
  // TODO: loop through all topics
  ref.child('/topics/test_topic').once('value').then(function(snapshop) {
    let operations = [];
    // use `map` to create an array of promises
    operations = snapshotToArray(snapshop).map(function(item) {
      // request topic info from Instance ID service and return array of promises
      return rp({
        method: 'POST',
        uri: `https://iid.googleapis.com/iid/info/${item.token}?details=true`,
        headers: {
          'Authorization': `key=${MESSAGING_SERVER_KEY}`
        },
        json: true
      }).then(response => {
        if (!response.rel || !'test_topic' in response.rel.topics) {
          console.info(`CLEANUP:\nInactive User(${item.token}) is scheduled to be removed`);
          return {
            uid: item.uid,
            token: item.token
          };
        }
        return null;
      }).catch(function(response) {
        console.error(`ERROR(cleanup) - ${response.StatusCodeError}:\nStatus for User(${item.token}) failed:\n`, response.error);
        if (response.statusCode === 404) {
          console.info(`CLEANUP:\nInactive User(${item.token}) is scheduled to be removed`);
          return {
            uid: item.uid,
            token: item.token
          };
        }
      });
    });
    // wait for all promises to resolve
    return Promise.all(operations).then(function(result) {
      let updates = {};
      // create object of changes
      result.forEach(function(item) {
        if (item) {
          updates[item.uid] = null;
        }
      });
      // bulk update all tokens
      ref.child('/topics/test_topic').update(updates);
      console.info(`CLEANUP:\nCleanup finish, ${Object.keys(updates).length} inactive users have been removed from db`);
      res.status(200).send(`<p>Scheduled to be removed: <b>${Object.keys(updates).length}</b></p><pre>${JSON.stringify(updates, null, 2)}</pre><p>New subscriber count: <b>${(snapshotToArray(snapshop).length) - (Object.keys(updates).length)}</b></p>`);
    });
  });
});