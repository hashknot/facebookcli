#!/usr/local/bin/node

var crypto = require('crypto');
var input = require('commander');
var fs = require('fs');
var Facebook = require('./facebook.js');

var encrypt = function (text,password){
	var cipher = crypto.createCipher('aes-256-cbc',this.password);
	var crypted = cipher.update(text,'utf8','hex');
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
	});
}

readAccessToken(function gotAccessToken(accessToken){
	var app = new Facebook(accessToken);

	var queries = {};

	queries.onlineFriends = 'SELECT online_presence,name FROM user WHERE '
	+ 'online_presence IN ("active","idle") AND uid IN (SELECT uid2 FROM '
	+ 'friend WHERE uid1 = me()) ORDER BY online_presence';

	queries.unreadMessages =  'SELECT sender,body,timestamp FROM unified_message'
	+ ' WHERE thread_id IN (SELECT thread_id FROM unified_thread WHERE'
	+ ' has_tags("inbox") AND unread=1) AND unread!=0 ORDER BY timestamp DESC';

	queries.notifications = 'SELECT sender_id,title_text,body_text FROM '
	+ 'notification WHERE recipient_id = me() AND is_unread!=0 ORDER BY '
	+ 'updated_time ASC';

	var query = JSON.stringify(queries);

	app.query(query, function(d){
		var res = JSON.parse(d).data;

		for( var i = 0; i < res.length; i++ ){
			switch(res[i].name){

				case 'onlineFriends' :
				var onlineFriends =  res[i].fql_result_set;
				console.log("\nStatus" + "\t  " + "Friend\n");
				for( var j=0,len = onlineFriends.length ; j<len ; j++ ){
					 console.log(onlineFriends[j].online_presence + "\t  "
					 + onlineFriends[j].name);
				}
				console.log('\n');
				break;

				case 'unreadMessages':
				var unreadMessages =  res[i].fql_result_set;
				console.log("\n\nUnread Messages\n");
				for( var j=0,len = unreadMessages.length ; j<len ; j++ ){
					 console.log(unreadMessages[j].sender.name + "\t : "
					 + unreadMessages[j].body);
				}
				break;

				case 'notifications':
				var notifications =  res[i].fql_result_set;
				console.log("\n\n\Notifications\n\n");
				for( var j=0,len = notifications.length ; j<len ; j++ ){
					 console.log(notifications[j].title_text + " : "
					 + notifications[j].body_text);
				}
				break;
			}
		}
		console.log("\n\n")
	});
});
