var content = require('../index.js');

// Install via npm: npm install nodeunit -g


// Run using command: nodeunit test.js

// Here is an example unit test module:

// exports.testSomething = function(test){
//     test.expect(1);
//     test.ok(true, "this assertion should pass");
//     test.done();
// };

// exports.testSomethingElse = function(test){
//     test.ok(false, "this assertion should fail");
//     test.done();
// };

// View https://github.com/caolan/nodeunit for usage please

exports.testThreadCreation = function(test){
	var obj;
	test.expect(1);
	content.createNewThread("Frikkie","This is the test of creating a thread","This is the content of the test thread so this bla","text", function(res){
		obj = res;
	});

	var head;

	content.getHeadingFromThread(obj,function(res){
		head = res;
	});

	test.equal(head,"This is the test of creating a thread");
	test.done();

}