var socketIo,
	messageRepoMongo = require('./messageRepoMongo.js');

// State

var clientId = 0;
var clients = [];

// DTO

function Message(from, data){
	this.from = from;
	this.data = data;
}

function Client(clientId, socket){
	this.clientId = clientId;
	this.socket = socket;

	socket.emit('welcome', {clientId: clientId, message: 'Welcome'});

	socket.on('clientMessage', function(data){
		console.log(clientId + ' ' + data);  
		receiveMessage(clientId, data);
	});

	socket.on('disconnect', function(){
		disconnectedClient(this);
	});

	this.syncMessages = function(messages){
		for(var i = 0; i < messages.length; ++i){
			var message = messages[i];
			this.message(message);
		}
	}

	this.message = function(message){
		socket.emit('clientMessage', message);
	}
}

// Functions

function getHistoric(client){
	messageRepoMongo.retrieveMessages(function(messages){
										client.syncMessages(messages);
									  });
}

function disconnectedClient(client){
	for(var i = 0; i < clients.length; ++i){
		if( clients[i].clientId == client.clientId){
			console.log('Client: ' + client.clientId + 'disconnected');
			clients.splice(i, 1);
		}
	}
}

function receiveMessage(clientId, data){
	var message = new Message(clientId, data);
	messageRepoMongo.addMessage(message);

	for(var i = 0; i < clients.length; ++i){
		if( clients[i].clientId != clientId){
			clients[i].message(message);
		}
	}
}

function newConnection(socket){
	var client =new Client(clientId++, socket);
	getHistoric(client);

	clients.push(client)
}

// Public interface

exports.start = function(sockets){
	socketIo = sockets;

	sockets.on('connection', newConnection);
};