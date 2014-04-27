'use strict';

/* Controllers */

var controllers = angular.module('myApp.controllers', []);
 
controllers.controller('ChatController', ['$scope', 'sockJs', 
  	function($scope, sockJs) {
  		var defaultText = "Enter message";
  		$scope.text = defaultText;
  		$scope.messages = '';

  		function updateMessage($scope, message){
  			$scope.messages = $scope.messages.concat(message.from + ': '+ message.data +'\n');
  		};

  		sockJs.receive = function(message){
  			
  			//temp safe apply
  			var phase = $scope.$root.$$phase;
  			if(phase != '$apply' && phase != '$digest'){
  				$scope.$apply(function(){ updateMessage($scope,message); });
  			}
  			else{
  				updateMessage($scope, message);
  			}
  		};

  		$scope.enterMessage = function(){
			 sockJs.send('clientMessage', $scope.text);
  		}

	}]);
