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
