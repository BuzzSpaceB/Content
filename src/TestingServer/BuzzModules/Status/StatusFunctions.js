var Appraisal = require('../../models/appraisal');

exports.assessProfile = function assessProfile(assessProfileRequest)
{
	return 2;
}

/**
 * Convert textbox input into json strings for database insertion
 *
 * @param  {String} _name - Name of appraisal
 * @param {String} _description - Description of appraisal
 * @return {String}
 */
exports.createAppraisal = function(_name, _description)
{
    appraisal={name: _name, description: _description};
    jsonAppraisal=JSON.stringify(appraisal);
    return jsonAppraisal;
};

exports.createAppraisalLevels = function(jsonLevels, numLevels)
{
	//store levels in db
}

exports.store = function(appraisal, levels){
   var temp = new Appraisal();
   console.log("\nstoring appraisal"); 
   var tempJSONobj = JSON.parse(appraisal);
   
   temp.name = tempJSONobj.name;
   temp.description = tempJSONobj.description;
   var myDate = new Date();
   
   temp.active_from = myDate;
   var myDate2 = new Date("July 21, 2015 01:15:00");
   temp.active_to = myDate2;
   
   temp.save(function(err)
   {
		if(err)
			console.log("ERR: " + err);
		else
			   console.log(temp);
   });
   
   console.log("\n"); 
};

function getStatusForProfile(getStatusForProfileRequest)
{
	return 50;
}

exports.setAppraisal=function(_userId, _postId, _appraisalId)
{
	//set appraisal in db
}
exports.setStatusCalculator = function setStatusCalculator(setStatusCalculatorRequest)
{
	//setStatusCalculatorRequest.assessProfile(setStatusCalculatorRequest);
}

exports.insertData = function(dbName, collName) 
{

}

exports.updateStatusPointsForProfile = function(databaseName, collectionName, profileAssessor, userId, assessorArray)
{

}

exports.updateAllStatusPoints = function(databaseName, collectionName, profileAssessor, assessorArray)
{

}

exports.getAppraisalType = function getAppraisalType(getAppraisalIdForRequest)
{  
 
}

exports.getAppraisalId = function getAppraisalId(getAppraisalTypeForRequest)
{

}