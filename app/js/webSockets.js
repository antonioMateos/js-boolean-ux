// USER ID FOR STATUS TO SERVER SIDE WITH SOCKET io
var socket = io();

socket.on('connect', function(userKey){

  var c = 0;
  var userKey;
  var userEmail;
  var T;

  //console.log("socket ON");

  function userConnected(e){

    //console.log("WS function connnected");

    c += 1;

    userKey = loadUser.getUserKey();
    userEmail = loadUser.getUserEmail;
    //console.log("WS",c,userKey);

    if(userKey === undefined || userKey === ""){

      //console.log(c,"NOT YET!");
      T = setTimeout(function(){userConnected()},500);

    } else {

      //console.log("WS ok",userKey);

      var msg = {
        user: userKey,
        email: userEmail
      }

      socket.emit('user-connected', msg);
      //console.log("WS msg",msg)
      clearTimeout(T);
      return false;

    };

  };

  userConnected();

});