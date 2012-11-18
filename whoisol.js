#!/usr/local/bin/node

var crypto = require('crypto')
var input = require('commander')
var fs = require('fs')
var Facebook = require('./facebook.js');


var encrypt = function (text,password){
		var cipher = crypto.createCipher('aes-256-cbc',this.password)
		var crypted = cipher.update(text,'utf8','hex')
		crypted += cipher.final('hex');
		return crypted;
}

var decrypt = function(text,password,callback){
	var decipher = crypto.createDecipher('aes-256-cbc',password)
	var dec = decipher.update(text,'hex','utf8')
	dec += decipher.final('utf8');
	callback(dec);
}

var readAccessToken = function(callback){
	input.password("Enter password : ",function readPassword(password){
		process.stdin.destroy();
		cipherText = fs.readFileSync('access_token','ascii')
		decrypt(cipherText,password,callback)
	})
}

readAccessToken(function gotAccessToken(accessToken){
	var app = new Facebook(accessToken);

	query = 'SELECT online_presence,name FROM user WHERE online_presence '
	+ 'IN ("active","idle") AND uid IN (SELECT uid2 FROM friend WHERE '
	+ 'uid1 = me()) ORDER BY online_presence';

	app.fqlQuery(query, function(d){
		var res = JSON.parse(d);
		console.log("\nStatus" + "\t  " + "Friend\n");
		for(var i=0,len = res.data.length;i<len;i++){
			console.log(res.data[i].online_presence + "\t  "+res.data[i].name);
		}
		console.log('\n');
	});
});
