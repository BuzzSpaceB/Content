/**
* A BuzzSpace may calculate the status of its contributors by utilizing one of the following calculators:
* NumPostsAssessor; ThreadsDepthAssessor; RoleAssessor; AppraisalsAssessor; WeightedSumProfileAssessor.
* The relevant calculator is chosen accordingly and performs its unique calculations.
* The default calculator for a BuzzSpace is the NumPostsAssessor calculator
*/

/*
* Inserts dummy data for database
* @param {string} databaseName - The name of the databse
* @param {string} collectionName - The name of the collection
*/
exports.insertData = function(dbName, collName) 
{

  var coll = db.getSiblingDB(dbName).getCollection(collName);

    coll.insert({_id: 1, role: 1, statusPoints:0, numberOfPosts:2, treeSizeSum: 4, numTrees: 5, appraisalTotal: 6});
    coll.insert({_id: 2, role: 1, statusPoints:0, numberOfPosts:1, treeSizeSum: 3,  numTrees: 1, appraisalTotal: 6});
    coll.insert({_id: 3, role: 1, statusPoints:10, numberOfPosts:3, treeSizeSum: 10,  numTrees: 1, appraisalTotal: 6});  

   

}

/**
* Updates the status points of a user
* @param {string} databaseName - The name of the databse
* @param {string} collectionName - The name of the collection
* @param {string} profileAssessor - The name of the assessor
* @param {string} userId - The user's id
* @param {string} assessorArray - The leaf assessors to be used for determining the weighted assessment eg. "1010"  means add NumPostsAsessor and RoleAssessor
*/
exports.updateStatusPointsForProfile = function(databaseName, collectionName, profileAssessor, userId, assessorArray)
{
	/** If the calculator is set to NumPostsAssessor the assessment is proportional to the number of posts a user has*/
	if(profileAssessor === "NumPostsAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.numberOfPosts}});
		});  
	}
	/** If the calculator is set to ThreadsDepthAssessor the assessment is based on average tree size attached for threads associated with a profile*/
	if(profileAssessor === "ThreadsDepthAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.treeSizeSum/document.numTrees}});
		});  
	}
	/**If the calculator is set to RoleAssesor the assessment is soley determined by the role the associated user has within the module*/
	if(profileAssessor === "RoleAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.role}});
		});  
	}
	
	/**If the calculator is set to AppraisalsAssessor the assessment is the sum of total appraisal value of a particular appraisal type*/
	if(profileAssessor === "AppraisalsAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.appraisalTotal}});
		}); 
	}
	
	/**If the calculator is set to WeightedSumProfileAssessor the assessment is result of sum of all selected leaf assessors*/
	if(profileAssessor === "WeightedSumProfileAssessor")
	{
		if(assessorArray.length < 4)
		{
			print("\""+ assessorArray +"\"" + " has an invalid string size for assessor array");
			return;
		}
		
		if(assessorArray[0] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.numberOfPosts+document.statusPoints}});
			}); 
		}
		if(assessorArray[1] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  (document.treeSizeSum/document.numTrees)+document.statusPoints}});
			}); 
		}
		if(assessorArray[2] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.role+document.statusPoints}});
			}); 
		}
		if(assessorArray[3] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({"_id": userId}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.appraisalTotal+document.statusPoints}});
			}); 
		}
		
	}
	
}

/**
* Updates the status points of a user
* @param {string} databaseName - The name of the databse
* @param {string} collectionName - The name of the collection
* @param {string} profileAssessor - The name of the assessor
* @param {string} assessorArray - The leaf assessors to be used for determining the weighted assessment eg. "1010"  means add NumPostsAsessor and RoleAssessor
*/
exports.updateAllStatusPoints = function(databaseName, collectionName, profileAssessor, assessorArray)
{
    /** If the calculator is set to NumPostsAssessor the assessment is proportional to the number of posts a user has*/
	if(profileAssessor === "NumPostsAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.numberOfPosts}});
		});  
	}
	/** If the calculator is set to ThreadsDepthAssessor the assessment is based on average tree size attached for threads associated with a profile*/
	if(profileAssessor === "ThreadsDepthAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.treeSizeSum/document.numTrees}});
		});  
	}
	/**If the calculator is set to RoleAssesor the assessment is soley determined by the role the associated user has within the module*/
	if(profileAssessor === "RoleAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.role}});
		});  
	}
	
	/**If the calculator is set to AppraisalsAssessor the assessment is the sum of total appraisal value of a particular appraisal type*/
	if(profileAssessor === "AppraisalsAssessor")
	{
		db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
		function(document)
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).update(
			{_id: document._id}, {$set:{"statusPoints":  document.appraisalTotal}});
		}); 
	}
	
	/**If the calculator is set to WeightedSumProfileAssessor the assessment is result of sum of all selected leaf assessors*/
	if(profileAssessor === "WeightedSumProfileAssessor")
	{
		if(assessorArray.length < 4)
		{
			console.error("\""+ assessorArray +"\"" + " has an invalid string size for assessor array");
			return;
		}
		
		if(assessorArray[0] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.numberOfPosts+document.statusPoints}});
			}); 
		}
		if(assessorArray[1] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  (document.treeSizeSum/document.numTrees)+document.statusPoints}});
			}); 
		}
		if(assessorArray[2] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.role+document.statusPoints}});
			}); 
		}
		if(assessorArray[3] === "1")
		{
			db.getSiblingDB(databaseName).getCollection(collectionName).find({}).snapshot().forEach(
			function(document)
			{
				db.getSiblingDB(databaseName).getCollection(collectionName).update(
				{_id: document._id}, {$set:{"statusPoints":  document.appraisalTotal+document.statusPoints}});
			}); 
		}
		
	}
	
}
