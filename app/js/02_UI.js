console.info("- - - UI JS - - -");

function loadUI(template){

	console.log("UI -> ",template);

	if(template === "login"){

		// FIX TO DELEGATE EVENTS
		var logInBtn = document.querySelector(".btn-logIn");

		logInBtn.addEventListener("click" , cb => {
			var from = logInBtn.getAttribute("data-social");
			console.log("Log me in!");
			signIn(from);
		});

		var logInGit = document.querySelector(".btn-git");

		logInGit.addEventListener("click" , cb => {
			var from = logInGit.getAttribute("data-social");
			console.log("Log me in!");
			signIn(from);
		});

	};

};