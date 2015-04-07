var mongoose = require('mongoose');

var ThreadSchema = new mongoose.Schema({
    thread_id       : String, 					/*PK*/
    parent_thread_id: String,				    /*FK, Parent of the thread*/
    user_id         : String,				    /*FK, Each Thread has one author*/
    num_children    : Number,                   /* The number of children the Thread has */
    closed          : Boolean,                  /* Flag to show thread is closed */
    hidden          : Boolean,                  /* Flag to show thread is hidden */
    level           : Number,                    /* Shows on which level the thread is currently at */
    post_id         : String                    /* The post that is connected to the thread */
});

module.exports = mongoose.model("threads", ThreadSchema);
