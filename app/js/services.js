'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', ['angularLocalStorage']);

services.value('version', '0.1');
services.constant('webSocketHost', 'http://localhost');

services.factory('sockJs', ['webSocketHost', 'storage', function(host, localStore){
	var socket;

	function SockClient(){		
		this.clientId = localStore.get('clientId');
		this.receive = null;

		console.log('Client id: ' + this.clientId);

		var handleReceive = function(message){
			if(this.receive != null){
				this.receive(message);
			}
		};

		this.send = function(topic, data){
			socket.emit(topic, data);
			handleReceive.call(this, {from: this.clientId, data: data});
		};

		socket.on('welcome', function(data){
			console.log(data);
			if(this.clientId == null){
				this.clientId = data.clientId;
				localStore.set('clientId', this.clientId);	
			}

			socket.emit('ready', this.clientId);
		}.bind(this));

		socket.on('clientMessage', function(message){
			handleReceive.call(this, message);
		}.bind(this));
	}

	socket = io.connect(host);

	return new SockClient();

}]);
