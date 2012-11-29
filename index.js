#!/usr/local/bin/node

// var Facebook = require('./facebook.js');
var Facebook = require('./fbCli.js');

var main = function(){
	Facebook.allInfo.get(Facebook.allInfo.display);
};

Facebook.init(main);
