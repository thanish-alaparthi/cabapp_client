/*
Name: usersOpsController
Description: Main controller to handle users tab.
Date: 03/12/1987
Author: chot2::dev.chot2@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('persDetCtrl', function($scope) {
		var scope = $scope;
		$scope.$watch('user.userType', function() {
			if(scope.user && scope.user.userType){
				if(scope.user.userType.name == 'Driver'){
					scope.tabs[1].showTab = true;
					scope.tabs[2].showTab = true;
					
				} else if (scope.user.userType.name == 'Employee' ) {
					scope.tabs[1].showTab = true;
					scope.showNext = true;
				} else {
					scope.tabs[1].showTab = false;
					scope.tabs[2].showTab = false;
				}
			}
		}, true);
	  scope.$on('getTabData', function(){
			var persDetObj = {
		    	'tabID' : 0,
		    	'detObj' : scope.user
		  };

			scope.$emit('sendTabData', persDetObj);
	  });

	});