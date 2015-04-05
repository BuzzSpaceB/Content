/**
 * Contents module for D3
 *
 *
 */

var reporting = require('Reporting');
var resources = require('Resources');
var status = require('Status');
var threads = require('Threads');

//Reporting

function createReport()
{

}

function viewReport()
{

}

function getThreadStats(posts, action, callback)
{
	reporting.getThreadStats(posts, action, callback);
}

function getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback)
{
	reporting.getThreadAppraisal(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback);
}

function exportThreadAppraisal(threadObject, dir, filename)
{
	reporting.exportThreadAppraisal(threadObject, dir, filename);
}

function importThreadAppraisal(dir, filename)
{
	reporting.importThreadAppraisal(dir, filename);
}

function exportThread(threadObject, dir, filename)
{
	reporting.exportThread(threadObject, dir, filename);
}

function importThread(dir, filename, callback)
{
	reporting.importThread(dir, filename, callback);
}

// Resources

/**
 * Upload a resource to the database
 * @param {Object} resource - the file to be uploaded
 * @param {String} description - a description of the file
 */
function uploadResources(resource, description)
{
  resources.uploadResource(resource, description);
  console.log("Content: Resource uploaded.");
}

/**
 * Remove a resource to the database
 * @param {String} resourceId - ID of the resource to remove
 */
function removeResources(resourceId)
{
  resources.removeResource(resourceId);
  console.log("Content: Resource removed.")
}

/**
 * Retrieve a resource from the database
 *
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

// Status

/**
 * Store an appraisal
 * @param {String} appraisal - a JSON string with information of the appraisal
 */
function storeApprasial(appraisal)
{
  status.store(appraisal);
}

/**
 * Create an apprasial.
 * @param {String} appraisalName - the name of the appraisal
 * @param {String} appraisalDescription - the description of the appraisal
 */
function createApprasial(appraisalName, appraisalDescription)
{
  var response = status.createAppraisal(appraisalName, appraisalDescription);

  console.log("Content: Appresial created.");

  return response;
}

function saveCreatedApprasialLevels(level1, level2, level3)
{
	var appraisalLevelJson = status.createAppraisalLevels(level1, level2, level3);
	
	return appraisalLevelJson;
}

// Threads

/**
 * Create a new thread
 * @param {String} title -
 * @param {String} content -
 */
function createThread(title, content)
{
  var t = new Threads(0, "Frikkie", 0, 0, "Question", title, content, "Yesterday", "Text");
  console.log("Content: Thread created.");
}


// Function exports

// Reporting

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

module.exports.storeApprasial = storeApprasial;
module.exports.createApprasial = createApprasial;

// Threads

module.exports.createThread = createThread;
