var crypto = require('crypto');
var input = require('commander');
var fs = require('fs');
var path = require('path');
var Facebook = require('./api.js');

var app = new Facebook();

var init = function(callback,password){
	readAccessToken(function(accessToken){
		app.accessToken = accessToken;
		callback();
	},password);
};

var setup = function(callback){
	app.authorize(saveAccessToken);
};

var saveAccessToken = function(accessToken){
	newPassword(function(password){
		var ciphertxt = encrypt(accessToken,password);
		fs.writeFileSync('access_token',ciphertxt,'ascii');
		console.log('Auth Complete');
	});
};

var newPassword = function(validPassCallback){
	console.log("\nThis password is for accessing this app."+
	"\n\n**AVOID ENTERING YOUR FACEBOOK ACCOUNT PASSWORD.**\n\n");
	input.password("Enter Password : ",function(password){
		input.password("Enter Password Again : ",function(confirmPass){
			if(password !== confirmPass){
				console.log("Passwords do not match.\n");
				newPassword(validPassCallback);
			}
			else
				validPassCallback(password);
		});
	});
};

var readAccessToken = function(callback,password){
	var readPassword =  function(pass){
		cipherText=fs.readFileSync(path.resolve(__dirname,'access_token'),'ascii');
		decrypt(cipherText,pass,callback);
	};
	if(typeof(password) === "undefined" || password === null){
		input.password("Enter password : ",readPassword);
	}
	else{
		readPassword(password);
	}
};


var unreadMessages = {};
unreadMessages.raw = null;
unreadMessages.data = null;
unreadMessages.query = 'SELECT sender,body,timestamp FROM unified_message' +
	' WHERE thread_id IN (SELECT thread_id FROM unified_thread WHERE' +
	' has_tags("inbox") AND unread=1) AND unread!=0 ORDER BY timestamp DESC';

unreadMessages.get = function(callback){
	var that = this;
	app.query(this.query,function(d){
		that.raw = d;
		that.data = JSON.parse(that.raw).data;
		callback(that.data);
	});
};

unreadMessages.display = function(data){
	if(data == undefined)
		data = this.data;
	for( var j=0,len = data.length ; j<len ; j++ ){
		console.log(data[j].sender.name + "\t : " + data[j].body);
	}
};


var notifications = {};
notifications.raw = null;
notifications.data = null;
notifications.query = 'SELECT sender_id,title_text,body_text FROM ' +
	'notification WHERE recipient_id = me() AND is_unread!=0 ORDER BY ' +
	'updated_time ASC';

notifications.get = function(callback){
	var that = this;
	app.query(this.query,function(d){
		that.raw = d;
		that.data = JSON.parse(that.raw).data;
		callback(that.data);
	});
};

notifications.display = function(data){
	if(data == undefined)
		data = this.data;
	for( var j=0,len = data.length ; j<len ; j++ ){
		console.log(data[j].title_text + " : " + data[j].body_text);
	}
};


var onlineFriends = {};
onlineFriends.raw = null;
onlineFriends.data = null;
onlineFriends.query = 'SELECT online_presence,name FROM user WHERE ' +
	'online_presence IN ("active","idle") AND uid IN (SELECT uid2 FROM ' +
	'friend WHERE uid1 = me()) ORDER BY name';

onlineFriends.get = function(callback){
	var that = this;
	app.query(this.query,function(d){
		that.raw = d;
		that.data = JSON.parse(that.raw).data;
		callback(that.data);
	});
};

onlineFriends.display = function(data){
	if(data == undefined)
		data = this.data;
	for( var j=0,len = data.length ; j<len ; j++ ){
		console.log(data[j].online_presence + "\t  " + data[j].name);
	}
};

var allInfo = {};
allInfo.raw = null;
allInfo.data = null;
allInfo.query = function(){
	var query = {};
	query.unreadMessages = unreadMessages.query;
	query.onlineFriends = onlineFriends.query;
	query.notifications = notifications.query;
	return JSON.stringify(query);
};

allInfo.get = function(callback){
	var that = this;
	app.query(this.query(),function(d){
		that.raw = d;
		that.data = JSON.parse(that.raw).data;
		callback(that.data);
	});
};

allInfo.display = function(data){
	if(data == undefined)
		data = this.data;
	var chunk=null;
	for( var i = 0; i < data.length; i++ ){
		switch(data[i].name){

			case 'onlineFriends' :
				chunk =  data[i].fql_result_set;
				console.log("\nOnline Friends\n\nStatus" + "\t  " + "Friend\n");
				onlineFriends.display(chunk);
				console.log('');
				break;

			case 'unreadMessages':
				chunk =  data[i].fql_result_set;
				console.log("\n\nUnread Messages\n");
				unreadMessages.display(chunk);
				console.log('');
				break;

			case 'notifications':
				chunk =  data[i].fql_result_set;
				console.log("\n\nNotifications\n");
				notifications.display(chunk);
				console.log('');
				break;

			default:
				console.log('Oops! Something went wrong');
				break;
		}
	}
};


fqlQuery = function(query, callback){
	app.query(query,function(d){
		callback(JSON.parse(d));
	});
};


module.exports.onlineFriends = onlineFriends;
module.exports.query = fqlQuery;
module.exports.notifications = notifications;
module.exports.unreadMessages = unreadMessages;
module.exports.allInfo = allInfo;
module.exports.setup = setup;
module.exports.init = init;

/*
 * Private functions encrypt/decrypt
 */
var encrypt = function (text,password){
	var cipher = crypto.createCipher('aes-256-cbc',password);
	var crypted = cipher.update(text,'utf8','hex');
	crypted += cipher.final('hex');
	return crypted;
};

var decrypt = function(text,password,callback){
	var decipher = crypto.createDecipher('aes-256-cbc',password)
	var dec = decipher.update(text,'hex','utf8');
	dec += decipher.final('utf8');
	callback(dec);
};
