var myApp = myApp || {};
var loadUser = myApp.loadUser || {};

loadUser = (function(){

	// FIREBASE LISTENER AUTH STATE --> Prototype vars ->Delete when done
	var contador = 0;
	// END FIREBASE LISTENER AUTH STATE --> Prototype vars ->Delete when done

	// FIB Auth State
	firebase.auth().onAuthStateChanged(function(user) {

	  contador += 1;
	  //console.warn("Paso por Auth State Change:",contador);
	 
	  if(user){

	    // Accesss current user with Firebase -> firebase.auth().currentUser
	    var user = firebase.auth().currentUser;
	    _currentAuthUser = user;
	    var idEmail = JSON.parse(localStorage.getItem('userEmailID'));
	    //console.log("FibU",user.email);
	    searchUser(idEmail,user);

	  }

	  if(!user){
	    //console.log("Current user: NO User Auth");
	    // BACK TO INDEX
	    window.location = "./";
	  }

	});

	function searchUser(email,user){

		users.orderByChild("id").on("child_added", function(snapshot) {

		  if(email === snapshot.val().id){

		    userInfo = snapshot.val();
		    _userKey = snapshot.key;

		  }else{

		    return false;

		  }

		});

	};

	// EXPOSE USER KEY AND STUFF
	var _currentAuthUser;
	var _userKey;
	var _getUserKey = function(){
		return _userKey;
	};
	var _userEmail;
	var _getUserEmail = function(){
		return _userEmail;
	};

	return {
		currentAuthUser: _currentAuthUser,
		getUser: _userKey,
		getUserKey: _getUserKey,
		getEmail: _userEmail,
		getUserEmail: _getUserEmail
	}

})();