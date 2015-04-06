/**
 * Created by User on 3/24/2015.
 */

var Reporting = require('./Reporting.js');

var consolePrintCallback = function(data) {
    console.log('got data: ' + data);
};

function testExportThread(){
    Reporting.exportThread('{ "posts" : [{"ParentID":"1","Author":"1","TimeStamp":"xxxxx","Content":"adqwfqfgqfqwfqdasdasqwqwd","Status":"open","Level":"1"},{"ParentID":"3","Author":"2","TimeStamp":"aaaaa","Content":"ad","Status":"hidden","Level":"2"},{"ParentID":"2","Author":"3","TimeStamp":"bbbbb","Content":"adqwfqf","Status":"closed","Level":"3"}]}',"C:/Users/Diaman/Desktop/ThreadBackup","backup1.txt");

}

function testExportThreadAppraisal(){
    var items = [
        { "parentID": "1", "Author": "Dummy1", "Timestamp": "1426872319922", "Content":"Bla Bla", "Status":"On", "memeberID":"1", "appraisalID":"1", "appraisalValue":"1" },
        { "parentID": "2", "Author": "Dummy2", "Timestamp": "1426872319924", "Content":"Bla Bla ble", "Status":"Off", "memeberID":"2", "appraisalID":"2", "appraisalValue":"2" }];

    /** Convert object to JSON*/
    var jsonObject = JSON.stringify(items);
    Reporting.exportThreadAppraisal(jsonObject,"C:/Users/Diaman/Desktop/Appraisal","appraisal.csv");
}

function testGetThreadAppraisal(){
    var setOfPosts = [
        {"postID": "1", "parentID": "1", "Author": "Dummy1", "Timestamp": "1426872319922", "Status":"Off", "Content":"Baa"},
        {"postID": "2", "parentID": "2", "Author": "Dummy2", "Timestamp": "1426872319923", "Status":"ON", "Content":"Baa Baa"},
        {"postID": "3", "parentID": "9", "Author": "Dummy3", "Timestamp": "1426872319924", "Status":"Off", "Content":"Baa Baa Black"},
        {"postID": "4", "parentID": "5", "Author": "Dummy4", "Timestamp": "1426872319925", "Status":"ON", "Content":"Baa Baa Black Sheep"},
        {"postID": "5", "parentID": "90", "Author": "Dummy5", "Timestamp": "1426872319926", "Status":"Off", "Content":"Baa Baa Black Sheep, Have you"},
        {"postID": "6", "parentID": "11", "Author": "Dummy6", "Timestamp": "1426872319927", "Status":"ON", "Content":"Baa Baa Black Sheep, Have you any wool?"}];

    var setOfAppraisals = [
        {"appraisalID": "1", "appraisalValue": 1},
        {"appraisalID": "2", "appraisalValue": 4},
        {"appraisalID": "3", "appraisalValue": 6},
        {"appraisalID": "4", "appraisalValue": 9},
        {"appraisalID": "5", "appraisalValue": 10},
        {"appraisalID": "6", "appraisalValue": 9}];

    var setOfMembers = [
        {"memberID": "1", "appraisalID": "1",postID: "1" },
        {"memberID": "2", "appraisalID": "2",postID: "2" },
        {"memberID": "3", "appraisalID": "3",postID: "3" },
        {"memberID": "4", "appraisalID": "4",postID: "4" },
        {"memberID": "5", "appraisalID": "5",postID: "5" },
        {"memberID": "6", "appraisalID": "6",postID: "6" }];


    var post = JSON.stringify(setOfPosts);
    var appraisal = JSON.stringify(setOfAppraisals);
    var member = JSON.stringify(setOfMembers);

    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "All"));
    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "Sum"));
    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "Avg"));
    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "Max"));
    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "Min"));
    consolePrintCallback(Reporting.getThreadAppraisal(post, member, appraisal, "Num"));

}

function testGetThreadStats(){
	
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
	   
	Reporting.getThreadStats(jsonObject, "Num", consolePrintCallback);
	Reporting.getThreadStats(jsonObject, "MemCount", consolePrintCallback);
	Reporting.getThreadStats(jsonObject, "MaxDepth", consolePrintCallback);	
	Reporting.getThreadStats(jsonObject, "AvgDepth", consolePrintCallback);
	
}

function testImportThread(){
    Reporting.importThread("C:/Users/Diaman/Desktop/ThreadBackup","backup1.txt",consolePrintCallback);
}

function testImportThreadAppraisal(){
    Reporting.importThreadAppraisal("C:/Users/Diaman/Desktop/Appraisal","appraisal.csv");
}

//Uncomment your function here to test it:

//testGetThreadStats();
testGetThreadAppraisal();

//testExportThread();
//testExportThreadAppraisal();

//testImportThread();
//testImportThreadAppraisal();