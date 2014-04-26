'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var services = angular.module('myApp.services', []);

services.value('version', '0.1');
services.constant('webSocketHost', 'http://localhost');

services.provider('sockJs', function(){
	var socket;

	function SockClient(){
		this.clientId = null;
		this.receive = null;

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
			this.clientId = data.clientId;
		}.bind(this));

		socket.on('clientMessage', function(message){
			handleReceive.call(this, message);
		}.bind(this));
	}

	this.$get = ['webSocketHost', function(host){
		socket = io.connect(host);

		return new SockClient();
	}];
});
