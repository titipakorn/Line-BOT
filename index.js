const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');

const bot = linebot({
	channelId: "1511273166",
	channelSecret: "1e292d52e597d4ece66b0e6a3a553f53",
	channelAccessToken: "wpiByFfMb6rXbEG9X2kM2vo6XH8Et2N1EfH6up/4DVEnfbGiiEuAYBSIVMzKi38R62i62M3ImCK3OofegCvu55gVQ3q+CoSVaEamgtgTCvQKxiFgY7STL9jZk02/Sx4JS6FFEu4UqYV7RKZWMOhGlwdB04t89/1O/w1cDnyilFU=",
});

const app = express();

const parser = bodyParser.json({
	verify: function (req, res, buf, encoding) {
		req.rawBody = buf.toString(encoding);
	}
});

app.post('/linewebhook', parser, function (req, res) {
	console.log('Log', req.get('X-Line-Signature'));
	console.log('Body', req.rawBody);
	if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
		return res.sendStatus(400);
	}
	bot.parse(req.body);
	return res.json({
		status: 'Working'
	});
});

app.get('/', function (req, res) {
	return res.json({
		status: 'Working'
	});
});

var count = 10;
var message =
`สรุป
 1. ไปเที่ยว 1-2 Jul 2017
    > พะเนินทุ่ง ทะเลหมอก นั่งโฟวิลขึ้น
 2. ไปเวียดนามมมมมม (น้าม ก้อย กอล์ฟ บูม บอส เล็ก : TBD)
 3. งานแต่งจอร์ส ไม่เอา stamp & ข้าวกล่อง 7-11 นะคุณบอส
`;

bot.on('message', function (event) {

	count++;
	if (count === 20) {

		event.reply(message).then(function (data) {

		count = 0;

		}).catch(function (error) {
			console.log('Error', error);
		});
	}

});


app.listen(process.env.PORT || 3000, function () {
	console.log('LineBot is running.');
});
