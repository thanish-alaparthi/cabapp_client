/*
Name: usersOpsController
Description: Main controller to handle users tab.
Date: 03/12/1987
Author: chot2::dev.chot2@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('profDetCtrl', function($scope) {
		var scope = $scope;
		scope.$on('getTabData', function(){
	  		console.log(scope);
		    var profDetObj = {
		    	'tabID' : 1,
		    	'detObj' : scope.user
		    }

		    scope.$emit('sendTabData', profDetObj);
	    });


	});