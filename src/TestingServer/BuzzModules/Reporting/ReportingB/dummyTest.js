/** This javascript file is used to test the functions for the ReportingB module with dummy values. */


function testGetThreadsSats()
{

}

function testGetThreadAppraisal()
{

}

/** Tests the ExportThreadAppraisal function by creating a dummy JSON object and sending it to the function. */
function testExportThreadAppraisal()
{
    /** Create dummy object*/
    var items = [
        { "parentID": "1", "Author": "Dummy1", "Timestamp": "1426872319922", "Content":"Bla Bla", "Status":"On", "memeberID":"1", "appraisalID":"1", "appraisalValue":"1" },
        { "parentID": "2", "Author": "Dummy2", "Timestamp": "1426872319924", "Content":"Bla Bla ble", "Status":"Off", "memeberID":"2", "appraisalID":"2", "appraisalValue":"2" }];

    /** Convert object to JSON*/
    var jsonObject = JSON.stringify(items);
    /** Send JSONObject as well as the name of the file to be saved */
    exportThreadAppraisal(jsonObject,"Yes.csv");
}

function testImportThreadAppraisal()
{
	importThreadAppraisal("Yes.csv");
}



function testExportThread()
{
    exportThread('{ "posts" : [' +
    '{"ParentID":"1","Author":"1","TimeStamp":"xxxxx","Content":"adqwfqfgqfqwfqdasdasqwqwd","Status":"open","Level":"1"},' +
    '{"ParentID":"3","Author":"2","TimeStamp":"aaaaa","Content":"ad","Status":"hidden","Level":"2"},' +
    '{"ParentID":"2","Author":"3","TimeStamp":"bbbbb","Content":"adqwfqf","Status":"closed","Level":"3"}]}',"backup")
}

function testImportThread()
{
    alert(importThread("backup.txt"));
}