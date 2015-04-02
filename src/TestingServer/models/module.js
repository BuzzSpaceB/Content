var mongoose = require('mongoose');

var ModuleSchema = mongoose.Schema({
    module_id           : String,           /* The id of the module */
    name                : String,           /* The full name of the module */
    code                : String            /* The module code */
});

module.exports = mongoose.model("modules", ModuleSchema);
