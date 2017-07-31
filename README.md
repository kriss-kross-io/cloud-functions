# cloud-functions

This is a collection of frequently used functions for Firebase Cloud Functions and/or Google Cloud Functions. 
The following steps are intended for use with a Firebase-project and the [polymerfire](https://www.webcomponents.org/element/firebase/polymerfire) elements. Please make sure you have a Polymer web app (preferably generated w/ the [polymer-cli](https://github.com/Polymer/polymer-cli)) up and running before continuing.

## Steps
1. Add `gcm_sender_id: "103953800509"` to `manifest.json`
2. Create `firebase-messaging-sw.js` and add it as dependency in `polymer.json` (get **SENDER_ID** from `Settings > Project Settings > Cloud Messaging`in the Firebase console):

``` javascript
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in the messagingSenderId
firebase.initializeApp({
  'messagingSenderId': '[ SENDER_ID ]'
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
```

3. Set the `messaging-sender-id` property on `firebase-app` element (get ID from above)
4. Create `functions` folder:
  - Create `package.json` and add dependencies:
``` json
{
  "name": "cloud-functions",
  "description": "Firebase SDK for Cloud Functions",
  "private": true,
  "dependencies": {
      "firebase-admin": "^4.1.1",
      "firebase-functions": "^0.5.1",
      "request": "^2.79.0"
  }
}
```
  - Create `index.js`, add imports and init app:
``` javascript
// Import and initialize the Firebase Admin SDK.
const admin = require('firebase-admin');
// Import the Firebase SDK for Google Cloud Functions
const functions = require('firebase-functions');
// Import request
const request = require('request');
// Init
admin.initializeApp(functions.config().firebase);
```
  - Set `SERVER_KEY` (get **SERVER_KEY** from `Settings > Project Settings > Cloud Messaging`):
``` javascript
// Setting api key
const MESSAGING_SERVER_KEY = "SERVER_KEY";
```
  - Add export function snippets to the bottom of `index.js`
  - Lastly add `logStatus.snippet.js` to enable output to [logs](https://console.cloud.google.com/logs/viewer)
  - (Optional) Update `Security Rules` if using Firebase db triggers


## Setup

### Prerequisites

Install [npm](https://www.npmjs.com/) (or install [Node](https://nodejs.org/en/download/)):

``` bash
curl -L https://www.npmjs.com/install.sh | sh
```

Install [bower](https://bower.io/):

``` bash
npm install -g bower
```

### Tools

Install [firebase-tools](https://github.com/firebase/firebase-tools):

```bash
npm install -g firebase-tools
```

### Choose Firebase project

After installing prerequisites and tools:

``` bash
firebase login
```

``` bash
firebase use default
```

## Deploy

This command deploys the application to hosting in the current project. Use
`firebase list` to print a list of all Firebase projects.

``` bash
firebase deploy functions
```