var express = require('express');
var multer = require("multer");
var router = express.Router();
var mongoose = require('mongoose');
var ResourcesModel = require('../BuzzModules/Resources/models/Resources');
var ResourceController = require('../BuzzModules/Resources/controllers/Resources');
var Threads = require('../BuzzModules/Threads/Threads.js');
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

module.exports = router;
