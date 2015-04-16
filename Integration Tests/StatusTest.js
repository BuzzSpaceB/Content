var content = require('../index.js');

exports.getPostAppraisalName = function(test)
{
	test.expect(1);
	
	var temp = "funny";

	content.getPostAppraisalName("post1", function(val)	
	{
		test.equal(val, temp);
		test.done();
	});	
}

exports.gettingStatus = function(test)
{
	test.expect(1);

	content.getStatus("u00000006", function(val)
	{
		test.equal(val, 0);
		test.done();
	});
}