
var https = require('https');
var fs = require('fs');

function Facebook(accessToken){
  this.accessToken = accessToken;
	var manifest = JSON.parse(fs.readFileSync("manifest.json"));
	this.appId = manifest.appId;
  this.appSecret = manifest.appSecret;
  this.permissions = manifest.permissions;
}

Facebook.prototype.fqlQuery = function(query,callback){
  var connectOptions = { host: 'graph.facebook.com',
	port: 443,
	path:'/fql?q=' ,
	method: 'GET'
  };
  connectOptions.path += encodeURIComponent(query) + '&' + this.accessToken;
  var request = https.request(connectOptions, function(response){
	  if(response.statusCode == 400){
	  console.log("\n\nOops! Something went wrong :( \n\nHere's what I know : " 
		+ "\n\nResponse HTTP Code : 400");
	  console.log(response.headers);
	  }
	  else{
	  response.on('data', callback);
	  }
	  });
  request.end();
}

module.exports = Facebook 
