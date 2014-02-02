/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.run(function(AuthenticationService, $window, URLService, $rootScope) {

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
	.controller('vehicleActivityController', function($scope, $rootScope, URLService, modalWindow, dispatchService) { //$dialog,
		console.log('vehicleActivityController');

		var scope = $scope;

		scope.bloginShow = true;

		//$scope.driversList = ["SAmeer", "Gandhar", "Thanish", "Driver1", "Driver2", "Driver3", "Driver4"];

		scope.fnVehicleLogin = function() {
			scope.vehicleLoginObj = {
				"vehicleId": "15",
				"driverId": "28",
				"location": "Nana Nagar",
				"lattitude": "1234.56",
				"longitude": "6789.56"
			};
			/*scope.vehicleLoginObj['vehicleId'] = scope.chosenVehicle;
			scope.vehicleLoginObj['driverId'] = scope.chosenDriver;*/

			dispatchService.fnVehicleLogin(scope.vehicleLoginObj)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.bloginShow = false;
					alert(data.result[0].message);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		};

		/*scope.close = function(){
			dialog.close();
		};*/
	});