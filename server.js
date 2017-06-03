//'use strict';
var express = require('express');
var app     = express();
var path    = require('path');
var http	= require('http').Server(app);
var bodyParser = require('body-parser');
var Firebase = require('firebase');

console.log('Iniciando entorno');

// CORS --> Cabeceras correctas
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
// Parsers --> Poder mandar y recibir JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

console.log('Middlewares cargados...');

// TEMPLATES
// ROUTES
// FRONT
console.log('FRONT ROUTES');
app.use(express.static(__dirname + '/app'));

app.get('/ranking', function (request, response, next) {
	//response.send('RANKING!');
	response.sendFile(path.join(__dirname+'/app/templates/ranking.html'));
});

app.get('/templates/battle', function (request, response, next) {
	//response.send('BATTLE!');
	response.sendFile(path.join(__dirname+'/app/templates/battle.html'));
});

app.get('/game', function (request, response, next) {
	//response.send('GAME!');
	response.sendFile(path.join(__dirname+'/app/templates/game.html'));
});

// TEMPLATES // Only for index/login
fs = require('fs');
// fs.readFile(file, [encoding], [callback]);
// file = (string) filepath of the file to read
var template;

fs.readFile(__dirname+'/app/templates/login.html', 'utf8', function (err,data) {
  if (err) {
    return console.log('FS reading E:',err);
  }
  template = data;
  console.log('FS reading Template');
});

// Index Login
app.get('/login', function(request, response) {
	return response.status(200).send(template);
});

// Profile
app.get('/profile', function(request, response) {
	response.sendFile(path.join(__dirname+'/app/templates/profile.html'));
	//return response.status(200).send(template);
});

// END TEMPLATES
console.log('END FRONT ROUTES');

// Controllers
// FIREBASE DB
var config = require('./fibConfig');
var controlLogin = require('./controllers/login');
var controlUsers = require('./controllers/users');

console.log('END CONTROLLERS');

// API
console.log('API ROUTES');
// get an instance of the router for api routes
var myApi = express.Router();

// API Index (GET http://localhost:+PORT+/api/)
myApi.get('/', function(request, response) {
  response.json({ message: 'Welcome to the coolest API on earth!' });
});

// API /USERS
// GET CURRENT User
myApi.route('/users/:id')
	.get(controlUsers.userLogged)
	.put(controlUsers.updateUser)
	.delete(controlUsers.deleteUser);

// POST New User
myApi.route('/users')
	.post(controlUsers.addUser);

// GET ALL Users
myApi.route('/users/')
	.get(controlUsers.allUsers);

// POST Authenticate --> Users on server (POST http://localhost:+PORT+/api/authenticate)
myApi.route('/authenticate')
	.post(controlLogin.authUser); //--> TODO --> AUTH ON SERVER SIDE

// apply the routes to our application with the prefix /api
app.use('/api', myApi);

console.log('END API ROUTES');
// END ROUTES

// USERS ONLINE STATUS
// SOCKET IO & Stuff
var io = require("socket.io")(http); // app or http ??? 
var users = [];

io.on('connection', function(socket){

	var userKey;
	var userEmail;

	socket.on('user-connected', function(data) {
		console.log("Client connected",data.user,socket.id);
		userKey = data.user;
		controlUsers.updateUserStatus(userKey,"online");
	});
	socket.on('user-playing', function(data) {
		console.log("Client playing",data.user,socket.id);
		userKey = data.user;
		controlUsers.updateUserStatus(userKey,"playing");
	});
	socket.on('disconnect', function(){
		console.log("Client des-conectado",userKey,socket.id);
		controlUsers.updateUserStatus(userKey,"offline");
	});
	// TODO --> Playing / Busy Status
	// socket.on('playing',function(){ changeUser Status 2 playing / busy in Firebase});
		// --> fibRef.userKey.status.update("busy");
	// STANDARD
	/*
	socket.on('new-message', function(data) {
		//messages.push(data);
		console.log(data.text);
		io.sockets.emit('messages', messages);
	});
	*/
});

// STARTING SERVER
http.listen(process.env.PORT || 3000, function () {
  console.log('- - - START SERVER - - -\n');
  console.log('Server Listening on http://localhost:' + (process.env.PORT || 3000))
});