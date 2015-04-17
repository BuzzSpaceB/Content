var content = require('../index.js');
var fs = require("fs");
var path = require('path');

var exampleResourceID;

exports.testResourceUpload = function(test)
{
	// Test uploading with callback
		
	fs.readFile(path.join(__dirname, '/uploads/Timetable.pdf'), function(errorRes, data)
	{
		if(errorRes)
		{
			test.ok(false, "Upload unsuccessful");
		}
		else
		{
			
			var fileUploadSuccessful;
			
			content.uploadResources(data, "A time table", function(res)
			{
				fileUploadSuccessful = res;
			});
			
			test.equals(fileUploadSuccessful, null);
		}
	});
	
	// Test uploading without callback to get an exception
	
	fs.readFile(path.join(__dirname, '/uploads/notes.txt'), function(errorRes, data)
	{
		if(errorRes)
		{
			test.ok(false, "Upload unsuccessful");
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

exports.testAddingResourceType = function(test)
{	
	content.addResourceType("application/pdf", 10000, function(res)
	{
		console.log("Content Testing: Testing for adding a resource type.");
	});
	
	test.done();
}

exports.testModifyingResourceType = function(test)
{
	var successfulModification;
	
	content.modifyResourceType("text/plain", 2000, function(res)
	{
		successfulModification = res;	
	});
	
	test.ok(successfulModification, "Modification of resource type");
	
	test.done();
}

exports.removeResourceType = function(test)
{	
	var successfulRemoval;
	
	content.removeResourceType("text/plain", function(res)
	{
		successfulRemoval = res;
	});
	
	test.ok(successfulRemoval, "Could not remove resource type");
	
	test.done();
}

exports.testRemovalResource = function(test)
{
	var successfulRemoval;
	var data;
	
	content.removeResources("Timetable.pdf", function(res)
	{
		data = res;
	});
	
	if(data)
	{
		successfulRemoval = true;
	}
	else
	{
		successfulRemoval = false;
	}
	
	
	test.ok(successfulRemoval, "Unable to remove resource");
	
	test.done();
}


exports.testGettingResource = function(test)
{
	var acquiredResource;
	var testOK = false;
	
	content.getResource("Timetable.pdf", function(res) {
		acquiredResource = res;
	});
	
	test.ok(acquiredResource, "Resource could not be aquired");
	
	test.throws(
		function ()
		{ 
			content.getResource("Timetable.pdf");
		},
		Error,
		"Show fail for excluding a callback function");
	
	
	test.done();
}
