var redis = require('redis'),
	client = redis.createClient();


client.on('error', function(err){
	console.log('Error ' + err);
});

exports.getNewId = function(callback){
	client.incr('clientId', function(err, reply){
		callback(reply);
	});
};