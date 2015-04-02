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

// Resources

/**
 * Upload a resource to the database
 *
 *
 */
function uploadResources(resource, description)
{
  resources.uploadResource(resource, description);
}

/**
 * Remove a resource to the database
 *
 *
 */
function removeResources()
{

}

/**
 * Add a type of resource that D3 can accept
 *
 *
 */
function addResourceType()
{

}

/**
 * Remove a type of resource so that D3 will no longer accept this type of file
 *
 *
 */
function removeResourceType()
{

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

// Threads

function createThread()
{

}


// Function exports

module.exports.uploadResources = uploadResources;

module.exports.removeResources = removeResources;

module.exports.addResourceType = addResourceType;

module.exports.removeResourceType = removeResourceType;

module.exports.modifyResourceType = modifyResourceType;
