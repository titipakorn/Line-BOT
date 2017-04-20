const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');
const firebase = require('firebase');

//firebase initialize
var config = {
    apiKey: "AIzaSyCv4o01sEGSFPj6q5WglthKYF2_p_60Qkg",
    authDomain: "line-bot-c1670.firebaseapp.com",
    databaseURL: "https://line-bot-c1670.firebaseio.com",
    projectId: "line-bot-c1670",
    storageBucket: "line-bot-c1670.appspot.com",
    messagingSenderId: "369577845897"
  };
firebase.initializeApp(config);
const bot = linebot({
	channelId: "1511273166",
	channelSecret: "1e292d52e597d4ece66b0e6a3a553f53",
	channelAccessToken: "wpiByFfMb6rXbEG9X2kM2vo6XH8Et2N1EfH6up/4DVEnfbGiiEuAYBSIVMzKi38R62i62M3ImCK3OofegCvu55gVQ3q+CoSVaEamgtgTCvQKxiFgY7STL9jZk02/Sx4JS6FFEu4UqYV7RKZWMOhGlwdB04t89/1O/w1cDnyilFU=",
});

bot.on('message', function (event) {
  console.log("MESSAGE::",event.message.text)
	event.reply(event.message.text).then(function (data) {
    var postsRef = firebase.database().ref('line').child("posts");
    postsRef.push().set({
      message: event.message.text
    });
		// success
    console.log("SENT")
	}).catch(function (error) {
		// error
	});
});

bot.listen('/linewebhook', process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});
