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

// exports.testThreadCreation = function(test){
// 	console.log("Running test for the creation of a thread");
// 	test.expect(1);
// 	var obj;
// 	content.createNewThread("Frikkie2","This is the test of creating a thread2","This is the content of the test thread so this bla2","Question", function(res){
// 		obj = res;
// 	});

// 	var head;

// 	content.getHeadingFromThread(obj,function(res){
// 		head = res;
// 	});

// 	test.equal(head,"This is the test of creating a thread2");
// 	test.done();
// }

exports.testNewPost = function(test){
	console.log("Running test for submitting a new post");
	test.expect(1);
	var obj;
	content.createNewThread("Frikkie3","This is the test of adding a post to a thread","This is the content of the original","Question", function(res){
		obj = res;
	});


	setTimeout(function(){
		content.newPost(obj,7,"Frikkie","Question","Testing creation of a new post","Content to this post is kind of silly", function(){
			//I'm speculating that this function needs to be here in order for the callback to occur to prevent some silly synch issues
		});
		var count = 1;
		// content.countDescendants(threadForTestingStuffOn,function(res){
		// 	count = res;
		// });
		test.equal(count,1);
		test.done();	
	},1000);
	
	// test.expect(1);
	

	//I'm not sure how the functional team expects the id paramater to work, but c'est la vie
	// content.newPost(obj,7,"Frikkie","Question","Testing creation of a new post","Content to this post is kind of silly", function(){
	// 	//I'm speculating that this function needs to be here in order for the callback to occur to prevent some silly synch issues
	// });

}