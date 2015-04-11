/*
 * Contents module for D3
 * 
 * Contributors: Daniel Christopher Alves Araujo	u13073878@tuks.co.za
 * 				 Isabel Nel							isabel.nel.isabel@gmail.com
 * 				 Elzahn Botha						elzahnbotha@gmail.com
 * 				 Frikkie Snyman						frikkie.snyman@live.co.za
 * 
 */

var reporting = require('Reporting');
var resources = require('Resources');
var status = require('Status');
var threads = require('Threads');

/*
 * 
 * Reporting
 * 
 */

/**
 * Create an report by getting the thread stats.
 * @returns {object}
 */
function createReport(callback)
{
    var numEntries = getThreadStats(posts, "Num");
    var memCount = getThreadStats(posts, "MemCount");
    var maxDepth = getThreadStats(posts, "MaxDepth");
    var avgDepth = getThreadStats(posts, "AvgDepth");
    
    var returnStats = {};
    returnStats.entriesCount = numEntries;
    returnStats.memberCount = memCount;
    returnStats.maximumDepth = maxDepth;
    returnStats.averageDepth = avgDepth;
    
    callback(returnStats);
}

/**
 * Gets a thread's statistics
 * @param {object} posts - Posts in a thread
 * @param {string} action - The statistic to get
 * @returns {number}
 */
function getThreadStats(posts, action, callback)
{
	var result;
	
	reporting.getThreadStats(posts, action, function(res)
	{
		result = res;
	});
	
	console.log("Content: Reporting -- Thread stats.");
	
	callback(result);
}

function getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback)
{
	reporting.getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback);
	
	console.log("Content: Reporting -- Getting thread appraisal.");
}

function exportThreadAppraisal(threadObject, dir, filename)
{
	reporting.exportThreadAppraisal(threadObject, dir, filename);
	
	console.log("Content: Reporting -- exporting thread appraisal.");
}

function importThreadAppraisal(dir, filename)
{
	reporting.importThreadAppraisal(dir, filename);
	
	console.log("Content: Reporting -- importing thread appraisal.");
}

function exportThread(threadObject, dir, filename)
{
	reporting.exportThread(threadObject, dir, filename);
	
	console.log("Content: Reporting -- exporting thread.");
}

function importThread(dir, filename, callback)
{
	var result;
	
	reporting.importThread(dir, filename, function(res)
	{
		result = res;
	});
	
	console.log("Content: Reporting -- importing thread appraisal.");
	
	callback(result);
}



/*
 * 
 * Resources
 *  
 */

/**
 * Upload a resource to the database
 * @param {object} resource - the file to be uploaded
 * @param {string} description - a description of the file
 */
function uploadResources(resource, description)
{
  resources.uploadResource(resource, description);
  
  console.log("Content: Resource uploaded.");
}

/**
 * Remove a resource to the database
 * @param {string} resourceId - ID of the resource to remove
 */
function removeResources(resourceId)
{
  resources.removeResource(resourceId);
  
  console.log("Content: Resource removed.")
}

/**
 * Retrieve a resource from the database
 * @param {string} resourceName - Name of the resource to get
 *
 */
function getResource(resourceName)
{
  resources.downloadResource(resourceName);
  
  console.log("Content: Resource "  + resourceName + " retrieved");
}

/**
 * Add a type of resource that D3 can accept
 *
 *
 */
function addResourceType(resourceType, maxSize)
{
  resources.addResourceType(resourceType, maxSize);
  console.log("Content: Resource type added.");
}

/**
 * Remove a type of resource so that D3 will no longer accept this type of file
 *
 *
 */
function removeResourceType(resourceType)
{
  resources.removeResourceType(resourceType);
  console.log("Content: Resource type removed.");
}

/**
 * Modify an existing resource type
 *
 *
 */
function modifyResourceType()
{

}



/*
 * 
 * Status
 * 
 */

var numPostsCalc = new status.statusCalculatorRequest(); // Variable used to set the status calculator if the NumPostAssessor is to be used
numPostsCalc.ProfileAssessor = status.NumPostsAssessor;

var treeDepthCalc = new status.statusCalculatorRequest(); // Variable used to set the status calculator if the ThreadDepthAssessor is to be used
treeDepthCalc.ProfileAssessor = status.ThreadsDepthAssessor;

var statusCalc = new status.statusCalculatorRequest(); // Variable used to do the status calculations
statusCalc.ProfileAssessor = status.NumPostsAssessor;

/*
 * Functions needed to access the DB
 */
var Threads = require('./node_modules/Status/models/thread');
var Users = require('./node_modules/Status/models/user');
var Posts = require('./node_modules/Status/models/post');

/**
 * Create an appraisal.
 * @param {String} appraisalName - the name of the appraisal
 * @param {String} appraisalDescription - the description of the appraisal
 * @param {date} activeFrom - the date the appraisal is active from
 * @param {date} activeTo - the date the appraisal is active to
 * @param {array} appraisalLevels - the array of all the level names, what each level is called, ratings per level is automatic at the moment
 **/
function createApprasial(appraisalName, appraisalDescription, activeFrom, activeTo, appraisalLevels)
{
	var appraisalJson = status.createAppraisal(appraisalName, appraisalDescription);
	var appraisalActive = status.activePeriod(activeFrom, activeTo);
	var appraisalLevelJson = "";
	
	for(var i = 0; i < appraisalLevels.length; i++)
	{
		appraisalLevelJson = status.addAppraisalLevel((i+1), appraisalLevels[i]);
	}
	
	clearAppraisalLevels();
	
	status.store(appraisalLevelJson);//appraisalJson, appraisalLevelJson, appraisalActive);
	
	console.log("Content: Appraisal created and stored.");
}

