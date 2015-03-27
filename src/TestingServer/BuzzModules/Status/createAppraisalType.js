var jsonAppraisalLevels;
var jsonAppraisal;
var appraisalLevels;
var appraisal;

/**
 * Convert textbox input into json strings for database insertion
 *
 * @param  {String} _name - Name of appraisal
 * @param {String} _description - Description of appraisal
 * @return {String}
 */
exports.createAppraisal=function(_name, _description){

    appraisal={name: _name, description: _description};
    jsonAppraisal=JSON.stringify(appraisal);
    return jsonAppraisal;
};


/**
 * Convert textbox input into json strings for database insertion
 *
 * @param  {String} _lvl1 - Name of level 1 appraisal
 * @param {String} _lvl2 - Name of level 2 appraisal
 * @param {String} _lvl3 - Name of level 3 appraisal
 * @return {String}
 */
exports.createAppraisalLevels=function(_lvl1, _lvl2, _lvl3){
    appraisalLevels={level1: _lvl1, level2: _lvl2, level3:_lvl3};
    jsonAppraisalLevels=JSON.stringify(appraisalLevels);
    return jsonAppraisalLevels;
};


/**
 * Convert image/icon to base64
 *
 * @param  input - An uploaded image from html
 * @param {String} iconName - Name of the image being uploaded (ie. lvl1, notratedicon, etc)
 * @return {String} base64
 */
exports.readNotRatedIcon=function(input, iconName) {
    if (input.files && input.files[0]) {
        var FR = new FileReader();
        FR.readAsDataURL(input.files[0]);

        if (iconName=="notratedicon")
        {
            appraisal["notratedicon"]=FR;
        }
        else
        {
            if (iconName=="lvl1")
            {
                appraisalLevels["lvl1icon"]=FR;
            }
            else
            {
                if (iconName=="lvl2")
                {
                    appraisalLevels["lvl2icon"]=FR;
                }
                else
                {
                    if (iconName=="lvl3")
                    {
                        appraisalLevels["lvl3icon"]=FR;
                    }
                }
            }
        }

        jsonAppraisal=JSON.stringify(appraisal);
        jsonAppraisalLevels=JSON.stringify(appraisalLevels);

        return FR;
    }
};

/**
 * Convert image/icon to base64
 *
 * @param  {String} dbURL - url of the database
 * @param  dbCollections - collections used
 */
exports.store=function(dbURL, dbCollections){
    var db=require('mongojs').connect(dbURL, dbCollections);

    db.appraisals.save(jsonAppraisal, function(err, saved){
        if (err || !saved)
            console.log("Appraisal not added");
        else
            console.log("Appraisal added");
    });

    db.appraisallevels.save(jsonAppraisalLevels, function(err, saved){
        if (err || !saved)
            console.log("Appraisal Levels not added");
        else
            console.log("Appraisal Levels added");
    });
};