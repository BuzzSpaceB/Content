/**
 * This module will persist the thread and post in the MongoDB using Mongoose API
 * @author Jason Richard Evans, Edwin Fullard
 * @param Schema
 * @param mongoose
 */

/*
    Sources used to help compile this document:
    1. http://stackoverflow.com/questions/5625569/include-external-js-file-in-node-js-app
    2. http://mongoosejs.com/docs/
 */

var mongoose = require('mongoose');
var postModel = require('./Models/posts');
var threadModel = require('./Models/threads');

function doPersistence(Schema, mongoose, _PostType, _Heading, _Content, _MimeType, _User, _Parent, _Level, _Post, _Status, _Children){
    var db = mongoose.createConnection('mongodb://localhost/test');
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        // yay!
        var thisDay = new Date();
        postModel.collection.insert({
            ID: Schema.ObjectId,
            PostType: _PostType,
            Heading: _Heading,
            Content: _Content,
            DateCreated: thisDay,
            MimeType: _MimeType}, function(err, doc) {
                if(err) console.log("Error inserting new post record.");
                else console.log("New post persisted to database.");
        });

        var thisDay = new Date();
        threadModel.collection.insert({
            ID: Schema.ObjectId,
            User: _User,
            Parent: _Parent,
            Level: _Level,
            Post: _Post,
            Status: _Status,
            Children: _Children}, function(err, doc) {
            if(err) console.log("Error inserting new thread record.");
            else console.log("New thread persisted to database.");
        });
    });
    mongoose.connection.close();
}

module.exports.doPersistence = doPersistence;
