var mongoose = require('mongoose');

var RoleSchema = mongoose.Schema({
    role_id         : String,           /* The id of the role */
    name            : String            /* The name of the role, as from LDAP */
});


module.exports = mongoose.model("roles", RoleSchema);
