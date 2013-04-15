#!/usr/local/bin/node

// var Facebook = require('./facebook.js');
var Facebook = require('./fbCli.js');
var argv = require('optimist').
usage('Facebook CLI').
boolean(['h','a']).
alias('a','authenticate').
alias('h','help').
alias('q','query').
alias('p','password').
// alias('e','everything').
// alias('n','notifications').
// alias('o','online').
// alias('m','messages').
describe('a','To setup Authorization,AccessToken').
describe('h','Print this help').
describe('q','Execute an FQL Query').
describe('p','Use this password.').
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
}
else{
	var main = function(){
		if(argv.q){
			Facebook.query(argv.q,console.log);
		}
		else{
			Facebook.allInfo.get(Facebook.allInfo.display);
		}
	};
	if(argv.p)
		Facebook.init(main,argv.p);
	else
		Facebook.init(main);
}
