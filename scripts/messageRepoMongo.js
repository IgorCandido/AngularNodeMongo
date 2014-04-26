var MongoClient = require('mongodb').MongoClient;

var db;
var collection;

MongoClient.connect('mongodb://localhost:27017/messageDb', function(err, database){
	if(err) { return console.dir(err); }
	db = database;

	db.collection("messages", function(err, dataBaseCollection){
		if(err) { return console.dir(err); }
		collection = dataBaseCollection;
	}.bind(this));

}.bind(this));

var retrieveData = function(err, items, callback){
	if(err){ return console.dir(err); }

	callback(items);
};

exports.addMessage = function(message){
	collection.insert(message, {w : 0});
};

exports.retrieveMessages = function(callback){
	collection.find().toArray(function(err, items){retrieveData(err, items, callback);})
};