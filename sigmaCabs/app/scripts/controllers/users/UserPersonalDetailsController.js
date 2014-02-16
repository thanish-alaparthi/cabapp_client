/*
Name: usersOpsController
Description: Main controller to handle users tab.
Date: 03/12/1987
Author: chot2::dev.chot2@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('UserPersonalDetailsController', function($scope) {
		var scope = $scope;
		$scope.gPlace;

		scope.sUserIdLabel = 'user Code';

		console.log('>> in UserPersonalDetailsController: ',scope.user);

		$scope.$watch('user.userType', function() {
			switch(scope.user.userType){
				case '1':
					scope.sUserIdLabel = "Client ID";
				break;
				case '2':
					scope.sUserIdLabel = "Owner ID";
				break;
				default:
					scope.sUserIdLabel = "Employee ID";
				break;
			}


			if(scope.user && scope.user.userType){
				// show/hide driver tab.
				if(scope.user.userType == '3' ){	// Driver
					scope.tabs[3].showTab = true;
				}else{
					scope.tabs[3].showTab = false;
				}
				// show/hide clientDetails tab.
				if(scope.user.userType == '1' ){	// Client
					scope.tabs[4].showTab = true;
				}else{
					scope.tabs[4].showTab = false;
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