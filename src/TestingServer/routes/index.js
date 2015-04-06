var express = require('express');
var multer = require("multer");
var router = express.Router();
var mongoose = require('mongoose');
var ResourcesModel = require('../BuzzModules/Resources/models/Resources');
var ResourceController = require('../BuzzModules/Resources/controllers/Resources');
var Threads = require('../BuzzModules/Threads/threads');
var Status = require('../BuzzModules/Status/StatusFunctions.js');
// var async = require('async');
// var Reporting = require('../BuzzModules/Reporting/ReportingB');

var calls = [];
var done = false;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(__dirname + "/upload.html");
});

router.get('/viewResources', function(req, res, next) {

  var page = "";

    ResourcesModel.find(function (err, items) {

      if(err) return console.log("Error viewing Resources");
      else {

        for(i=  0; i < items.length; i++) {

            var day = items[i].uploadDate.getDate();
            var month = items[i].uploadDate.getMonth() + 1;
            var year  = items[i].uploadDate.getFullYear();

            var timeStamp = day + "/" + month + "/" + year;

            page += "<div>"
               + "<span class='title'>" + items[i].resourceDescription + "</span>"
               + "<span class='download'><a href='/downloads/" + items[i].resourceName + "'>Open</a></span>"
               + "<span class='date'> Upload date: " + timeStamp + "</span>"
               + "<span class='remove'><a href='#' class='delR' rel='" + items[i]._id + "'>Delete</a></span>";

            ResourceController.downloadResource(items[i].resourceName);

            if(items[i].mimeType.substring(0, 5) == "image") {

              page += "<img width='225' height='150' src='/downloads/" + items[i].resourceName + "'/>";

            } else  if(items[i].mimeType.substring(0, 5) == "audio") {

              page += "<img width='225' height='150' src='/downloads/bgMusic.png'/>";

            } else {

              page += "<img width='225' height='150' src='/downloads/bgpdf.png'/>";
            }

            page += "</div>";
        }

      }
        
        res.send(uploadResourcesPage(page));
    });
});

router.use(multer(
  {
    dest: './uploads/',
    onFileUploadStart: function (file) 
    {
      console.log(file.originalname + ' is starting ...  ' + file.path);
    },
    onFileUploadComplete: function (file)
    {
      console.log(file.fieldname + ' uploaded to  ' + file.path);
      done=true;
    }
  }
));

router.post('/uploadResource', function(req, res, next) {

  if(done == true)
  {
    console.log(req.files.resource);
    ResourceController.uploadResource(req.files.resource, req.body.description);
    res.location("./viewResources");
    res.redirect("./viewResources");
  }
});

router.post('/remove', function(req, res, next) {

    ResourceController.removeResource(req.body.del);
    res.location("./viewResources");
    res.redirect("./viewResources"); 
});

router.post('/download', function(req, res, next) {

  ResourceController.downloadResource(req.body.getdoc);

  res.location("./");
  res.redirect("./");

});


/****** Appraisals *************/


router.get('/saveCreatedApprasial', function(request, response, next)
{
	var appraisalJson = Status.createAppraisal(request.query.appraisalName, request.query.appraisalDesc);
	Status.store(appraisalJson);
	var content = '<form method="get" enctype="multipart/form-data" action="saveCreatedApprasialLevels">';
	content += '<fieldset><legend>Appraisal Levels</legend>';
	
	var temp = request.query.appraisalLevelNum;
	if(temp != 0)
	{
		for(var i = 0; i < temp; i++)
		{
			content += '<label>Level ' + (i+1) + ': </label><input type="text" name="appraisalLevel' + (i+1) + '" value="smile"/><br/><br/>';
			content += '<label>Level ' + (i+1) + ' Icon: </label><input type="file" name="appraisalLevel' + (i+1) + 'Image"/><br/><br/>';
		}
	}
	content += '</fieldset><br/><br/><input id="saveApprasial" type="submit" value="Save apprasial"></form>';
	
	response.send(content);
});


router.get('/saveCreatedApprasialLevels', function(request, response, next)
{
	//change depending on number of levels
	var appraisalLevelJson = Status.createAppraisalLevels(request.query.appraisalLevel1, request.query.appraisalLevel2, request.query.appraisalLevel3);
	//call upload func to save images.
    response.location('/');
    response.redirect('/');
});

