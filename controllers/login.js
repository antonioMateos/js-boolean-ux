console.info('- - - CONTROLLER LOGIN - - -');

exports.authUser = function(request,response) {

	return response.send('AUTHENTICATED USER');

};

/*
var auth = Firebase.auth();
var userIdToken;  // Get the user's ID token from the client app

auth.verifyIdToken(userIdToken).then(function(decodedToken) {
  var uid = decodedToken.sub;
});
*/