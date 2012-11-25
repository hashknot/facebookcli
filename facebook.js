
var https = require('https');
var fs = require('fs');

function Facebook(accessToken){
  this.accessToken = accessToken;
	var manifest = JSON.parse(fs.readFileSync("manifest.json"));
	this.appId = manifest.appId;
  this.appSecret = manifest.appSecret;
  this.permissions = manifest.permissions;
	this.appUrl = 'http://localhost:16792/';
}

Facebook.prototype.query = function(query,callback){
  var connectOptions = { host: 'graph.facebook.com',
	port: 443,
	path:'/fql?q=' ,
	method: 'GET'
  };
  connectOptions.path += encodeURIComponent(query) + '&' + this.accessToken;
	var request = https.request(connectOptions, function(response){
		if(response.statusCode == 400){
			console.log("\n\nOops! Something went wrong\n\nHere's what I know :" + 
			"\n\nResponse HTTP Code : 400");
			console.log(response.headers);
		}
		else{
			var data='';
			response.on('data', function(d){ data += d;});
			response.on('end',function(){ callback(data); });
			response.on('close',function(){
				 console.log("\n\nOops! Something went wrong\n");
			});
		}
	});
  request.end();
};

Facebook.prototype.getAuthUrl = function(){
	var dialogUrl = 'https://www.facebook.com/dialog/oauth' + 
	'?client_id=' + this.appId + 
	'&redirect_uri=' + encodeURIComponent(this.appUrl) + 
	'&scope=' + encodeURIComponent(this.permissions);
	return dialogUrl;
};

Facebook.prototype.authorize = function(callback){
	console.log('To authorize, visit : ' + this.getAuthUrl());
	this.authResponseWait(this.acquireAccessToken);
};

Facebook.prototype.authResponseWait = function(callback){

};

Facebook.prototype.acquireAccessToken = function(code,callback){

};

module.exports = Facebook;
