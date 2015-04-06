/**
 * Created by Ephiphania Munava 10624610 on 3/19/2015.
 */

/**
 * Receives parameters which are 3 json object and 1 actionKeyword. Depending on the actionKeyword performs
 * certain calculations and return results
 *
 * @param  setOfPosts -     Type JSONObject a set of posts returned by the Threads.queryThread function.
 * @param  setOfMembers -   Type JSONObject a set of members returned by the Threads.queryThread function.
 * @param  setOfAppraisals - Type JSONObject a set of appraisals returned by the Threads.queryThread function.
 * @param  actionKeyword -  Type String determining the result of the function.
 * @param  callback -  Callback function.
 * @returns depending on the actionKeyword returns jsonObject, integer or double value.
 *
 * */

module.exports = function(setOfPosts, setOfMembers, setOfAppraisals, actionKeyword, callback) {

    var localSetOfPosts = JSON.parse(setOfPosts);           /**local copy of the set of posts*/
    var localSetOfMembers = JSON.parse(setOfMembers);       /**local copy of the set of members*/
    var localSetOfAppraisals = JSON.parse(setOfAppraisals); /**local copy of the set of appraisals*/
    var localActionKeyword = actionKeyword;                 /**local copy of the set of action keyword*/
    var dataSet = [];                                       /**Array containing objects created using the  member-appraisal-post combination.*/
    var tmpObject = {};                                     /**Object used to insert the  member-appraisal-post combination into the data set.*/
    var tmpAppraisalObject = {};                            /**Object used to get appraisal value for each member*/
    var tmpPostObject = {};                                 /**Object used to get post value for each member*/

    /**
     * loop to create data set containing entry for each valid member-appraisal-post combination
    */
    for (var i = 0; i < localSetOfMembers.length; i++) {                                    /**For Loop for each member in the localSetOfMembers*/

        for (var j = 0; j < localSetOfAppraisals.length; j++) {                             /**For Loop for each appraisal in the localSetOfAppraisals*/

            if (localSetOfAppraisals[j].appraisalID == localSetOfMembers[i].appraisalID) {  /**If the appraisalID in localSetOfAppraisals matches the appraisal in localSetOfMembers*/
                                                                                            /**then create a part of the dataset related to the appraisal*/
                tmpAppraisalObject.appraisalID = localSetOfAppraisals[j].appraisalID;       /**Create appraisalID copy of the localSetOfAppraisal appraisalID*/
                tmpAppraisalObject.appraisalValue = localSetOfAppraisals[j].appraisalValue; /**Create appraisalValue copy of the localSetOfAppraisal appraisalValue*/
                break;                                                                      /**Exist the loop afterwards*/
            }
        }

        for (var k = 0; k < localSetOfPosts.length; k++) {                                  /**For Loop for each post in the localSetOfPosts*/
            if (localSetOfMembers[i].postID == localSetOfPosts[k].postID) {                 /**If the postID in localSetOfPosts matches the postID in localSetOfMembers*/
                                                                                            /**then create a piece of the dataset related to the post*/
                buildTempPostObject(tmpPostObject,localSetOfMembers[k]);                    /**call Helper function that populates parts of the of the dataset related to the post*/
                break;                                                                      /**Exist the loop afterwards*/
            }
        }

        buildTmpObject(tmpObject,localSetOfMembers[i].memberID,tmpPostObject, tmpAppraisalObject); /**call Helper function that populates the of the dataset*/

        dataSet.push(tmpObject);                                                            /**Push the created dataset into a array*/
        tmpObject = {};                                                                     /**Clear the object*/
    }

    /**

     * Switch statement result returned upon each of the action keywords: ALL, SUM, AVG, MAX, MIN and NUM
     */
    switch(localActionKeyword) {
        case "All":                                 /**All returns all the data in the dataset*/
            if (typeof callback === "function") {
                callback(JSON.stringify(dataSet));  /**callback the dataset as a json object*/
            }
            else
                return JSON.stringify(dataSet);     /**Returns the dataset as a json object*/
            break;

        case "Sum":
            if (typeof callback === "function") {   /**Sum returns the total amount of appraisal value in the dataset*/
                callback(sum(dataSet));             /**Calls the helper function sum(dataset)*/
            }
            else
                 return sum(dataSet);               /**Calls the helper function sum(dataset)*/
            break;

        case "Avg":
            if (typeof callback === "function") {   /**Avg returns the averge of appraisal value in the dataset*/
                callback(average(dataSet));         /**Calls the helper function average(dataset)*/
            }
            else
                return average(dataSet);            /**Calls the helper function average(dataset)*/
            break;

        case "Max":
            if (typeof callback === "function") {   /**Max returns the largest of the appraisal value in the dataset*/
                callback(maximum(dataSet));         /**Calls the helper function maximum(dataset)*/
            }
            else
                return maximum(dataSet);            /**Calls the helper function maximum(dataset)*/
            break;

        case "Min":
            if (typeof callback === "function") {   /**Min returns the smallest of the appraisal value in the dataset*/
                callback(minimum(dataSet));         /**Calls the helper function minimum(dataset)*/
            }
            else
                return minimum(dataSet);            /**Calls the helper function minimum(dataset)*/
            break;

        case "Num":
            if (typeof callback === "function") {   /**Num returns the number of non empty appraisal value in the dataset*/
                callback(nonEmpty(dataSet));        /**Calls the helper function nonEmpty(dataset)*/
            }
            else
                return nonEmpty(dataSet);           /**Calls the helper function nonEmpty(dataset)*/
            break;

        default:

    }
};

