console.info("- - - APP JS - - -");
var template; // For prototyping

// TEMPLATE ENGINE CLIENT SIDE
function getTemplate(method,template,callback){

	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function() {
        
        if (xmlHttp.readyState === 4) {

            if (xmlHttp.status >= 100 && xmlHttp.status <= 399) {

                var data = xmlHttp.responseText;
                callback(data,template);

            } else if (xmlHttp.status >= 400 && xmlHttp.status <= 600) {
                console.info("ERROR!");
                console.warn(xmlHttp.responseText);
            }
        }
    };

    var serverURL = "./"+template;

    xmlHttp.open(method, serverURL, true);
    xmlHttp.send();

};

function printUI(data,template){

	var ui = document.querySelector(".main");
	ui.innerHTML = data;
	loadUI(template);

};

// INI APP
getTemplate("GET","login",printUI);

// END TEMPLATE ENGINE CLIENT SIDE
