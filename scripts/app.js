var express = require('express');
var app = express();

app.get('/', function(req, res){
	res.send('Test');
});

app.use(express.static(__dirname + '/../app'))

var server = app.listen(8000, function(){
	console.log('Listening on port %d', server.address().port);
	console.log(__dirname);
});