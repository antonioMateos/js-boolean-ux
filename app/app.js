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
console.info("- - - APP JS - - -");
var template; // For prototyping

// TEMPLATE ENGINE CLIENT SIDE
function getTemplate(method,template,callback){

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
        
        if (xmlHttp.readyState === 4) {

            if (xmlHttp.status >= 100 && xmlHttp.status <= 399) {

                var data = xmlHttp.responseText;
                callback(data,template);

            } else if (xmlHttp.status >= 400 && xmlHttp.status <= 600) {
                console.info("ERROR!");
                console.warn(xmlHttp.responseText);
            }
        }
    };

    var serverURL = "./"+template;

    xmlHttp.open(method, serverURL, true);
    xmlHttp.send();

};

function printUI(data,template){

	var ui = document.querySelector(".main");
	ui.innerHTML = data;
	loadUI(template);

};

// INI APP
getTemplate("GET","login",printUI);

// END TEMPLATE ENGINE CLIENT SIDE

console.info("- - - UI JS - - -");

function loadUI(template){

	console.log("UI -> ",template);

	if(template === "login"){

		var logInBtn = document.querySelector(".btn-logIn");

		logInBtn.addEventListener("click" , cb => {
			var from = logInBtn.getAttribute("data-social");
			console.log("Log me in!");
			signIn(from);
		});

	};

};
console.info("- - - DOM LOGIN - - -");

// FIREBASE LISTENER AUTH STATE --> Prototype vars ->Delete when done
var contador = 0;
// END FIREBASE LISTENER AUTH STATE --> Prototype vars ->Delete when done

firebase.auth().onAuthStateChanged(function(user) {

	contador += 1;
	console.warn("Paso por Auth State Change:",contador);

	if(user){
		// Accesss current user with Firebase
		var user = firebase.auth().currentUser;
	    var idEmail = user.email;
	    updateWelcomeMsg();
	    checkUserServer(idEmail,getTemplate);
	}

	if(!user){
		console.log("Current user: NO User Auth");
		//printStatus += "<br>Current user: NO User";
		// DO NOTHING
	}

});

// Sign In
function signIn(socialMedia){

	// FB LOGIN
	if(socialMedia === "Facebook") {

		console.log("Login with:",socialMedia);

		// CREATE INSTANCE OBJECT FACEBOOK PROVIDER
		var provider = new firebase.auth.FacebookAuthProvider();

		// ADDITIONAL SCOPES
		provider.addScope('public_profile');
		provider.addScope('email');

		// INIT SESSION WITH REDIRECT --> Better for mobile devices and avoiding Blocked PopUps!
		firebase.auth().signInWithRedirect(provider);

		// REDIRECT RESULT
		firebase.auth().getRedirectResult().then(function(result) {

			if (result.credential) {
				// This gives you a Facebook Access Token. You can use it to access the Facebook API.
				var token = result.credential.accessToken;
			}

				// The signed-in user info.
				var user = result.user;

		}).catch(function(error) {
			// Handle Errors here.
			console.warn("- - - - - ERROR LOGIN WITH FB - - - - -");
			var errorCode = error.code;
			var errorMessage = error.message;
			// The email of the user's account used.
			var email = error.email;
			// The firebase.auth.AuthCredential type that was used.
			var credential = error.credential;
			// ...
		});

	};
	// END FB LOGIN

};

//UPDATE WELCOME MSG
function updateWelcomeMsg(){
	var welcomeText = document.querySelector(".login .welcome");
	var logInBtn = document.querySelector(".btn-logIn");
    welcomeText.innerHTML = "Logged into";
    logInBtn.innerHTML = "";
}

var idEmail;
//var idEmail = document.cookie;

function checkUserServer(idEmail,callback) {

	// SERVER URL
	var serverURL = "./api/authenticate";

	console.log("Cookie Session",idEmail);
	localStorage.setItem('userEmailID', JSON.stringify(idEmail));
	idEmail = JSON.parse(localStorage.getItem('userEmailID'));
	//document.cookie = idEmail;

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
        
        if (xmlHttp.readyState === 4) {

            if (xmlHttp.status >= 100 && xmlHttp.status <= 399) {

                console.info("AJAX Answer:", xmlHttp.responseText);
                // FOR PROTOTYPE
                var itemInfo = xmlHttp.responseText;
                window.location = "./profile";
                // END FOR PROTOTYPE

                // TODO --> Change window.location for template engine
                callback("GET","profile",printUI);

            } else if (xmlHttp.status >= 400 && xmlHttp.status <= 600) {

                console.error("ERROR! 404");
                console.warn(JSON.parse(xmlHttp.responseText));

            }
        }
    };

    xmlHttp.open("POST", serverURL, true);
    xmlHttp.send();

};

// END LOGIN
