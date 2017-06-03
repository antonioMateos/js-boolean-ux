var myApp = myApp || {};

console.info("- - - DOM PROFILE - - -");
var profile = myApp.profile || {};

profile = (function(){

	var headText = document.querySelector(".head-info p");

	idEmail = JSON.parse(localStorage.getItem('userEmailID'));
	//console.log("Cookie ID",idEmail);

	searchUser(idEmail);

	// SIGN OUT
	function signOut (){

		firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		  //console.info("Log Out successful");
		  window.location = "./";
		}, function(error) {
		  // An error happened.
		  console.info("Log Out error:",error);
		});
		
	};

	function searchUser(email) {

		//Index OF added to Rules
		//console.log("User email id:",email);
		headText.innerHTML = "Loading";

		queryID.orderByChild("id").equalTo(email).once("value", function(snapshot) {

			var check = snapshot.val();

			if(check === null){
				createUser(email,createIdReg);
				console.log("NOPE",email,createIdReg);
			} else {
				getUser(email);
				//console.log("YASS");
			}

		});

	};

	function createUser(email,callback){

		//console.log("CreateUser:",email);

		// RANDOM POINTS FOR PROTOTYPING
			// Random points
			// var h = Math.floor(Math.random() * 500) + 1;
			// Points for reverse order
			// var hO = h*(-1);
		var user = firebase.auth().currentUser;
	  	//console.log("New user",user);
	  	
		users.push({
			// PROFILE INFO from Social Media
			id: email,
			status: "online",
			name: user.providerData[0].displayName,
			photo: user.providerData[0].photoURL,
			provider: user.providerData[0].providerId,
			// GAME INFO
			// TODO -> DELETE RANK FROM ALL USERS
			rank: 0, // Calcular en real time segun points --> DONE!
			points: 0,
			orderPoints: 0,
			games: {
				total: 0,
				success: 0,
				fails:0
			},
			battles: {
				won: 0,
				lost: 0
			},
			messages: {
				message:{
					from: "",
					body:""
				}
			}
		});

		callback(email,getUser);

	};

	function createIdReg(email,callback){

		queryID.push({
			id: email
		});

		callback(email);
		
	};

	function getUser(email){

		users.orderByChild("id").on("child_added", function(snapshot) {

		if(email === snapshot.val().id){

			var userInfo = snapshot.val();
			//console.log("MATCH!",snapshot.key);
			printUI(userInfo,snapshot.key);

		}else{

			return false;
			//console.info("Load user ERROR: User logged but not found in Firebase");

		}

		});

	};

	function printUI(userInfo,snapshotKey){

		headText.innerHTML = "";
		var content = document.querySelector('.mainContent');

		content.classList.add("show");

		//USER NAME
		var userName = document.querySelector(".user-name");
		userName.innerHTML = userInfo.name;
		//userName.innerHTML += "<br>from "+userInfo.provider;

		//USER IMG
		var userImg = document.querySelector(".user-img img");
		userImg.src = userInfo.photo;
		userImg.setAttribute("alt",userInfo.name+" Profile Pic");

		//USER email     -> .user-email
		var userEmail = document.querySelector(".user-email");
		userEmail.innerHTML = userInfo.id; // Change ID --> Email on user DB

		//USER rank     -> .user-rank --> Calcular según Points
		checkRank(userInfo.id);

		//USER points     -> .user-points
		var userPoints = document.querySelector(".user-points");
		userPoints.innerHTML = userInfo.points+" points";

		//USER STATUS 	  -> .user-status
		var userStatus = document.querySelector(".profile");
		userStatus.setAttribute("data-status",userInfo.status);

		//USER GAMES 	  -> .user-stats .games
		var userGames = document.querySelector(".user-stats .games .totals");
		var totalPlays = userInfo.games.success + userInfo.games.fails;
		var winPlays = userInfo.games.success;
		var winPerc = winPlays/totalPlays;

		winPerc = winPerc.toFixed(2);

		// ISSUE WHEN USER INIT
		if(winPerc === NaN){
			winPerc=0;
			console.log("NAN");
		}

		userGames.innerHTML = winPerc+" %";

		//USER BATTLES 	  -> .user-stats .battles
		var userBattles = document.querySelector(".user-stats .battles .totals");
		userBattles.innerHTML = userInfo.battles.won+" / "+userInfo.battles.lost;

		//USER CHALLENGES -> .user-challenges -> TODO
		var userChallenges = document.querySelector(".user-challenges");
		//userChallenges.innerHTML = "Loading User received messages";

	};

	function checkRank(idEmail){

		//console.log("Checking Rank");

		var rankingPosition = 0;

		users.orderByChild("orderPoints").on("child_added", function(snapshot) {

			var user = snapshot.val();
			rankingPosition += 1;
			//console.log(idEmail+" Retrieved user "+user.id);

			if(idEmail === user.id) {
				var userRank = document.querySelector(".user-rank");
				userRank.innerHTML = "#"+rankingPosition;
				//console.log("Rank:",rankingPosition)
			} else {
				// NOTHING
			}

		});

	}

	// BUTTONS
	// LOGOUT BUTTON
	var logOutBtn = document.querySelector(".btn-logOut");
	logOutBtn.addEventListener("click" , cb => {
		//console.log("Trigger Loggin Out!");
		profile.signOut();
	});
	// BATTLE BUTTON
	var battleBtn = document.querySelector(".btn-battle");
	battleBtn.addEventListener("click" , cb => {
		console.log("BATTLE BTN!");
		// TODO --> Change for template Engine
		// getTemplate("GET","battle",printUI);
	});
	// GAME BUTTON
	var gameBtn = document.querySelector(".btn-game");
	gameBtn.addEventListener("click" , cb => {
		console.log("GAME BTN!");
		// TODO --> Change for template Engine
		// getTemplate("GET","game",printUI);
	});
	// RANKING BUTTON
	var rankingBtn = document.querySelector(".btn-ranking");
	rankingBtn.addEventListener("click" , cb => {
		console.log("RANKING BTN!");
		window.location = "./ranking";
		// TODO --> Change for template Engine
		// getTemplate("GET","ranking",printUI);
	});

	return {
		signOut: signOut
	}

})();