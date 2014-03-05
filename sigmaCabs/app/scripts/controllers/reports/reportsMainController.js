/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.run(function(AuthenticationService, $window, URLService,UsersService,  $rootScope) {
		// check for userSession.. and redirect to login screen if session dznt exists.
		AuthenticationService.getSession()
			.success(function(oData) {
				$rootScope.$broadcast('userInfoFromSession', {
					"displayName": "Mario Ray",
					"role": 1,
					"id": 234565434
				});
				return;
				if (oData.status != 200) {
					$window.location = URLService.page('logout');

				} else {
					// trigger the event to show all the userName
					$rootScope.$broadcast('userInfoFromSession', oData.result.userInfo);

				}
			})
	})
	.controller('ReportsMainController', function($scope, $rootScope, URLService, UsersService, PrerequisiteService) {

		var scope = $scope;
		
		scope.stDt = PrerequisiteService.fnFormatDate();
		scope.endDt = PrerequisiteService.fnFormatDate();

		scope.fnShowCallTakerSalaryReport = function(){
			scope.reportContainer = URLService.view('callTakerSalaryReport');
		};

		scope.fnGenerateCallTakerSalaryReport = function() {
			console.log('fnGenerateCallTakerSalaryReport');
			scope.oEmployeeDetails = {};
			scope.oEmployeeDetails.employeeName = "Test";
		};
	});