/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
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
	.controller('vehicleActivityController', function($scope, $rootScope, URLService, modalWindow, DispatchService) { //$dialog,
		console.log('vehicleActivityController');

		var scope = $scope;

		scope.bloginShow = true;
		/*scope.bVehCancelShow = true;*/

		//$scope.driversList = ["SAmeer", "Gandhar", "Thanish", "Driver1", "Driver2", "Driver3", "Driver4"];

		scope.fnVehicleLogin = function() {
			console.log(scope.vehicleMainDetials);
			scope.vehicleLoginObj = {
				"vehicleId": scope.vehicleMainDetials.id,
				"driverId": scope.vehicleMainDetials.selectedDriver,
				"location": scope.vehicleDetails.loginLocation,
				"lattitude": "1234.56",
				"longitude": "6789.56"
			};
			/*scope.vehicleLoginObj['vehicleId'] = scope.chosenVehicle;
			scope.vehicleLoginObj['driverId'] = scope.chosenDriver;*/

			DispatchService.fnVehicleLogin(scope.vehicleLoginObj)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					//scope.bloginShow = false;
					alert(data.result[0].message);
					scope.fnVehicleSearch(scope.vehicleMainDetials.mobileNumber);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		};

		scope.fnVehicleConfirm = function() {
			var bookingId = scope.vehicleMainDetials.details.bookingId || '';
			console.log(scope.vehicleMainDetials);
			if(bookingId === '') {
				alert('Please enter Booking Id');
				return false;
			}

			scope.vehicleLoginObj = {
				"vehicleId": scope.vehicleMainDetials.id,
				"driverId": scope.vehicleMainDetials.selectedDriver,
				"bookingId": bookingId
			};

			DispatchService.fnVehicleConfirm(scope.vehicleLoginObj)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					alert(data.result[0].message);
					scope.fnVehicleSearch(scope.vehicleMainDetials.mobileNumber);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		};

		/*scope.close = function(){
			dialog.close();
		};*/
	});