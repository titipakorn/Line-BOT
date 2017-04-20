const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');

const bot = linebot({
	channelId: "1511273166",
	channelSecret: "1e292d52e597d4ece66b0e6a3a553f53",
	channelAccessToken: "wpiByFfMb6rXbEG9X2kM2vo6XH8Et2N1EfH6up/4DVEnfbGiiEuAYBSIVMzKi38R62i62M3ImCK3OofegCvu55gVQ3q+CoSVaEamgtgTCvQKxiFgY7STL9jZk02/Sx4JS6FFEu4UqYV7RKZWMOhGlwdB04t89/1O/w1cDnyilFU=",
});

bot.on('message', function (event) {
  console.log("MESSAGE::",event.message.text)
	event.reply(event.message.text).then(function (data) {
		// success
    console.log("SENT")
	}).catch(function (error) {
		// error
	});
});

bot.listen('/linewebhook', process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});
