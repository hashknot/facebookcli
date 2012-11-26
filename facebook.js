
var https = require('https');
var fs = require('fs');
var http = require('http');

function Facebook(accessToken){
  this.accessToken = accessToken;
	var manifest = JSON.parse(fs.readFileSync("manifest.json"));
	this.appId = manifest.appId;
  this.appSecret = manifest.appSecret;
  this.permissions = manifest.permissions;
	this.appPort = manifest.appServerPort;
	this.appUrl = 'http://localhost:'+ this.appPort + '/';
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
	'&scope=' + encodeURIComponent(this.permissions) +
	'&response_type=token';
	return dialogUrl;
};

Facebook.prototype.authorize = function(callback){
	authCompleteCallback = callback;
	console.log("To authorize, visit : \n\n\t" + this.getAuthUrl());
	this.createAppServer(this.acquireAccessToken);
};

Facebook.prototype.createAppServer = function(responseCallback){
	console.log("\n\nStarting the App Server on localhost:" + this.appPort);
	server=http.createServer(responseCallback).listen(this.appPort,'127.0.0.1');
};

Facebook.prototype.acquireAccessToken = function(req,res){
	console.log("Request : " + req.url);
	res.writeHead(200, {'Content-Type': 'text/plain'});
	if(req.url.indexOf('access_token=') == -1 ){
		res.end('App is waiting for a valid access_token');
		return;
	}
	this.accessToken = req.url.match(/[^#.]*$/);
	res.end('Got an Accesstoken. Shutting down the server now');
	server.close();
	authCompleteCallback(this.accessToken);
};

module.exports = Facebook;
