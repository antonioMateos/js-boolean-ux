var myApp = myApp || {};
var myGame = myApp.myGame || {};

myGame = (function(){

	console.info("- - - DOM GAME - - -");

	// DOM ELEMENTS
	var shapeView = document.querySelector(".shapeWrapper .shape");
	var shapeIntro = document.querySelector(".shapeIntro");
	var shapeText = document.querySelector(".shapeWrapper .shapeType p");
	var headText = document.querySelector(".head-info p");
	// COMMENT DELETE printStatus() when DONE

	var game = {

		// Main event --> Game status -> ON / OFF / Loading 
		status: "OFF",
		successPoints: 10,
		rounds: 50,	
		time: 15,

		// Calcular Partida --> loadGame()
		loadGame: function(){
			// init Game
				// on load --> Game status Loading
				game.status = "loading";
				printStatus("Loading Game");
				// UI
					// UI --> No Shape --> TODO
					// Txt Shape --> Loading
					shapeText.innerHTML = "Loading Game";

				var p = game.rounds; // Number of plays

				for(var n=1;n<=p;n++){
					// Random Shape and text --> 0 -> 1
					var s = Math.floor(Math.random() * 2);
					// SHAPE
					if(s === 1){
						s="square";
					}else{
						s="circle";
					}

					game.plays.push(s);

					if(n === p){
						//console.log(game.plays);
						game.startGame();	
					}
				};

				var btnClose = document.querySelector(".btn-Stop");
				btnClose.addEventListener("click" , cb => {
					// TODO --> Load OVERLAY 
						// BTN -> Back to profile? --> Using template Engine
								  // getTemplate("GET","profile",printUI);
						// BTN -> Continue Game --> STOP time
					window.location = "./profile";
				});

			//UPDATE USER STATUS
			console.log("user playing");
			userKey = loadUser.getUserKey();
			
			var msg = {
		      user: userKey
		    }

		    socket.emit('user-playing', msg);

		},

		// gameArray of Objects === N*plays
		plays: [],

		// Game Start
		startGame: function(){
			printStatus("GAME READY");
			// UI --> READY / STEADY / GO!
			var countText;
			var c = 0;

			shapeText.innerHTML = game.time+" s";

			function showStatus(){
				c++;
				if(c===1){
					countText = "Ready";
				}else if(c===2){
					countText = "Steady";
				}else if(c===3){
					countText = "GO!";
					game.status = "ready";
					// Start Timer
					game.timer("start");
					shapeIntro.classList.add("show");
					c=0;
				}
				if(c!=0){
					setTimeout(function(){showStatus()}, 1000);
				}
				headText.innerHTML = countText;
			}
			showStatus();
		},

		// START PLAYING
		playGame: function(){

			game.status = "On";
			printStatus("PLAYING");
				//console.log(game.plays);
			// START Controls
			game.controls(game.plays);

		},

		// Controls
		controls: function(){

			var i = 0;
			var l = game.plays.length;

			printPlay();

			function printPlay(){

				//console.log("- Play no",i+1+" - - - - - -")
				//console.log("UI Shape",game.plays[i]);

				var shapeClass = shapeView.classList.contains("circle");
				//console.log(shapeClass);

				// Print shapeView
				if(game.plays[i] === "circle"){

					if(!shapeClass){
						shapeView.classList.add("circle");
					}

				}else if(game.plays[i] != "circle"){

					if(shapeClass){
						shapeView.classList.remove("circle");
					}

				}
			
			};

			var btnCircle = document.querySelector(".btn-circle");
			var btnSquare = document.querySelector(".btn-square");

			var controlsEvents = function (e) {
			    if (e.keyCode === 37) {
			        compare("circle");
			    } else if (e.keyCode === 39) {
			        compare("square");
			    } else {
			    	return false;
			    };
			    console.log(game.status);
			};

			if(game.status!=="On"){
				console.log("Remove evnts");
				// ISSUE --> Key Events Not removing
				window.removeEventListener('keydown', controlsEvents);
			}else{
				console.log("Add evnts");
				window.addEventListener('keydown', controlsEvents);
			}

			// Compare Values
			function compare(btnValue){
				if(i<=l-1){
					var bV = btnValue;
					var gV = game.plays[i];
					if(bV === gV){
						game.userScore.push(1);
						console.log("Success +",game.userScore[i]);
					}else{
						game.userScore.push(0);
						console.log("Fail +",game.userScore[i]);
					}
					// New Play
					i = i + 1;
					printPlay(i);
					//btnYes.classList.remove('active');
					//btnNo.classList.remove('active');
				}else{
					game.timer("stop");
					game.resumen();
				}
			};
				
		},

		// Timer
		timer: function(timerStatus){

			var t = game.time;
			var tS = timerStatus;
			var T;

			updateTime(tS);
			game.playGame();

			function updateTime(){

				t -= 1;
				shapeText.innerHTML = t;
				console.log(t);
				T = setTimeout(function(){updateTime()}, 1000);
				
				// ISSUE --> FIX CLOCK NOT STOPPING
				if(tS==="stop"){

					clearTimeout(T);
					game.resumen();

				}else if(t<=0 || tS==="stop"){

					clearTimeout(T);
					tS = "stop";
					game.resumen();

				}

				//Console Counter
				//console.log(t,tS);

			}

		},

		// User Score
		userScore: [],

		// Resumen
		resumen: function(){

			game.status = "end";
			printStatus("END");
			shapeText.innerHTML = "END";
			headText.innerHTML = "";
			game.controls(game.status);
			
			var points = 0;
			var success = 0;
			var fails = 0;

			totalScore();

			function totalScore(){

				// SOLO CONTAR LAS JUGADAS
				var l = game.userScore.length;

				for(var i=0; i<l-1; i++){
					if(game.userScore[i] === 1){
						points += game.successPoints;
						//console.log("Points:",points);
						success += 1;
						//console.log("Success:",success);
					}else{
						fails += 1;
						//console.log("Fails:",fails);
					}
				};

				console.log("TP",points,"TS",success,"TF",fails);
				showResults(points,success,fails);
				game.updateUserProfile(points,success,fails);

			};

			function showResults(points,success,fails){
				// UI -> Show Overlay
				var overlay = document.querySelector(".overlay");
				overlay.classList.add("show");

				var target = document.querySelector(".overlay .content");
				target.innerHTML = "";
				var content = "<div class='gameResumen font12'>";
				content += "<p class='font15 mbm'>TIME OUT!</p>";
				content += "<p class='points'>Total Points<br><span class='font15'>"+points+"</span></p>";
				content += "<p class='success'>Total Success<br><span class='font15'>"+success+"</span></p>";
				content += "<p class='fails'>Total Fails<br><span class='font15'>"+fails+"</span></p>";
				// BTN Play again
					content += "<button class='btn btn-primary btn-again clearfix mvm'>Play Again?</button>";
				// BTN Back to profile
					content += "<button class='btn btn-primary btn-back clearfix'>Back To Profile</button>";
				// TODO --> ADD BTN Close App
				content += "</div>";
				target.innerHTML = content;

				// Play Again
				var btnAgain = document.querySelector(".btn-again");
				btnAgain.addEventListener("click" , cb => {
					overlay.classList.remove("show");
					target.innerHTML = "";
					game.userScore = [];
					game.loadGame();
				});
				// Back To Profile
				var btnBack = document.querySelector(".btn-back");
				btnBack.addEventListener("click" , cb => {
					// TODO --> Change for template load
					// getTemplate("GET","profile",printUI);
					window.location = "./profile";
				});
			
			};

		},

		// Update Fib
		updateUserProfile: function(points,success,fails){
			// Update User Firebase DB
			var users = firebase.database().ref().child('users');
			var user = firebase.auth().currentUser;
			var uEmail = user.email;
			var userInfo;
			var userKey;

			users.orderByChild("id").on("child_added", function(snapshot) {
				if(uEmail === snapshot.val().id){
					userInfo = snapshot.val();
					userKey = snapshot.key;
					updateUserScores(userInfo,userKey);
				} else if(user){
					//console.info("Load user ERROR: User logged but not found in Firebase");
				}
			});

			function updateUserScores(user,key){

				// USER PATH TO UPDATE
				var u = firebase.database().ref('users/'+key);

				var uP = user.points;
				uP += points;
				var uOP = user.orderPoints;
				uOP -= points
				var uGT = user.games.total;
				uGT += 1;
				var uGS = user.games.success;
				uGS += success;
				var uGF = user.games.fails;
				uGF += fails;

				/*			
				console.log("P",uP,user.points);
				console.log("OP",uOP,user.orderPoints);
				console.log("GS",uGS,user.games.success);
				console.log("GT",uGT,user.games.total);
				console.log("GF",uGF,user.games.fails);
				*/

				u.update({
				    points: uP,
				    orderPoints: uOP,
				    games:{
						total: uGT,
						success: uGS,
						fails: uGF
				    }
				});

			}
		}

	};

	//EVENTS
		// on Game.status off
			// init
		// on Game.status loading
			//loadGame();
			game.loadGame();
		// on Game.status ready
			//startGame();
			//game.startGame();
		// on Game.status on
			// playGame();
		// on Game.status stop
			// onClick --> btn-Close
			// Stop timer ??
			// Open Overlay
				// Quit -> Yes or No? (Back or keep playing)
		// on Game.status end
			// Resumen
				// Game.status === Off

	//Console Printing
	function printStatus(where){
		console.log("Game Status:",game.status+" -> "+where)
	};

}());