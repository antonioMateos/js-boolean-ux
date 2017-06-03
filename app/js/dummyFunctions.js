console.log("DUMMY FN");

var email;
var l = 20;

var randomStatus = []
randomStatus[0] = "online";
randomStatus[1] = "offline";
randomStatus[2] = "busy";

var queryID = firebase.database().ref().child('querySearch');
var users = firebase.database().ref().child('users');

// CREATE DUMMY USERS
function dummyUser(){

	for(var i=1;i<=l;i++) {

		console.log("Dummy User:","dummy-"+i+"@email.com");
		console.log("https://api.adorable.io/avatars/100/dummy-"+i+".png");

		// 0 -> 2
		var j = Math.floor(Math.random() * 3);
		console.log(randomStatus[j]);

		// Random points
		var h = Math.floor(Math.random() * 500) + 1;
		// Points for reverse order
		var hO = h*(-1);
	  
		users.push({
			// PROFILE INFO from Social Media
			id: "dummy-"+i+"@email.com",
			status: randomStatus[j],
			name: "Dummy Name "+i,
			photo: "https://api.adorable.io/avatars/100/dummy-"+i+".png",
			provider: "facebook",
			// GAME INFO
			rank: i, // TODO --> Calcular en real time segun points?
			points: h,
			orderPoints: hO,
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

		queryID.push({
			id: "dummy-"+i+"@email.com"
		});

	}

};

//UPDATE DUMMY USERS
function updateDummies(stuff){

	var updateRef = users.orderByValue();

	updateRef.once("value", function(snapshot){

		var q = snapshot.val();
		//q = snapshot.name;

		snapshot.forEach(
			function(data){
				//console.log(data.key);
				var who = data.key;
				//console.log(data.child('id').val());
				updateData(who,data,stuff);
			}
        )

	});

	function updateData(key,snapshot,stuff){

		// Random points
		//var h = Math.floor(Math.random() * 800) + 500;
		//console.log(what+" "+h);

		// REMOVE A SPECIFIC CHILD
		//var target = snapshot.child(who);
		//console.log("Target1",target);
		//target.child(<child to remove>).remove();

		// UPDATE SPECIFIC CHILD VALUE --> NOT WORKING
		//var target = snapshot.child(who);
		//var target = users.child(who).child(what);
		//console.log("Target2",target.key+" "+target.getValue+" > New val > "+h);

		var up = firebase.database().ref('users/'+key);
		up.update({
			status: stuff
		});
		/*
		up.update({
		    points: uP,
		    orderPoints: uOP,
		    games:{
				total: uGT,
				success: uGS,
				fails: uGF
		    }
		});
		*/
		
	}

};