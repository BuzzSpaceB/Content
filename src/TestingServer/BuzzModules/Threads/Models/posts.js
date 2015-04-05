var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	ID: mongoose.Schema.Types.ObjectId,
    PostType: String,
    Heading: String,
    Content: String,
    DateCreated: Date,
    MimeType: String
});

schema.set('collection', 'posts');

module.exports = mongoose.model('posts', schema);