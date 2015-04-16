var content = require('../index.js');
var fs = require("fs");
var path = require('path');

exports.testResourceUpload = function(test)
{
	// Test uploading with callback
		
	fs.readFile(path.join(__dirname, '/uploads/Timetable.pdf'), function(errorRes, data)
	{
		if(errorRes)
		{
			console.log(errorRes)
		}
		else
		{
			
			var fileUploadSuccessful;
			
			content.uploadResources(data, "A time table", function(res)
			{
				fileUploadSuccessful = res;
			});
			
			test.ok(fileUploadSuccessful, "File upload");
		}
	});
	
	// Test uploading without callback to get an exception
	
	fs.readFile(path.join(__dirname, '/uploads/notes.txt'), function(errorRes, data)
	{
		if(errorRes)
		{
			console.log(errorRes)
		}
		else
		{		
			test.throws(
				function ()
				{ 
					content.uploadResource(date, "A time table"); 
				},
				Error,
				"Show fail for excluding a callback function");
		}
	});
	
	test.done();
}

exports.testGettingResource = function(test)
{
	var acquiredResource;
	
	content.getResource("Timetable.pdf", function(res) {
		acquiredResource = res;
	});
	
	test.ok(acquiredResource, "Resource aquired");
	
	test.throws(
		function ()
		{ 
			content.getResource("Timetable.pdf");
		},
		Error,
		"Show fail for excluding a callback function");
	
	
	test.done();
}

exports.testAddingAResourceType = function(test)
{	
	content.addResourceType("application/pdf", 10000, function(res)
	{
		console.log("Content Testing: Testing for adding a resource type.");
	});
	
	test.done();
}

exports.removeResourceType = function(test)
{	
	var successfulRemoval;
	
	content.removeResourceType("text/plain", function(res)
	{
		successfulRemoval = res;
	});
	
	test.ok(successfulRemoval, "Removal of Resource");
	
	test.done();
}
