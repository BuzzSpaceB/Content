var content = require('../index.js');

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
 * TESTING FOR = getThreadStats
 */

/**
 * This testing function will test for getThreadStats with keyword 'Num'
 * @param test
 */
exports.TestGetThreadStats_Num = function(test){
   // test.expect(1);

    var result;
    var posts;

   posts = dummyQueryThread();

    content.getThreadStats(posts, "Num", function(res)
    {
        result = res;
    });

    test.ok(result, "Result for Num");
    test.done();
};


/**
 * This testing function will test for getThreadStats with keyword 'MemCount'
 * @param test
 */
exports.TestGetThreadStats_MemCount = function(test){
    // test.expect(1);

    var result;
    var posts;

    posts = dummyQueryThread();

    content.getThreadStats(posts, "MemCount", function(res)
    {
        result = res;
    });

    test.ok(result, "Result for MemCount");
    test.done();
};


/**
 * This testing function will test for getThreadStats with keyword 'MaxDepth'
 * @param test
 */
exports.TestGetThreadStats_MaxDepth = function(test){
    // test.expect(1);

    var result;
    var posts;

    posts = dummyQueryThread();

    content.getThreadStats(posts, "MaxDepth", function(res)
    {
        result = res;
    });

    test.ok(result, "Result for MaxDepth");
    test.done();
};


/**
 * This testing function will test for getThreadStats with keyword 'AvgDepth'
 * @param test
 */
exports.TestGetThreadStats_AvgDepth = function(test){
    // test.expect(1);

    var result;
    var posts;

    posts = dummyQueryThread();

    content.getThreadStats(posts, "AvgDepth", function(res)
    {
        result = res;
    });

    test.ok(result, "Result for AvgDepth");
    test.done();
};


/**
 * TESTING FOR = getThreadAppraisal
 */