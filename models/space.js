var mongoose = require('mongoose');

var SpaceSchema = mongoose.Schema({
    module_id           : String,           
    registered_users    : [{ user_id: String }],           
    academic_year       : String,
    is_open           	: Boolean,
    root_thread_id		: String,
    administrators		: [{ user_id: String}]
});

module.exports = mongoose.model("modules", ModuleSchema);
