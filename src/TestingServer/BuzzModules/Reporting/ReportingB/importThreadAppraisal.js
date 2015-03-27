/**Edited by Mkhabela Phethile 3/19/2015**/
/**the importThreadAppraisal Function gets a csv file as input from the exportThreadAppraisal function, the function then checks that the member and the appraisal are valid, calls assignAppraisalToPost for each field if valid and throws an exception if invalid**/
/**This function requires you to run in on a server like Apache, I used usbwebserver**/
module.exports = function(directory,fileName)//function gets the name of the file as input same file from exportThreadAppraisal(),this is how i achieved the functionality <a href="#" onclick="importThreadAppraisal('yes.csv')">test</a>
{
    var dataRead;
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(directory,fileName);
    fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
        if (!err){
            dataRead = data;
            parseData(dataRead);
        }else{
            console.log(err);
        }
    });


};
/**parse csv**/ 
function parseData(data)
{

/**replace UNIX new lines**/
data = data.replace (/\r\n/g, "\n");
/**replace MAC new lines**/
data = data.replace (/\r/g, "\n");
/**split csv data into rows**/
var rows = data.split("\n");

for (var i = 0; i < rows.length; i++) {

  /** this line helps to skip empty rows**/
    if (rows[i]) {
        /**our columns are separated by comma**/
        var column = rows[i].split(",");
		
		/**column is an array now, the first item is the parent id**/
		var parentId=column[0];
		/**The second item is the author**/ 
		var author=column[1];
		/**the third item is the timestamp**/
		var timestamp=column[2];
		/**the fourth is the content**/
		var content=column[3];
		/**the fifth is the status**/
		var status=column[4];
		/**the sixth is th memberID**/
		var memberId=column[5];
		/**the seventh is the appraisal id**/
		var appraisalId=column[6];
		/**the eight is the appraisal value**/
		var appraisalValue=column[7];

	/**the isAuthorised function is out of my scope along with the assignAppraisalToPost**/
	if(isValid(appraisalValue)&&isAuthorised(memberId)) assignAppraisalToPost(appraisalValue);
	}
}
}

/**function that checks if the appraisal value are valid**/
function isValid(appraisalValue)
{
try {
  /**I was not sure what  the highest appraisal value could be so i decided on 10, you may alter this if you wish**/
    if ((appraisalValue !=="")&&(appraisalValue>0)&&(appraisalValue<10))
    {

        return true;
    }
    else
    {

        return false;
    }
	/*if(appraisalValue == "") throw "empty"; else return true;
        if(isNaN(appraisalValue)) throw "not a number"; else return true;
        if(appraisalValue < 1) throw "too low"; else return true;
        if(appraisalValue > 10) throw "too high"; else return true;*/
   }
catch(err) {
      message.innerHTML = "Appraisal Value is " + err;
    }
}

/** This function is a dummy one since we dont implement it.*/
function isAuthorised(someData)
{return true;}

function assignAppraisalToPost(postValue) //Dummy Function
{
console.log("Appraisal post value " + postValue);
}


