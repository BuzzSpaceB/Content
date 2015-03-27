/**
 * Created by Ephiphania Munava 10624610 on 3/19/2015.
 */

/**getThreadAppraisal
 * Receives parameters which are 3 json object and 1 actionKeyword. Depending on the actionKeyword performs
 * certain calculations and return results
 *
 * @param  setOfPosts -     Type JSONObject a set of posts returned by the Threads.queryThread function.
 * @param  setOfMembers -   Type JSONObject a set of members returned by the Threads.queryThread function.
 * @param  setOfAppraisals - Type JSONObject a set of appraisals returned by the Threads.queryThread function.
 * @param  actionKeyword -  Type String determining the result of the function.
 * @returns depending on the actionKeyword returns jsonObject, integer or double value.
 *
 * */
var getThreadAppraisal;

module.exports = function(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback) {

    var localSetOfPosts = JSON.parse(setOfPosts); //local copy of the set of posts
    var localSetOfMembers = JSON.parse(setOfMembers); //local copy of the set of members
    var localSetOfAppraisals = JSON.parse(setOfAppraisals); //local copy of the set of appraisals
    var localActionKeyword = actionKeyword; //local copy of the set of action keyword

    var dataSet = []; //Array containing objects created using the  member-appraisal-post combination.
    var tmpObject;      //Object used to insert the  member-appraisal-post combination into the data set.
    var tmpAppraisalObject; //Object used to get appraisal value for each member
    var tmpPostObject;  //Object used to get post value for each member

    /**
     * loop to create data set containing entry for each valid member-appraisal-post combination
     */
    for(var member in localSetOfMembers) {
        for (var appraisal in localSetOfAppraisals) {
            if (appraisal.appraisalID != member.appraisalID) {
            } else {
                tmpAppraisalObject.appraisalID = appraisal.appraisalID;
                tmpAppraisalObject.appraisalValue = appraisal.appraisalValue;
            }
        }

        for (var post in localSetOfPosts) {
            if (member.postID != post.postID) {
            } else {
                tmpPostObject.parentID = post.parentID;
                tmpPostObject.Author = post.Author;
                tmpPostObject.Timestamp = post.Timestamp;
                tmpPostObject.Status = post.Status;
                tmpPostObject.Content = post.Content;
            }
        }

        tmpObject.memberID = member.memberID;
        tmpObject.appraisalID = tmpAppraisalObject.appraisalID;
        tmpObject.appraisalValue = tmpAppraisalObject.appraisalValue;
        tmpObject.parentID = tmpPostObject.parentID;
        tmpObject.Author = tmpPostObject.Author;
        tmpObject.Timestamp = tmpPostObject.Timestamp;
        tmpObject.Status = tmpPostObject.Status;
        tmpObject.Content = tmpPostObject.Content;

        dataSet.push(tmpObject);
    }

    /**
     * 
     * Switch statement result returned upon each of the action keywords: ALL, SUM, AVG, MAX, MIN and NUM
     */
    switch(localActionKeyword) {
        case "All":
            callback(dataSet.toJSON());
            break;

        case "Sum":
            callback(sum(dataSet)); //Calls the helper function sum(dataset)
            break;

        case "Avg":
            callback(average(dataSet));//Calls the helper function average(dataset)
            break;

        case "Max":
            callback(maximum(dataSet));//Calls the helper function maximum(dataset)
            break;

        case "Min":
            callback(minimum(dataSet));//Calls the helper function minimum(dataset)
            break;

        case "Num":
            callback(nonEmpty(dataSet));//Calls the helper function nonEmpty(dataset)
            break;

        default:

    }
};

/**
 * Helper Function For Case: "Sum"
 * The sum of all appraisal values for the entries in the data set that was created.
 *
 * @param  dataSet - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The sum of all appraisal values for the entries in the data set that was created.
 */
function sum(dataSet) {

    var sum = 0; /**Variable that stores the sum value.*/

    for (var i = 0; i < dataSet.length(); i++) { /**For loop iteration through the dataset from the beginning to the end*/
        sum += dataSet[i].appraisalValue; /**Add the current dataset element appraisal value to variable sum*/
    }

    return sum; /**Return the sum which is stored in the variable sum*/
};

/**
 *  Helper Function For Case: "Avg"
 *  The average of all appraisal values for the entries in the data set that was created.
 *
 * @param  dataSet - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The average of all appraisal values for the entries in the data set that was created.
 */
function average(dataSet) {

    var sum = 0; /**Variable that stores the sum value.*/
    var number = dataSet.length(); /**Variable that stores the size of the dataset.*/

    for (var i = 0; i < number; i++) { /**For loop iteration through the dataset from the beginning to the end*/
        sum += dataSet[i].appraisalValue; /**Add the current dataset element appraisal value to variable sum*/
    }

    return sum / number; /**Return the average which is the sum divided by the number*/
};

/**
 *  Helper Function For Case: "Max"
 *  The maximum of all appraisal values for the entries in the data set that was created.
 *
 *  @param  dataSet - Array containing objects created using the  member-appraisal-post combination.
 *  @returns  The maximum of all appraisal values for the entries in the data set that was created.
 */
function maximum(dataSet) {

    var max = 0; /**Variable that stores the maximum value.*/

    for (var i = 0; i < dataSet.length(); i++) {/**For loop iteration through the dataset from the beginning to the end*/

        if (dataSet[i].appraisalValue > max) {  /**If the current element is less than the value saved in max then enter if*/
            max = dataSet[i].appraisalValue; /**Assign the current dataset element appraisal value to variable max*/
        }
    }

    return max; /**Return the variable max*/
};

/**
 * Helper Function For Case: "Min"
 * The minimum of all non-empty appraisal values for the entries in the dataset that was created.
 *
 * @param  dataSet - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The minimum of all non-empty appraisal values for the entries in the data set that was created.
 */
function minimum(dataSet){

    var min = 0; /**Variable that stores the minimum value.*/

    for (var i = 0; i < dataSet.length(); i++) {/**For loop iteration through the dataset from the beginning to the end*/

        if (dataSet[i].appraisalValue < min) { /**If the current element is less than the value saved in min then enter if*/
            min = dataSet[i].appraisalValue;  /**Assign the current dataset element appraisal value to variable min*/
        }
    }

    return min; /**Return the variable min*/
};

/**
 * Helper Function For Case: "Num"
 * A count of all non-empty appraisal values for the entries in the data set that was created.
 *
 * @param  dataSet - Array containing objects created using the  member-appraisal-post combination.
 * @returns A count of all non-empty appraisal values for the entries in the data set that was created.
 */
function nonEmpty(dataSet){

    var count = 0; /**Variable that stores the number of element that are not empty.*/

    for(var i = 0; i < dataSet.length(); i++) /**For loop iteration through the dataset from the beginning to the end*/
    {
        if(dataSet[i].appraisalValue != 0) {/**If the current element is not null then enter if statement*/
            count += 1; /**Increment the count*/
        }
    }


    return count; /**Return the variable count*/
};