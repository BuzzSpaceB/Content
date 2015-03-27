/**
 * Carla de Beer
 * 95151835
 * COS 301: Reporting B: getThreadStats
 * 21.03.2015
 */

/**
 * The functionality provided by the getThreadStats function is to provide a versatile way to get statistical
 * information of subsets of posts complying with specfied restrictions. The set of posts returned by the
 * Threads.queryThread function is analysed according to the specfied "action" keyword.
 * @param posts a set of posts returned by the Threads.queryThread function
 * @param action action keyword
 * @param callback function to be called on result
 * @returns {integer or double value corresponding to the action input}
 */

module.exports = function(posts, action, callback)
{

    var array = []; // 1D array to store all the details of the JSON object
    var arrayParentID = []; // 1D array to store the parent IDs

    // Parse the JSON object first
    var parsed = JSON.parse(posts);

    // Fill the array to contain the content of the JSON object
    for(var x in parsed){
        array.push(parsed[x]);
    }

    // Carry out an action based on the value of the "action" keyword:
    // Num: A count of the entries in the dataset that was created
    // MemCount: A count of the number of members who are the creators of posts in the dataset
    // MaxDepth: The maximum depth of a post in the queried thread tree
    // AvgDepth: The average depth of a post in the queried thread tree

    if (action === "Num"){

        callback(getNum(array));
        //return getNum(array);
    }
    else if (action === "MemCount"){

        var arrayAuthorID = []; // 1D array to store authorID array
        var arrayAuthorIDNoDuplicates = []; // 1D array to store member array without duplicates

        // Loop through array and get every 5th element, starting from index = 1
        for (var i = 1; i < array.length; i+=5){
            arrayAuthorID.push(array[i]);
        }

        arrayAuthorIDNoDuplicates = eliminateDuplicates(array);
        callback(arrayAuthorIDNoDuplicates.length);
        //return (arrayAuthorIDNoDuplicates.length);
    }
    else if(action == "MaxDepth"){

        callback(getMaxDepth(array,arrayParentID));
        //return (getMaxDepth(array,arrayParentID));

    }
    else if(action === "AvgDepth"){

        var n = 0; // temporary variable to store number of posts
        var md = 0; // temporary variable to store max depth of a post

        n = getNum(array);
        md = getMaxDepth(array,arrayParentID);
        callback(md/n);
        //return (md/n);
    }
};

/**
 * Helper function that counts the number of parentIDs so get a value of the number of items in the dataset
 * @param array
 * @returns {Integer value that indicates the size of the array = number of items in dataset}
 */
function getNum(arr){

    var countArray = [];

    for(var i = 0; i < arr.length; i+=5){
        countArray.push(arr[i]);
    }

    return countArray.length;
}

/**
 * Helper function to eliminate duplicates in an array
 * @param arr
 * @returns {Array without duplicates}
 */
function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

/**
 * Helper function that gets the maximum depth of a post.
 * @param array
 * @param arrayParentIDs
 * @returns {Integer value associated with the most frequent element in the array}
 */
function getMaxDepth(array,pID ){

    // Loop through the array to get each 5th element, i.e. the parentID
    for (var i = 0; i < array.length; i+=5){
        pID.push(array[i]);
    }

    // Sorting the array first so that the first item can be accessed as the most frequent
    pID.sort();

    var obj = {};
    for (var i = 0, j = pID.length; i < j; ++i) {
        obj[pID[i]] = (obj[pID[i]] || 0) + 1;
    }

    // Return the count value of the first item (= most frequent) in the object
    return obj[0]; // not entirely sure about this ...
}