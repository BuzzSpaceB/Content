var mongoose = require('mongoose');

var AppraisalSchema = mongoose.Schema({
    appraisal_id            : String,       /* Primary key of the appraisal */
    name                    : String,       /* Descriptive name of the appraisal */
    description             : String,       /* More detail about the appraisal */
    not_rated_icon          : { data: Buffer, contentType: String },       /* Default icon when the appraisal ahs not been rated */
    active_from             : Date,          /* The day from when the appraisal is active */
    active_to               : Date,          /* The day up until the appraisal will be active */
    appraisal_ratings       :                /* The set of valid ratings for the appraisal */
        [{
            rating_name   : String,
            rating        : Number,
            rating_Icon   : { data: Buffer, contentType: String }
        }]
});


module.exports = mongoose.model("appraisals", AppraisalSchema);