/**buildTempPostObject
 * Helper Function that Receives two parameters which are an object of posts and a handle to the localSetOfPost Array.
 *
 * @param  tmpPostObject -     Type javascript Object of posts created in the main function.
 * @param  localSetOfPosts -   Type javascript array at a specific index.
 *
 * */
function buildTempPostObject(tmpPostObject,localSetOfPosts){

    tmpPostObject.parentID = localSetOfPosts.parentID;  /**Create parentID copy of the localSetOfPosts parentID*/
    tmpPostObject.Author = localSetOfPosts.Author;      /**Create Author copy of the localSetOfPosts Author*/
    tmpPostObject.Timestamp = localSetOfPosts.Timestamp;/**Create Timestamp copy of the localSetOfPosts Timestamp*/
    tmpPostObject.Status = localSetOfPosts.Status;      /**Create Status copy of the localSetOfPosts Status*/
    tmpPostObject.Content = localSetOfPosts.Content;    /**Create Content copy of the localSetOfPosts Content*/
};

/**buildTempPostObject
 * Helper Function that Receives 4 parameters which are:
 *
 * @param  tmpObject -          Type javascript Object handle.
 * @param  member -             Type javascript array at a specific indexes referencing localSetOfMember memberID.
 * @param  tmpPostObject -      Type javascript Object of posts created in the main function.
 * @param  tmpAppraisalObject - Type javascript Object of appraisal created in the main function.
 *
 * */
function buildTmpObject(tmpObject, member, tmpPostObject, tmpAppraisalObject){

    tmpObject.memberID = member;                                    /**Create memberID copy of the tmpObject memberID*/
    tmpObject.appraisalID = tmpAppraisalObject.appraisalID;         /**Create appraisalID copy of the tmpObject appraisalID*/
    tmpObject.appraisalValue = tmpAppraisalObject.appraisalValue;   /**Create appraisalValue copy of the tmpObject appraisalValue*/
    tmpObject.parentID = tmpPostObject.parentID;                    /**Create parentID copy of the tmpObject parentID*/
    tmpObject.Author = tmpPostObject.Author;                        /**Create Author copy of the tmpObject Author*/
    tmpObject.Timestamp = tmpPostObject.Timestamp;                  /**Create Timestamp copy of the tmpObject Timestamp*/
    tmpObject.Status = tmpPostObject.Status;                        /**Create Status copy of the tmpObject Status*/
    tmpObject.Content = tmpPostObject.Content;                      /**Create Content copy of the tmpObject Content*/

};

/**
 * Helper Function For Case: "Sum"
 * The sum of all appraisal values for the entries in the data set that was created.
 *
 * @param  data - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The sum of all appraisal values for the entries in the data set that was created.
 */
function sum(data) {

    var sum = 0; /**Variable that stores the sum value.*/

    for (var i = 0; i < data.length; i++) { /**For loop iteration through the dataset from the beginning to the end*/

           sum += data[i].appraisalValue; /**Add the current dataset element appraisal value to variable sum*/
    }

    return sum; /**Return the sum which is stored in the variable sum*/
};

/**
 *  Helper Function For Case: "Avg"
 *  The average of all appraisal values for the entries in the data set that was created.
 *
 * @param  data - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The average of all appraisal values for the entries in the data set that was created.
 */
function average(data) {

    var sum = 0; /**Variable that stores the sum value.*/
    var number = data.length; /**Variable that stores the size of the dataset.*/

    for (var i = 0; i < number; i++) { /**For loop iteration through the dataset from the beginning to the end*/
        sum = sum + data[i].appraisalValue; /**Add the current dataset element appraisal value to variable sum*/
    }

    return sum / number; /**Return the average which is the sum divided by the number*/
};

/**
 *  Helper Function For Case: "Max"
 *  The maximum of all appraisal values for the entries in the data set that was created.
 *
 *  @param  data - Array containing objects created using the  member-appraisal-post combination.
 *  @returns  The maximum of all appraisal values for the entries in the data set that was created.
 */
function maximum(data) {

    var max = 0; /**Variable that stores the maximum value.*/

    for (var i = 0; i < data.length; i++) {/**For loop iteration through the dataset from the beginning to the end*/

        if (data[i].appraisalValue > max) {  /**If the current element is less than the value saved in max then enter if*/
            max = data[i].appraisalValue; /**Assign the current dataset element appraisal value to variable max*/
        }
    }

    return max; /**Return the variable max*/
};

/**
 * Helper Function For Case: "Min"
 * The minimum of all non-empty appraisal values for the entries in the dataset that was created.
 *
 * @param  data - Array containing objects created using the  member-appraisal-post combination.
 * @returns  The minimum of all non-empty appraisal values for the entries in the data set that was created.
 */
function minimum(data){

    var min = 1000000; /**Variable that stores the minimum value.*/

    for (var i = 0; i < data.length; i++) {/**For loop iteration through the dataset from the beginning to the end*/

        if (data[i].appraisalValue < min) { /**If the current element is less than the value saved in min then enter if*/
            min = data[i].appraisalValue;  /**Assign the current dataset element appraisal value to variable min*/
        }
    }

    return min; /**Return the variable min*/
};

/**
 * Helper Function For Case: "Num"
 * A count of all non-empty appraisal values for the entries in the data set that was created.
 *
 * @param  data - Array containing objects created using the  member-appraisal-post combination.
 * @returns A count of all non-empty appraisal values for the entries in the data set that was created.
 */
function nonEmpty(data){

    var count = 0; /**Variable that stores the number of element that are not empty.*/

    for(var i = 0; i < data.length; i++) /**For loop iteration through the dataset from the beginning to the end*/
    {
        if(data[i].appraisalValue != 0) {/**If the current element is not null then enter if statement*/
            count += 1; /**Increment the count*/
        }
    }

    return count; /**Return the variable count*/
};