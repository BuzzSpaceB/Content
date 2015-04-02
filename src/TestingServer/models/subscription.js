var mongoose = require('mongoose');

var SubscriptionSchema = mongoose.Schema({
    subscription_id         : String,           /* PK */
    user_id                 : String,           /* The ID of the subscriber */
    thread_id               : String,           /* The ID of the thread that is being subscribed to. */
    user_id_sub             : [String],         /* The users that are subscribed to, by default all users */
    delete_notify           : Boolean,          /* If users will receive notifications on deleted threads, default is true */
    appraisal_notify        : Boolean,          /* If users will receive notifications on appraisals on their posts */
    send_mail               : Boolean,          /* If a mail for each notification will be sent, this is false by default */
    send_mail_daily         : Boolean           /* If a daily summary mail will sent containing a summary of the daily notifications, default is false */

});

module.exports = mongoose.model("subscriptions", SubscriptionShcema);
