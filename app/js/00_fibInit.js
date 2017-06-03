console.info("- - - FIB INIT - - -");
// Initialize Firebase
const config = {
  apiKey: "AIzaSyCyAfG-ex3CrPJxiqt4FpSttZ6zsOEjA10",
  authDomain: "boolean-ux.firebaseapp.com",
  databaseURL: "https://boolean-ux.firebaseio.com",
  projectId: "boolean-ux",
  storageBucket: "boolean-ux.appspot.com",
  messagingSenderId: "520485565085"
};

firebase.initializeApp(config);

var users = firebase.database().ref().child('users');
// Existe user en db?
var queryID = firebase.database().ref().child('querySearch');