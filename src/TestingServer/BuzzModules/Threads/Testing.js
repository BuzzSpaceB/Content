/**
 * Created by JASON on 15/03/24.
 */

var theThreadModule = require('./Threads');

function startTests(){
    console.log("This actually worked");
    theThreadModule.CreationOfThreads.Test1;
    startTests().done();
}

//module.exports.startTests = startTests;