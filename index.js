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
var mongoose = require('mongoose'), ds = require('DatabaseStuff');

var callbackNotDefined = "Content Exception: Callback function was not defined."

//ds.init(mongoose);

/*
 * 
 * Reporting
 * 
 */

/**
 * Create a report by getting the thread stats, This can be used with js Report creating a graph as an example
 * in jsReport_Examples/getThreadStatistics.html
 * @param {Function} callback - Callback function
 * @returns {object}
 * @throw callbackNotDefined
 */
function createReport(callback)
{
    var numEntries;
    var memCount;
    var maxDepth;
    var avgDepth;
    var posts;
    Threads.queryThread(0,0,0,0,0,0, function(res)
    {
        posts = res;
    });
    
    try
    {
		getThreadStats(posts, "Num", function(result)
		{
			numEntries = result;
		});
		
		getThreadStats(posts, "MemCount", function(result)
		{
			memCount = result;
		});
		
		getThreadStats(posts, "MaxDepth", function(result)
		{
			maxDepth = result;
		});	
		
		getThreadStats(posts, "AvgDepth", function(result)
		{
			avgDepth = result;
		});	
	}
	catch(err)
	{
		console.log(err);
	}
    
    var returnStats = {};
    
    returnStats.entriesCount = numEntries;
    returnStats.memberCount = memCount;
    returnStats.maximumDepth = maxDepth;
    returnStats.averageDepth = avgDepth;
    
    if(typeof callback !== 'undefined')
	{
		callback(returnStats);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Gets a thread's statistics - it is used to provide a versatile way to
 * get statistical information of subsets of posts complying with specified restrictions.
 * @param {object} posts - Posts in a thread - (returned by Threads.queryThread
 * @param {string} action - The statistic to get (done by specified action keyword)
 * @param {Function} callback - Callback function
 * @returns {number}
 * @throw callbackNotDefined
 */
function getThreadStats(posts, action, callback)
{
	var result;
	
	Reporting.getThreadStats(posts, action, function(res)
	{
		result = res;
	});
	
	console.log("Content: Reporting -- Thread stats.");
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Gets a thread's appraisal - The functionality provided by this function is to provide a versitile way to get detailed
 * statistical information of subsets of posts complying with specified restictions and their assosiated appriasals assigned by specified
 * members
 * @param {} setOfPosts - A set of posts returned by Threads.queryThreads
 * @param {} setOfMembers -
 * @param {} setOfAppraisals - 
 * @param {} actionKeyword - All- detailed set with all posts details.
 *                         - Sum - the sum of all appraisal values for the entries in the dataset that was created.
 *                         - Avg - The Average of all appraisal values for the entries in the dataset.
 *                         - Max - The Maximum of all appraisal values for the entries in the dataset.
 *                         - Min - the minimum of all non-empty appraisal vales for the entries that was created in the dataset.
 * @param {Function} callback - Callback function
 */
function getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback)
{
    var result;

    result = Reporting.getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, function(res)
    {
        result = res;
    });

	console.log("Content: Reporting -- Getting thread appraisal(s).");

    if(typeof callback !== 'undefined')
    {
        callback(result);
    }
    else
    {
        throw callbackNotDefined;
    }
}

/**
 * Export a thread's appraisal - The functionality of this function is to provide an offline facility to apply a manual
 * appraisal It creates a datase to be used to edit of line, and allows updates to be inserted to importThreadAppraisals
 * @param {Object} threadObject - A thread - retrned by Threads.queryThread
 * @param {string} dir - Directory to export to
 * @param {Function} callback - Callback function
 */
function exportThreadAppraisal(threadObject, dir, callback)
{
    /* decided that the name the file will be saved as needs to stay consistent,
    *Inportant that the directory to be saved to needs to be asked from the user sice differant OS users
    * will have differant directories of choice. This needs to be done via a UI, js Report also provides such a facility,
    * else the user needs to promted for the directory and this needs to be passed as a paramater.
    **/
    var fileName = "ThreadAppraisals.csv";
	Reporting.exportThreadAppraisal(threadObject, dir, fileName);

	console.log("Content: Reporting -- exporting thread appraisal.");

	//This function does not use a callback function it simply just saves a csv file in specified directory and then it is done
}

/**
 * Import a thread's appraisal - The functionality of this function is to provide an offline facility to apply manual
 * appraisal, it is dependant on exportThreadAppraisal
 * @param {string} dir - Directory from where the imported csv file was stored -  user might have moved file thus user needs to be prompted again for the directory
 * @param {string} filename - the name of the existing csv file that the user wants to import back.
 * @param {Function} callback - Callback function
 */
function importThreadAppraisal(dir, filename)
{
	reporting.importThreadAppraisal(dir, filename);
	
	console.log("Content: Reporting -- importing thread appraisal.");
	
	// Once again this function does not need a callback function since it does not return a result but it only imports a file.
}

/**
 * Export a thread -  this function is to provide a means to backup content of a thread in a serialized text file.
 * @param {Object} threadObject - A thread returned bt Threads.queryThread
 * @param {string} dir - Directory to export to
 * @param {string} filename - the name of the file
 * @param {Function} callback - Callback function
 */
function exportThread(threadObject, dir, filename, callback)
{
	Reporting.exportThread(threadObject, dir, filename);
	
	console.log("Content: Reporting -- exporting thread.");
	
	// Once again this file does not have a callback function since it does not return a result but simply creates a text
    // file containing a backup of a thread object
}

/**
 * Import a thread - This function is used to restore  the content of a thread or a subset of a thread that was
 * stores using exportThread
 * @param {string} dir - Directory to import the text file from
 * @param {string} filename - the name of the  existing file
 * @throw callbackNotDefined
 */
function importThread(dir, filename)
{

	reporting.importThread(dir, filename);
	
	console.log("Content: Reporting -- importing thread appraisal.");

    // Once again this function does not need a callback function since it does not return a result but it only imports a file.

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
 * @param {Function} callback - Callback funcion
 */
function uploadResources(resource, description, callback)
{
	var result;
	
	try
	{
		result = resources.uploadResource(resource, description);
	}
	catch(err)
	{
		throw err;
	}
	
	if(result)
	{
		console.log("Content: Resource uploaded. URL: " + result.url);
	}
	else
	{
		console.log("Content: Resource could not be uploaded.");
	}
  
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Remove a resource to the database
 * @param {string} id - id of the resource to remove
 * @param {Function} callback - Callback funcion
 */
function removeResources(url, callback)
{
	var result = resources.removeResource(id);
	
	if(result)
	{
		console.log("Content: Resource removed.");
	}
	else
	{
		console.log("Content: Resource could not be removed.");
	}
  
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Retrieve a resource from the database
 * @param {string} resourceName - Name of the resource to get
 * @param {Function} callback - Callback funcion
 */
function getResource(resourceName, callback)
{
	var result = null; 
	//result = resources.downloadResource(resourceName);
  
    if(result)
    {
		console.log("Content: Resource "  + resourceName + " retrieved");
	}
	else
	{
		console.log("Content: Resource "  + resourceName + " could not be retrieved");
	}
  
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Add a type of resource that D3 can accept
 * @param {string} resourceType - The type of resource to add
 * @param {number} maxSize - The maximum size of the resource type
 * @param {Function} callback - Callback function
 */
function addResourceType(resourceType, maxSize, callback)
{
  resources.addResourceType(resourceType, maxSize);
  
  console.log("Content: Resource type added.");
  
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Remove a type of resource so that D3 will no longer accept this type of file
 * @param {string} resourceType - The type of resource to remove
 * @param {Function} callback - Callback function
 */
function removeResourceType(resourceType, callback)
{
	var result = resources.removeResourceType(resourceType);
	
	if(result)
	{
		console.log("Content: Resource type removed.");
	}
	else
	{
		console.log("Content: Resource type could not be removed.");
	}
  
  	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Modify an existing resource type
 * @param {string} resourceType - The type of resource to modify
 * @param {Number} newSize - The new size of the resource type
 * @param {Function} callback - Callback function
 */
function modifyResourceType(resourceType, newSize, callback)
{
	var result = resources.modifyResourceType(resourceType, newSize);
	
	if(result)
	{
		console.log("Content: Resource modified.");
	}
	else
	{
		console.log("Content: Resource could not be modified.");
	}
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
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
//var Threads = require('./node_modules/Status/models/thread');
//var Users = require('./node_modules/Status/models/user');
//var Posts = require('./node_modules/Status/models/post');

var Threads = ds.models.thread;
var Users = ds.models.user;
var Posts = ds.models.post;

/**
 * Create an appraisal.
 * @param {String} appraisalName - the name of the appraisal
 * @param {String} appraisalDescription - the description of the appraisal
 * @param {date} activeFrom - the date the appraisal is active from
 * @param {date} activeTo - the date the appraisal is active to
 * @param {array} appraisalLevels - the array of all the level names, what each level is called, ratings per level is automatic at the moment
 * @param {Function} callback - Callback function
 */
function createApprasial(appraisalName, appraisalDescription, activeFrom, activeTo, appraisalLevels, callback)
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
 */
function getAllAppraisals(callback)
{
	status.getAllAppraisalsForVote(callback);
	console.log("Content: Getting all appraisals.")
}

/**
 * Clears the appraisalLevels array used to convert the appraisal levels into a JSON string to store the appraisal
 * @param {Function} callback - Callback function
 */
function clearAppraisalLevels(callback)
{
	status.clearAppraisalLevels();
	console.log("Content: Appraisal levels cleared.")

	if(typeof callback !== 'undefined')
	{
		callback();
	}
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
 * @param {Function} callback - Callback function
 */
function addAppraisalToPost(postID, appraisalName, callback)
{
	status.setAppraisal(postID, appraisalName);
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Save the appraisal icons
 * @param {File} file - the file to be uploaded as from the HTML file elementFromPoint
 * @param {String} description - Description of the icon to be uploaded, used by the resources' upload function
 * @param {Function} callback - Callback function
 */
function saveIcon(file, description, callback)
{
	uploadResources(file, description, callback);
}

/**
 * Returns the status of the user, who's userID is entered as parameter, to the callback function specified
 * @param {String} userId - userID of the user who's status is to be returned
 * @param {Function} callback - callback function to be used once user has been found
 */
function getStatus(userId, callback)
{
	status.getStatusForProfile(userId, callback);
}

/**
 * Sets The status calculator to the desired method of calculation
 * @param {String} statusCalcRequest - String used to determine the StatusRequest object containing the method of calculating the status
 * @param {Function} callback - Callback function
 */
function setStatusCalculator(statusCalcRequest, callback)
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
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Updates all users' profile status values according to a specific criteria depending on what status calculator is active
 * @param {Function} callback - Callback function
 */
function updateAllProfiles(callback)
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
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Updates specified user's profile status value according to a specific criteria depending on what status calculator is active
 * @param {String} user - userID of the user who's status is to be updated
 * @param {Function} callback - Callback function
 */
function updateProfile(user, callback)
{
	status.assessProfile(statusCalc.ProfileAssessor, user, status.updateStatusPointsForProfile);
	
	console.log("Content: Profile update.");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}


/*
 * 
 * Threads
 * 
 */

/**
 * Create a new thread
 * @param {String} user - The user creating a new thread
 * @param {String} heading - The head of the thread
 * @param {String} content - The content of the first post
 * @param {String} postType - The type of post being submitted
 * @param {Function} callback - Callback function
 */
function createNewThread(user, heading, content, postType, callback)
{
  var dateTime = new Date(); //Get the current date and time to store in the thread object
  //var LEVEL = 0; // Default level value of 0
  var PARENT = null; // Default parent value of null
  var MIMETYPE = "text/plain";
  var newThread = new threads();
  newThread.create(user, PARENT, postType, heading, content, MIMETYPE);
  console.log("Content: Thread created.");
   
  callback(newThread);
}

/**
 * Submit a new post to a thread
 * @param {object} threadObject - A thread to submit post to
 * @param {number} id - The id of the post
 * @param {String} user - The user creating a new post
 * @param {String} postType - The type of post being submitted
 * @param {String} heading - Heading of the post
 * @param {String} content - The content of the first post
 * @param {Function} callback - Callback function
 */
function newPost(threadObject, id, user, postType, heading, content, callback)
{
	//Not working as intended, due 
	var MIMETYPE = "text/plain";
	
	threadObject.submitPost(id, user, postType, heading, content, MIMETYPE);
	console.log("Content: New post");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Close the thread
 * @param {object} threadObject - A thread to close
 * @param {Function} callback - Callback function
 */
function closeThread(threadObject, callback)
{
	threadObject.closeThread();
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Unfreezes a thread that has been frozen
 * @param {object} threadObject - A thread to unfreeze
 * @param {Function} callback - Callback function
 */
function unfreezeThread(threadObject, callback)
{
	threadObject.unfreeze();
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Create summary of the thread
 * @param {object} threadObject - A thread to create a summary from
 * @param {Function} callback - Callback function
 * @throw callbackNotDefined
 */
function createThreadSummary(threadObject, callback)
{
	var result = threadObject.createThreadSummary();
	
	console.log("Content: Creating thread summary");
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Closes the children threads of the referenced thread
 * @param {object} threadObject - A thread whose children are to be closed
 * @param {Function} callback - Callback function
 */
function closeThreadChildren(threadObject, callback)
{
	threadObject.closeChildren();
	
	console.log("Content: Closing children of thread");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Set levels of a thread
 * @param {object} threadObject - A thread to set thread levels
 * @param {Function} callback - Callback function
 */
function setThreadLevels(threadObject, callback)
{
	threadObject.setLevels();
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Moves a thread
 * @param {object} threadObject - Thread to be moved
 * @param {object} newParent - New thread to set as parent
 * @param {Function} callback - Callback function
 * @throw callbackNotDefined
 */
function moveThread(threadObject, newParent, callback)
{
	var result = threadObject.moveThread(newParent);
	
	console.log("Content: Moving thread");
	
	if(result == true)
	{
		console.log("Content: Moving thread was successful.");
	}
	else
	{
		console.log("Content: Moving thread was not successful.");
	}
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Query a thread
 * @param {object} threadObject - A thread to move thread
 * @param {Date} startDateTime - Starting time of thread. Default is the time stamp of the root.
 * @param {Date} endDateTime - Ending time of the thread.
 * @param {number} maxLevel - The maximum level of depth to be returned.
 * @param {number} minLevel - The minimum level of depth to be returned.
 * @param {number} userGroup - The usergroup to restrict results to.
 * @param {number} phraseSet - Set of strings to restrict posts with only those strings. All posts returned if empty.
 * @param {Function} callback - Callback function
 * @throw callbackNotDefined
 */
function queryThread(threadObject, startDate, endDate, minLevel, maxLevel, userGroup, phraseSet, callback)
{
	var result = threadObject.queryThread(startDate, endDate, maxLevel, minLevel, userGroup, phraseSet);
	
	console.log("Content: Querying thread.");
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/**
 * Hide a thread
 * @param {object} threadObject - A thread to hide
 * @param {Function} callback - Callback function
 */
function hideThread(threadObject, callback)
{
	threadObject.hideThread();
	
	console.log("Content: Hiding thread.");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Unhides a hidden thread
 * @param {object} threadObject - A hidden thread to unhide
 * @param {Function} callback - Callback function
 */
function showThread(threadObject, callback)
{
	threadObject.unhideThread();
	
	console.log("Content: Showing hidden thread.");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Mark a post as read for user
 * @param {object} threadObject - A thread to mark post as read
 * @param {Function} callback - Callback function
 */
function markPostInThreadAsRead(threadObject, callback)
{
	threadObject.markPostAsRead();
	
	console.log("Content: Marked post as read.");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}

/**
 * Function to set a post as read
 * @param {object} threadObject - A hidden thread to show
 * @param {number} userID - User of to be marked as read
 * @param {number} postID - ID of post to be marked
 * @param {Function} callback - Callback function
 * @throws callbackNotDefined
 */
function readPost(threadObject, userID, postID, callback)
{
	var result = threadObject.readPost(userID, postID);
	
	console.log("Content: Setting a post as read.");
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
} 
/**
 * Count descendants of a thread
 * @param {object} threadObject - Thread whose descendants are to be counted
 * @param {Function} callback - Callback function
 * @throws callbackNotDefined
 */
function countDescendants(threadObject, callback)
{
	var result = threadObject.countDescendants();
	
	console.log("Content: Counting descendants of the threads.");
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}
/**
 * Function to count the number of children a thread has
 * @param {object} threadObject - Reference for calling
 * @param {object} threadToCountChildren - Count children from of this thread
 * @param {Function} callback - Callback function
 * @throws Throw exception if callback function does not exist
 */
function countChildren(threadObject, threadToCountChildren, callback)
{
	var result = threadObject.countChildren(threadToCountChildren);
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}
/**
 * Opens a closed thread
 * @param {object} threadObject - Closed thread to open
 * @param {Function} callback - Callback function
 * @throws Throw exception if callback function does not exist
 */
function reopenThread(threadObject, callback)
{
	threadObject.reopenThread();
	
	console.log("Content: Reopening thread.");
	
	if(typeof callback !== 'undefined')
	{
		callback();
	}
}
/**
 * Generate an array of threads that is related to the specified thread
 * @param {object} threadObject - Reference for calling thread
 * @param {object} validThread - Threads to be generated from this thread
 * @param {Function} callback - Callback function
 * @throws callbackNotDefined
 */
function generateThreads(threadObject, validThread, callback)
{
	var result = threadObject.generateThreads(validThread);
	
	if(typeof callback !== 'undefined')
	{
		callback(result);
	}
	else
	{
		throw callbackNotDefined;
	}
}

/*
 * Accessor functions
 */ 

/**
 * Accessor to get status from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getStatusFromThread(threadObject, callback)
{
	var result = threadObject.getStatus();
	
	console.log("Content: Got status from a thread");
	
	callback(result);
}

/**
 * Accessor to get the children from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getChildrenFromThread(threadObject, callback)
{
	var result = threadObject.getChildren();
	
	console.log("Content: Got children from a thread");
	
	callback(result);
}

/**
 * Accessor to get the post type from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getPostTypeFromThread(threadObject, callback)
{
	var result = threadObject.getStatus();
	
	console.log("Content: Got post type from a thread");
	
	callback(result);
}

/**
 * Accessor to get the heading from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getHeadingFromThread(threadObject, callback)
{
	var result = threadObject.getHeading();
	
	console.log("Content: Got heading from a thread");
	
	callback(result);
}

/**
 * Accessor to get the content from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getContentFromThread(threadObject, callback)
{
	var result = threadObject.getContent();
	
	console.log("Content: Got content from a thread");
	
	callback(result);
}

/**
 * Accessor to get the date-time from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getDateTimeFromThread(threadObject, callback)
{
	var result = threadObject.getDateTime();
	
	console.log("Content: Got datetime from a thread");
	
	callback(result);
}

/**
 * Accessor to get the MIME type from a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getMIMETypeFromThread(threadObject, callback)
{
	var result = threadObject.getMimeType();
	
	console.log("Content: Got MIMEType from a thread");
	
	callback(result);
}

/**
 * Accessor to get the children of a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getChildThreadsFromThread(threadObject, callback)
{
	var result = threadObject.getChildThreads();
	
	console.log("Content: Got child threads from a thread");
	
	callback(result);
}

/**
 * Accessor to get the post of a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getPostFromThread(threadObject, callback)
{
	var result = threadObject.getPost();
	
	console.log("Content: Got post from a thread");
	
	callback(result);
}

/**
 * Accessor to get the parent of a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getParentFromThread(threadObject, callback)
{
	var result = threadObject.getParentThread();
	
	console.log("Content: Got parent thread from a thread");
	
	callback(result);
}

/**
 * Accessor to get the root of a thread
 * @param {object} threadObject - A thread to aquire details from
 * @param {Function} callback - Callback function
 */
function getRootFromThread(threadObject, callback)
{
	var result = threadObject.getRoot();
	
	console.log("Content: Got root from a thread");
	
	callback(result);
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

module.exports.newPost = newPost;

module.exports.closeThread = closeThread;

module.exports.unfreezeThread = unfreezeThread;

module.exports.getStatusFromThread = getStatusFromThread;

module.exports.getChildrenFromThread = getChildrenFromThread;

module.exports.getPostTypeFromThread = getPostTypeFromThread;

module.exports.getHeadingFromThread = getHeadingFromThread;

module.exports.getContentFromThread = getContentFromThread;

module.exports.getDateTimeFromThread = getDateTimeFromThread;

module.exports.getMIMETypeFromThread = getMIMETypeFromThread;

module.exports.getChildThreadsFromThread = getChildThreadsFromThread;

module.exports.getPostFromThread = getPostFromThread;

module.exports.getParentFromThread = getParentFromThread;

module.exports.getRootFromThread = getRootFromThread;

module.exports.createThreadSummary = createThreadSummary;

module.exports.closeThreadChildren = closeThreadChildren;

module.exports.setThreadLevels = setThreadLevels;

module.exports.moveThread = moveThread;

module.exports.queryThread = queryThread;

module.exports.hideThread = hideThread;

module.exports.showThread = showThread;

module.exports.markPostInThreadAsRead = markPostInThreadAsRead;

module.exports.readPost = readPost;

module.exports.countDescendants = countDescendants;

module.exports.countChildren = countChildren;

module.exports.reopenThread = reopenThread;

module.exports.generateThreads = generateThreads;