/**
 * Returns all appraisals one by one to the callback function
 * @param {Function} callback - the funtion to which the results are send, the next function to be called. 
 **/
function getAllAppraisals(callback)
{
	status.getAllAppraisalsForVote(callback);
	console.log("Content: Getting all appraisals.")
}

/**
 * Clears the appraisalLevels array used to convert the appraisal levels into a JSON string to store the appraisal
 */
function clearAppraisalLevels()
{
	status.clearAppraisalLevels();
	console.log("Content: Appraisal levels cleared.")
}

/**
 * Returns the appraisals name connected to the specified post ID provided
 * @param {String} postID - The postID of the post which appraisal name is needed
 * @param {Function} callback - The function to be called after the post has been found, to which the appraisal name is send
 */
function getPostAppraisalName(postID, callback)
{
	status.getPostAppraisal(postID, callback);
}

/**
 * Sets the appraisal of the post that is specified to the appraisal given
 * @param {String} postID - The postID of the post which appraisal has to be set
 * @param {String} appraisalName - The name of the appraisal to be set
 */
function addAppraisalToPost(postID, appraisalName)
{
	status.setAppraisal(postID, appraisalName);
}

/**
 * Save the appraisal icons
 * @param {File} file - the file to be uploaded as from the HTML file elementFromPoint
 * @parm {String} description - Description of the icon to be uploaded, used by the resources' upload function
 */
function saveIcon(file, description)
{
	uploadResources(file, description);
}

/**
 * Returns the status of the user, who's userID is entered as parameter, to the callback function specified
 * @parm {String} userId - userID of the user who's status is to be returned
 * @parm {Function} func - callback function to be used once user has been found
 */
function getStatus(userId, func)
{
	status.getStatusForProfile(userId, func);
}

/**
 * sets The status calculator to the desired method of calculation
 * @param {String} statusCalcRequest - String used to determine the StatusRequest object containing the method of calculating the status
 */
function setStatusCalculator(statusCalcRequest)
{
	var tempObj = JSON.parse(statusCalcRequest);
	
	if(tempObj == "Num Post Assessor")
	{
		statusCalc = status.setStatusCalculator(numPostsCalc);
	}
	else
	{	
		statusCalc = status.setStatusCalculator(treeDepthCalc);
	}
}

/**
 * Updates all users' profile status values according to a specific criteria depending on what status calculator is active
 */
function updateAllProfiles()
{
	Users.find({}, function(err, user)
	{
		if(err)
		{
			console.log("ERR: " + err);
		}
		else
		{
			user.forEach(function(auser)
			{
				Threads.find({"user_id":auser.user_id}, function(err, auser)
				{
					if(err)
					{
						console.log("ERR: " + err);
					}
					else
					{
						status.assessProfile(statusCalc.ProfileAssessor, "", status.updateAllStatusPoints);
					}
				});
			});
		}
	});
	
}

/**
 * Updates specified user's profile status value according to a specific criteria depending on what status calculator is active
 * @parm {String} user - userID of the user who's status is to be updated
 */
function updateProfile(user)
{
	status.assessProfile(statusCalc.ProfileAssessor, user, status.updateStatusPointsForProfile);
	
	console.log("Content: Profile update.")
}


/*
 * 
 * Threads
 * 
 */

/**
 * Create a new thread
 * 
 * @param {String} user - The user creating a new thread
 * @param {String} title - The title of the thread
 * @param {String} content - The content of the first post
 * @param {String} postType - The type of post being submitted
 * 
 */
function createNewThread(threadID, user, title, content, postType, callback)
{
  var dateTime = new Date(); //Get the current date and time to store in the thread object
  var LEVEL = 0; // Default level value of 0
  var PARENT = 0; // Default parent value of 0
  var newThread = new threads(threadID, user, PARENT, LEVEL, postType, title, content, dateTime, "text/plain");
 
  console.log("Content: Thread created.");
   
  callback(newThread);
}


/////////////////////////////////////////////
/*
 * 
 * Function exports
 *  
 */
///////////////////////////////////////////

// Reporting

module.exports.createReport = createReport;

module.exports.getThreadStats = getThreadStats;

module.exports.getThreadAppraisal = getThreadAppraisal;

module.exports.exportThreadAppraisal = exportThreadAppraisal;

module.exports.importThreadAppraisal = importThreadAppraisal;

module.exports.exportThread = exportThread;

module.exports.importThread = importThread;


// Resources

module.exports.uploadResources = uploadResources;

module.exports.removeResources = removeResources;

module.exports.getResource = getResource;

module.exports.addResourceType = addResourceType;

module.exports.removeResourceType = removeResourceType;

module.exports.modifyResourceType = modifyResourceType;

// Status

module.exports.createApprasial = createApprasial;

module.exports.getAllAppraisals = getAllAppraisals;

module.exports.clearAppraisalLevels = clearAppraisalLevels;

module.exports.getPostAppraisalName = getPostAppraisalName;

module.exports.addAppraisalToPost = addAppraisalToPost;

module.exports.saveIcon = saveIcon;

module.exports.getStatus = getStatus;

module.exports.setStatusCalculator = setStatusCalculator;

module.exports.updateAllProfiles = updateAllProfiles;

module.exports.updateProfile = updateProfile;

// Threads

module.exports.createNewThread = createNewThread;
