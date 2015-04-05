var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	ID: mongoose.Schema.Types.ObjectId,
    User: String,
    Parent: mongoose.Schema.Types.ObjectId,
    Level: Number,
    Post: mongoose.Schema.Types.ObjectId,
    Status: mongoose.Schema.Types.ObjectId,
    Children: [mongoose.Schema.Types.ObjectId]
});

schema.set('collection', 'threads');

module.exports = mongoose.model('threads', schema);