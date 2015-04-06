var express = require('express');
var multer = require("multer");
var router = express.Router();
var mongoose = require('mongoose');
var ResourcesModel = require('../BuzzModules/Resources/models/Resources');
var ResourceController = require('../BuzzModules/Resources/controllers/Resources');
var Threads = require('../BuzzModules/Threads/Threads');
var Status = require('../BuzzModules/Status/StatusFunctions.js');
var Reporting = require('../BuzzModules/Reporting/Reporting.js');


var thread;
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
	// var page = req;
	console.log(req.query.threadTitle);
	console.log(req.query.threadContent);
	// var t = new Threads(0, "Frikkie", 0, 0, "Question", req.query.threadTitle, req.query.threadContent, "Yesterday", "Text");
	res.send(generateThreadCreatedPage(t));
});

function generateThreadCreatedPage(t){
	// var t = new Threads(0, "Frikkie", 0, 0, "Question", "req.query.threadTitle", "req.query.threadContent", "Yesterday", "Text");
	// console.log(t.queryThread(0,0,0,0,0,0));
	return "Thread succesfully created";
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
//**********************Reporting********************-->


/**
 * Isabel adding dummy function if queryThread gets called with no paramaters
 * Then it should return all threads
 * NOTE - getThreadStats will use queryThread on a specific thread thus when High Level integration
 * you will need to specify the paramaters of queryThread to get the wanted results of wanted threads
 **/

function dummyQueryThread(){

    var postList = [
        {"ParentID":"0", "Author":"1", "TimeStamp":"2015.03.15", "Content":"This is the first post I am writing here. My name is Eric.", "Status":"visible"},
        {"ParentID":"1", "Author":"2", "TimeStamp":"2015.03.17", "Content":"Hi! My name is Jonah.", "Status":"visible"},
        {"ParentID":"2", "Author":"3", "TimeStamp":"2015.03.17", "Content":"My name is Sarah. I am studying Computer Science", "Status":"visible"},
        {"ParentID":"2", "Author":"1", "TimeStamp":"2015.03.18", "Content":"I am also studying Computer Science.", "Status":"visible"},
        {"ParentID":"2", "Author":"2", "TimeStamp":"2015.03.18", "Content":"I wrote something that caused my post to be made hidden.", "Status":"hidden"},
        {"ParentID":"2", "Author":"0", "TimeStamp":"2015.03.19", "Content":"I am learning JavaScript.", "Status":"visible"},
        {"ParentID":"2", "Author":"0", "TimeStamp":"2015.03.19", "Content":"I am learning Java.", "Status":"visible"}
    ];

    var jsonObject = JSON.stringify(postList);

    return jsonObject;
}

/**
 * Get Thread Statistics:
 */
router.post('/createReport', function(req, res, next)
{
    res.location('./viewReport');
    res.redirect('./viewReport');
});

router.get('/viewReport', function(req, res, next) {

    /**
     * In this function I will get a set of posts returned by the queryThread function and add it as
     * paramater in getThreadStats functions with the differant keywords to gather the respective statistic
     **/

    // first we gather the posts from queryThread - note that we call it without amy paramaters so it will return all threads
    // if you only want spesific threads from a spesific time period it needs to be specified in the paramaters with high level integration
    // Thus originally the function will be called as Threads.queryThread(.....);

    var posts = dummyQueryThread();

    /**
     * getThreadStats makes use of a call back function and which basically just returns the value of the function it calls
     * @param returnVal will just provide the info returned by the callback function;
     */

    // now we get the number of entries in the dataset that was created by using the keyword 'Num'
    var num;
    Reporting.getThreadStats(posts, "Num",function(result)
    {
      num = result;
    });

    // now we get the count of the number of members who are the creators of posts in the dataset with the keyword 'MemCount'
    var memCount;
    Reporting.getThreadStats(posts, "MemCount",function(result)
    {
        memCount = result;
    });

    // now we get the maximum depth of a post in the queried thread tree with the keyword 'MaxDepth'
    var maxDepth;
    Reporting.getThreadStats(posts, "MaxDepth",function(result)
    {
        maxDepth = result;
    });

    // now we get the average depth of a post i the queries thread tree with the keyword 'AvgDepth'
    var avgDepth;
    Reporting.getThreadStats(posts, "AvgDepth",function(result)
    {
        avgDepth = result;
    });

	// Page to send to the client
    var page = "<!DOCTYPE html>\n<html>\n<head>\n<meta charset=\"UTF-8\">\n" +
    "<script src=\"https://code.jquery.com/jquery-1.11.0.min.js\"></script>\n" +
    "<script src=\"https://code.highcharts.com/highcharts.js\"></script>\n" +
    "<script src=\"https://code.highcharts.com/modules/drilldown.js\"></script>\n" +
    "<style>\n" +
		".toolbar{ padding: 20px;}\n" +
		"body{ padding: 20px;}\n" +
		".btn{ background-color: #0078e7; color: white; border: 0 none rgba(0, 0, 0, 0); border-radius: 2px; padding: 5px;}\n" +
		"@media print { .no-print, .no-print * { display: none !important;}}\n" +
    "</style>\n" +
    "</head>\n" +
    "<body style=\"height:100%;\">\n" +
    "<div class=\"no-print\"><input class=\"btn\" type=\"button\" value=\"print\" id=\"printCommand\"></div>\n" + 
	"<div id=\"container\" style=\"min-width: 310px; height: 400px; margin: 0 auto;\"></div>\n" +
	"<script>\n" +
	"$(function() {" + 
	"$(\"#printCommand\").click(function() {" +
            "$(\"#container\").find(\".highcharts-button\").hide();\n" +
            "var printTemplate = {content: $(\"#container\").html(), recipe: \"phantom-pdf\", phantom: { printDelay: 1000}};\n" +
            "jsreport.render(printTemplate);\n" +
            "$(\"#container\").find(\".highcharts-button\").show();\n" +
    "});\n" +
    "function toJSON(data) { return JSON.stringify(data);}\n" + 
    "$(\"#container\").highcharts({chart: {type: \"column\"}, title: {text: \"Thread Statistics\"}, " +
    "xAxis: {type: \"category\"}, legend: {enabled: false}, plotOptions: { series: { borderWidth: 0, dataLabels: { enabled: true}}}, " +
    "series: [{name: \"Thread statistics\", colorByPoint: true," +
    "data: [{ name: \"Entries\", y: " + num + "}, { name: \"Member Count\", y: " + memCount +"}, { name: \"Maximum Depth\", y: " + maxDepth + "}, { name: \"Average Depth\", y: " + avgDepth + "}]}]" +
    "});});\n</script>\n</body>\n</html>";
    
    res.send(page);
});

/**
 * Get Thread Appraisal
 */

router.post('/getThreadAppraisal', function(req,res,next)
{
    res.location("/getThreadAppraisals");
    res.redirect("/getThreadAppraisals");
});

router.get('/getThreadAppraisals', function(req,res,next){

    /**
     * In This function we will export the threads appraisals in a form of a csv file.
     */

    // first we gather the posts from queryThread - note that we call it without amy paramaters so it will return all threads
    // if you only want spesific threads from a spesific time period it needs to be specified in the paramaters with high level integration
    // Thus originally the function will be called as Threads.queryThread(.....);

    var posts = dummyQueryThread();
    var directory = req.query.exportThreadAppraisals;
    Reporting.exportThreadAppraisal(posts,"C:/Downloads/", "threadAppraisals.csv");

    var page ="";
    page += "<h3>" +  "csv File created!!! " + "</h3>" + "<br>" + "<p>" + "(The file will be saved in" + directory +"</p>";
    res.send(page);
});

router.post('/postThreadAppraisal', function(req,res,next)
{
    res.location("/postThreadAppraisals");
    res.redirect("/postThreadAppraisals");
});

router.get('/postThreadAppraisals', function(req,res,next){

    /**
     * In This function we will import the threads appraisals in a form of a csv file.
     */

    // first we gather the posts from queryThread - note that we call it without amy paramaters so it will return all threads
    // if you only want spesific threads from a spesific time period it needs to be specified in the paramaters with high level integration
    // Thus originally the function will be called as Threads.queryThread(.....);

    var posts = dummyQueryThread();
    var directory = req.query.exportThreadAppraisals;
    Reporting.exportThreadAppraisal(posts,"C:/Downloads/", "threadAppraisals.csv");

    var page ="";
    page += "<h3>" +  "csv File created!!! " + "</h3>" + "<br>" + "<p>" + "(The file will be saved in C:/Downloads/)" +"</p>";
    res.send(page);
});

module.exports = router;
