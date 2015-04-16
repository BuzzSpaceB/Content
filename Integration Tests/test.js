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
	console.log("Running test for the creation of a thread");
	test.expect(1);
	var obj;
	content.createNewThread("Frikkie2","This is the test of creating a thread2","This is the content of the test thread so this bla2","Question", function(res){
		obj = res;
	});

	var head;

	content.getHeadingFromThread(obj,function(res){
		head = res;
	})
	test.equal(head,"This is the test of creating a thread2");
	test.done();
}

exports.testNewPost = function(test){

	//Not working as intended
	console.log("Running test for submitting a new post");
	test.expect(1);

	var obj;
	content.createNewThread("Frikkie3","This is the test of adding a post to a thread","This is the content of the original","Question", function(res){
		obj = res;
	});

	// var newObj;

	content.newPost(obj,1,"Frikkie3","Comment","Reply to thread","This is a test post that serves as reply",function(){
		
	});

	var count = 0;



	test.equal(count,0);
	test.done();
}

// exports.testCloseThread = function(test){
// 	console.log("Running test for submitting a new post");
// 	test.expect(1);
// 	var obj;
// 	content.createNewThread("Frikkie3","This is the test of adding a post to a thread","This is the content of the original","Question", function(res){
// 		obj = res;
// 	});
// 	content.closeThread(obj,function(){});
// 	content.showThread(obj,function(){});



// }

exports.testGetHeading = function(test){
	console.log("Running test for getting a heading");
	test.expect(1);

	var obj;
	content.createNewThread("Frikkie3","This is the test of adding a post to a thread","This is the content of the original","Question", function(res){
		obj = res;
	});

	var head;

	content.getHeadingFromThread(obj,function(res){
		head = res;
	})
	test.equal(head,"This is the test of creating a thread2");
	test.done();
}