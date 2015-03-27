/** Function to import a thread or subset of threads that was previously backed up
 *
 * @param directory the directory to be imported from
 * @param fileName name of file to be imported
 * @param callback function to be called on result
 *
 * */

    module.exports = function(directory,fileName,callback){
        var fs = require('fs');
        var path = require('path');
        var filePath = path.join(directory,fileName);
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
            if (!err){
                callback(data);
            }else{
                callback(err);
            }

        });
    };