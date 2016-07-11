var Discord = require('discord.io');
var storage = require('node-persist');
// var steamServerStatus = require('steam-server-status');
var request = require("request");
var fs = require("fs");
var timeout = 7200;
var gamemodes = [ 'ffa', 'ctf', 'run', '1v1', 'tdm', 'atdm', '2v2', '3v3' ];

/**
 * Discord application token - get it from
 * https://discordapp.com/developers/applications/me/ **
 */
var dicordtoken = "";
// you must first call storage.init or storage.initSync
storage.initSync();

var bot = new Discord.Client({
	autorun : true,
	token : dicordtoken
});

bot.on('ready', function(event) {
	console.log('Logged in as %s - %s\n', bot.username, bot.id);
});

bot.on('message', function(user, userID, channelID, message, event) {
	/*
	 * console.log(user) console.log(userID) console.log(channelID)
	 * console.log(message) console.log(bot.fixMessage(message))
	 */
	if (message === "!sup") {
		bot.sendMessage({
			to : channelID,
			message : "```gimme a break```"
		});

	}
	;

	if (message === "!help") {
		var help = fs.readFileSync('help.txt');
		bot.sendMessage({
			to : channelID,
			message : help
		});
	}
	;
	function getPlayerPerMode(mode, channelid) {
		var i = 0;
		storage.forEach(function(key, value) {
			var pasttime = unix - timeout;

			if (value.mode === mode && channelID === value.channelid
					&& value.tstamp >= pasttime)
				i++;

		});
		return i;
	}

	/** function to add player to queue accept string("mode") */
	function add(mode) {
		console.log(mode);
		/** remove old entries * */
		var unix = Math.round(+new Date() / 1000);
		storage.forEach(function(key, value) {
			var pasttime = unix - timeout;
			if (value.timestamp < (pasttime)) {
				console.log(pasttime + " " + value.timestamp
						+ " entry too old!");
				storage.removeItemSync(key);
			}
		});

		storage.forEach(function(key, value) {
			var pasttime = unix - timeout;
			if (value.mode === mode && channelID === value.channelid
					&& value.tstamp >= pasttime)
				bot.sendMessage({
					to : key,
					message : "```" + value.name + " is ready to play "
							+ value.mode + "```"
				});

		});
		storage.setItem(userID, {
			name : user,
			mode : mode,
			channelid : channelID,
			tstamp : unix
		});
		bot.sendMessage({
			to : channelID,
			message : "```" + user + " added to " + mode + " queue" + "```"
		});

	}
	/** if gamemode is called add to queue * */
	gamemodes.forEach(function(value) {
		if (message === "!add " + value) {
			add(value);
		}
	});
	/** ** remove from queue *** */
	if (message === "!remove") {
		storage.removeItemSync(userID);
		bot.sendMessage({
			to : channelID,
			message : "```" + user + " removed from queue" + "```"
		});
	}
	;

	if (message === "!list") {
		/** remove old entries * */
		var unix = Math.round(+new Date() / 1000);
		storage
				.forEach(function(key, value) {
					console.log(value.channelid);

					var pasttime = unix - timeout;
					console.log(pasttime + " " + value.tstamp);
					if (value.tstamp < (pasttime)) {
						console.log(pasttime + " " + value.tstamp
								+ " entry too old!");
						storage.removeItemSync(key);
					}

					if (channelID == value.channelid
							&& value.tstamp >= (pasttime)) {
						var totalPlayer = getPlayerPerMode(value.mode,
								value.channelid);
						bot.sendMessage({
							to : channelID,
							message : "```Player queue: " + value.name
									+ " Mode: " + value.mode
									+ ", total player in " + value.mode
									+ " queue " + totalPlayer + " ```"
						});
					}
				});

	}
	;

	/** ** supported gamemodes *** */
	if (message === "!modes") {
		bot.sendMessage({
			to : channelID,
			message : "```Supported game modes are: " + gamemodes.toString()
					+ ". Type !add gamemode (e.g. !add 1v1) to add to queue```"
		});
	}
	;

});
