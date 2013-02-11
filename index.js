#!/usr/local/bin/node

// var Facebook = require('./facebook.js');
var Facebook = require('./fbCli.js');
var argv = require('optimist').
usage('Facebook CLI').
boolean(['h','a']).
alias('a','authenticate').
alias('h','help').
// alias('e','everything').
// alias('n','notifications').
// alias('o','online').
// alias('m','messages').
describe('a','To setup Authorization,AccessToken').
describe('h','Print this help').
// describe('e','Get Everything').
// describe('n','Get notifications').
// describe('o','Get online friends').
// describe('m','Get unread messages').
argv;

if(argv.h){
	console.log(require('optimist').showHelp());
	process.exit();
}

if(argv.a){
	Facebook.setup();
	// process.exit();
}
else{
	var main = function(){
		Facebook.allInfo.get(Facebook.allInfo.display);
	};
	Facebook.init(main);
}
