var myApp = myApp || {};
var ranking = myApp.ranking || {};

ranking = (function(){

	console.info("- - - DOM RANKING - - -");

	var rankingUI = document.querySelector(".ranking");
	
	var list = [];

	var rankingPosition;

	users.orderByChild("orderPoints").on("value",function(snapshot){

		user = snapshot.val();
		list = [];
		rankingPosition = 0;

		if(!user){

			rankingUI.innerHTML = "<div class='clearfix text-center mtxl'>Wait loading...</div>";

		} else {

			snapshot.forEach(function(child) {

				//console.log("SN",child.key); // NOW THE CHILDREN PRINT IN ORDER
				var key = child.key;

	            var name = user[key].name ;
	            var status = user[key].status;
	            var photo = user[key].photo;
	            var name = user[key].name;
	            var id = user[key].id;
	            var points = user[key].points;
	            rankingPosition += 1;
	            	
                list.push({
                    name: name,
                    status: status,
                    photo: photo,
                    id: id,
                    points: points,
                    rankingPosition: rankingPosition
                });
                
                //console.log(user[key].points,name);

		    });
			
			refreshUI(list);

		}

	});

	function refreshUI(list){

		//console.log("Refresh UI");

		rankingUI.innerHTML = "";
		var htmlOUTPUT = "";

		for(var i = 0; i < list.length - 1; i++){

			//console.log(list[i].id,list[i].points,"#"+list[i].rankingPosition);

			htmlOUTPUT += "<div class='clearfix item-list user-data "+list[i].status+"'>";
			htmlOUTPUT += "<div class='user-img'>";
			htmlOUTPUT += "<img src='"+list[i].photo+"' />";
			htmlOUTPUT += "</div>"
			htmlOUTPUT += "<div class='user-info'>";
			htmlOUTPUT += "<h1 class='user-name'>"+list[i].name+"</h1>";
			htmlOUTPUT += "<h2 class='user-email'>"+list[i].id+"</h2>";
			htmlOUTPUT += "<h3 class='clearfix user-points'>"+list[i].points+" points</h3>";
			htmlOUTPUT += "<h2 class='clearfix user-rank'>#"+list[i].rankingPosition+"</h2>";
			htmlOUTPUT += "</div>";
			htmlOUTPUT += "</div>";

		};

		rankingUI.innerHTML += htmlOUTPUT;

	};

})();