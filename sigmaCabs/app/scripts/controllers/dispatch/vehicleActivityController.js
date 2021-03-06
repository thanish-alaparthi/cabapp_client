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
	.controller('vehicleActivityController', function($scope, $rootScope, URLService, modalWindow, DispatchService, serverService) {
		console.log('vehicleActivityController');

		var scope = $scope;

		scope.bloginShow = true;
		/*scope.bVehCancelShow = true;*/

		//$scope.driversList = ["SAmeer", "Gandhar", "Thanish", "Driver1", "Driver2", "Driver3", "Driver4"];

		scope.fnVehicleLogin = function() {
			console.log(scope.vehicleMainDetails);
			var oData = {
				"vehicleId": scope.vehicleMainDetails.id,
				"currentKms": scope.vehicleMainDetails.loginStartKms,
				"driverId": scope.vehicleMainDetails.selectedDriver.id,
				"expectedLoginHrs": scope.vehicleMainDetails.expLoginHours || '',
				"location": scope.vehicleDetails.loginLocation,
				"lattitude": "1234.56",
				"longitude": "6789.56"
			};

			// validations
			if(parseInt(oData.currentKms) < parseInt(scope.vehicleMainDetails.startKms)) {
				alert('Current Kms cannot be less than start kms.');
				return;
			} else if(oData.expectedLoginHrs === '' || oData.expectedLoginHrs === '00') {
				alert('Please select valid expected login hours');
				return;
			}

			serverService.sendData('P',
				'vehicle/login',
				oData, scope.fnVehicleLoginSuccess, scope.fnVehicleLoginError);
		};

		scope.fnVehicleConfirm = function() {
			var bookingId = scope.vehicleMainDetails.details.bookingId || '',
				oData = {};
			console.log(scope.vehicleMainDetails);
			if (bookingId === '') {
				alert('Booking Id not found');
				return false;
			}

			oData = {
				"vehicleId": scope.vehicleMainDetails.id,
				"driverId": scope.vehicleMainDetails.selectedDriver.id,
				"bookingId": bookingId,
				"passengerName": scope.vehicleMainDetails.details.customerName || '',
				"mobile": scope.vehicleMainDetails.details.customerMobile || '',// customer mobile no.
				"registrationNumber": scope.vehicleMainDetails.registrationNumber || '',
				'driverName': scope.vehicleMainDetails.selectedDriver.name || '',
				//'mobileNumber': scope.vehicleMainDetails.selectedDriver.mobile || ''
				'mobileNumber': scope.vehicleMainDetails.mobileNumber || ''
			};

			serverService.sendData('P',
				'vehicle/dispatch',
				oData, scope.fnVehicleConfirmSuccess, scope.fnVehicleConfirmError);
		};

		scope.fnVehicleAcceptBooking = function() {
			var bookingId = scope.vehicleMainDetails.details.bookingId || '',
				oData = {};
			console.log(scope.vehicleMainDetails);
			if (bookingId === '') {
				alert('Please enter Booking Id');
				return false;
			}

			oData = {
				"vehicleId": scope.vehicleMainDetails.id,
				"driverId": scope.vehicleMainDetails.selectedDriver.id,
				"bookingId": bookingId,
				"bookingType": scope.bookingType || '1',
				'mobileNumber': scope.vehicleMainDetails.mobileNumber || ''
			};

			serverService.sendData('P',
				'vehicle/acceptBooking',
				oData, scope.fnVehicleAcceptBookingSuccess, scope.fnVehicleAcceptBookingError);
		};

		scope.fnVehicleLoginSuccess = function(data, status, headers, config) {
			console.log('fnVehicleLoginSuccess: ', data);
			//scope.bloginShow = false;
			//alert(data.result[0].message);
			scope.fnVehicleSearch(scope.vehicleMainDetails.mobileNumber);
		};
		scope.fnVehicleLoginError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};

		scope.fnVehicleAcceptBookingSuccess = function(data, status, headers, config) {
			console.log('fnVehicleAcceptBookingSuccess: ', data);
			//alert(data.result[0].message);
			scope.fnVehicleSearch(scope.vehicleMainDetails.mobileNumber);
		};
		scope.fnVehicleAcceptBookingError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};

		scope.fnVehicleConfirmSuccess = function(data, status, headers, config) {
			console.log('fnVehicleConfirmSuccess: ', data);
			//alert(data.result[0].message);
			scope.fnVehicleSearch(scope.vehicleMainDetails.mobileNumber);
		};
		scope.fnVehicleConfirmError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});