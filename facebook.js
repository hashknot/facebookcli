
var https = require('https');

function Facebook(accessToken){
  this.accessToken = accessToken;
  this.appId = '204416083025090';
  this.appSecret = 'bf206831e0b9c7f73d33315db3c81b65';
  this.permissions = 'user_online_presence, friends_online_presence';
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
