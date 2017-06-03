console.info('- - - CONTROLLER USERS - - -');

var Firebase = require('firebase');
var config = require('../fibConfig');

//var myFirebaseRef = Firebase.database().ref('/users');
var Ref = Firebase.database().ref();
var queryID = Ref.child('querySearch');
var users = Ref.child('users');

// GET -> LOGGED USER INFO -> id === email
exports.userLogged = function(request,response) {
	//return response.status(200).jsonp('Sending User Info');
	console.log('> Send existing USER');
	return response.send('User Already at the DB');
};

// POST -> Creating New User
exports.addUser = function(request,response) {
	var user = request.body;
	//console.log('> ADD USER:',user.displayName);
	//console.log("req.headers",request.headers);
	return response.status(200).send('SERVER POST FN(addUser) answer');
};

// PUT -> Update LOGGED USER INFO -> id === email
exports.updateUser = function(request,response) {
	console.log('> Update USER');
	return response.send('Current User Updated in DB');
};

// DELETE -> Existing User
exports.deleteUser = function(request,response) {

	console.log('> Delete USER');
	return response.send('Current User Deleted from DB');
	
};

// GET -> All Users for Ranking and Challenges
exports.allUsers = function(request,response) {

	console.log('> SENDING ALL USERS!');

	Ref.child('/users').once("value", function(snapshot) {

		var answ = snapshot.val();
 		return response.status(200).jsonp(answ);
 		console.log(answ);

	}, function(errorObject) {

		if (errorObject) {

        	console.log("ERROR! - Respuesta (500) - Error en petición");
        	/*
            console.error("Respuesta (500) - Error en petición", {
                datos: errorObject
            });
            */

            return response.status(500).send("ERROR! 500 - Error en petición");
        }
	});
	
};

exports.updateUserStatus = function(key,currentStatus){

	var upStatus = Ref.child('users/'+key);
	if(key !== undefined){
		console.log("Update",currentStatus,key);
		upStatus.update({
			status: currentStatus
		});
	}

};