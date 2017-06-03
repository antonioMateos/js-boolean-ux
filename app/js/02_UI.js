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