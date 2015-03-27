
/** Function to import a thread or subset of threads that was previously backed up
 *
 * @param threadObject the thread object to be exported
 * @param directory the directory to be imported from
 * @param fileName name of file to be imported
 *
 * */

module.exports = function(threadObject,directory,fileName){
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(directory,fileName);
    fs.writeFile(filePath, threadObject, function (err) {
        if (err) return console.log(err);
    });
};