router.post('/createApprasial', function(request, response, next)
{
	var content = '<form method="GET" enctype="multipart/form-data" action="saveCreatedApprasial"><fieldset><legend>Create Appraisal</legend>';
	content += '<label>name</label><input type="text" id="appraisal" name="appraisalName" value="Funny" autofocus/><br/><br/><label>Description:</label>';
	content += '<input type="text" id="description" name="appraisalDesc" value="It was funny"/><br/><br/><form  method="GET" enctype="multipart/form-data" action="uploadIcon"><label>Not Rated Icon: </label><input type="file" name="appraisal[notRated]" id="notRatedIcon"/></form>';
	content += '<br/><br/><label>Number of levels:</label><input type="text" name="appraisalLevelNum" value="3"/></fieldset><br/><br/><input id="saveApprasial" type="submit" value="Add apprasial levels"></form>';
	
	response.send(content);
});

/*************************/

router.post('/createThread', function(req,res,next) 
{
	res.location("/createThread");
  res.redirect("/createThread"); 	
});

router.get('/createThread', function(req,res,next){
  //              _ID, _User, _Parent, _Level, _PostType, _Heading, _Content, _DateTime, _MimeType
  var date = new Date();
  var t;
  t = Threads(0, "Jason", 0, 0, "Question", req.query.threadTitle, req.query.threadContent, date, "Text");
  t.create();
  res.send(generateThreadCreatedPage(t));
});

function generateThreadCreatedPage(t){
  var p = "test";  
    //_ID, _User, _PostType, _Heading, _Content, _MimeType
  // console.log(result);
  // setTimeout(function(){
  //   t.submitPost(2, "Herman", "Question", "Test3.3", "Thread to move", "Text");
  // },5000);
    
  
	
  
  return p;
}

function uploadResourcesPage(cont) {

  var page = "<html lang='en'>"
    page += "<head>";
    page += "<script src='/javascripts/jquery.js'></script>"
         + "<script src='/javascripts/delete.js'></script>";

    page += "<style> * { margin: 0; padding: 0;}"
       +  "body {font-family: arial, verdana, tahoma;background: #2B3856;}"
       +  "a {text-decoration: none; color: #fff;}"
       +  "#resourcesWrapper {width: 725px;margin: 25px auto;}"
       +  "#resourcesWrapper div {width: 225px; float: left;margin-bottom: 25px;position: relative;-webkit-box-shadow: 0 2px 15px 1px rgba(0, 0, 0, 0.5);box-shadow: 0 2px 15px 1px rgba(0, 0, 0, 0.5);}"
       +  "#resourcesWrapper div:nth-child(3n+2) {margin: 0 25px 25px 25px;}#resourcesWrapper a img {display: block;-webkit-transition: all 0.5s;}"
       +  "#resourcesWrapper a img:hover {-webkit-filter: none;}"
       +  ".title {color: #fff;font-size: 13px;font-weight: bold;position: absolute;left: 0;bottom: 1px;z-index: 1;padding: 5px 7px;background: rgba(0, 0, 0, 0.6);}"
       +  ".download {color: #fff;font-size: 13px;font-weight: bold;position: absolute;right: 0;bottom: 1px;z-index: 1;padding: 5px 7px;background: rgba(0, 0, 0, 0.6);}"
       +  ".date {width: 212px;color: #fff;font-size: 13px;font-weight: bold;position: absolute;left: 0;top: 0;z-index: 1;padding: 5px 7px;background: rgba(0, 0, 0, 0.6);}"
       +  ".remove {;color: #fff;font-size: 13px;font-weight: bold;position: absolute;right: 0;bottom: 30px;z-index: 1;padding: 5px 7px;background: rgba(0, 0, 0, 0.6);}";
    page += "</style></head>";
    
    page += "<body>";  


    var wrapper = "<div id=\"resourcesWrapper\">";

    wrapper += cont;
    wrapper += "</div>";

    page += wrapper;
    page += "<form  id='sendForm' action='/remove' method='post'><input type='hidden' id='toDel' name='del'/></form>";
    page += "</body></html>";

    return page;
}
//*****REPORTING
router.post('/createReport', function(req, res, next)
{
//call functions
    Reporting.
    //Reporting.(dbURL, collection);
    res.location('./viewReport');
    res.redirect('./viewReport');
});

router.get('/viewReport', function(req, res, next) {
//show changes
    var page = "";
    page += "<p>" + "***" + "<br/>" + "</p>";
    res.send(page);

});

module.exports = router;
