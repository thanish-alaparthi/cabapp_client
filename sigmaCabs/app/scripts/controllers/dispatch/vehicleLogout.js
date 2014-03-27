/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleLogout', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

		var scope = $scope;
		scope.logout = {};
		console.log('inside vehicleLogout', oVehicleData);

		scope.allLocations = PrerequisiteService.fnGetAllLocations();

		// set current Date for pickup date
		scope.dpCurrentDate = PrerequisiteService.fnFormatDate();
		// set date restriction.
		scope.dpCurrentPlusSevenDate = PrerequisiteService.fnGetAdvancedDate(7);
		scope.hours = PrerequisiteService.hours;
		scope.minutes = PrerequisiteService.minutes;
		// default data
		scope.logout.pickupDate = angular.copy(scope.dpCurrentDate);
		scope.logout.pickupHours = "00";
		scope.logout.pickupMinutes = "00";

		scope.vehicleDetails = oVehicleData;
		scope.logout.currentKms = scope.vehicleDetails.vehicleMainDetails.details.previousKms;

		scope.close = function() {
			dialog.close();
		};

		scope.fnSaveAndClose = function() {
			scope.logout.nextLoginTime = PrerequisiteService.formatToServerDate(scope.logout.pickupDate) + ' ' + scope.logout.pickupHours + ':' + scope.logout.pickupMinutes;
			console.log(scope.logout.nextLoginTime);
			var oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				"location": scope.logout.currentLocation || '',
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.logout.currentKms || '',
				"expLoginTime": scope.logout.nextLoginTime || '0',
				"expLoginLocation": scope.logout.nextLoginLocation || '',
				"checkedBy": scope.logout.checkedBy || '',
				"comments": scope.logout.comments || '',
				"fuelLtrs": scope.logout.fuelLtrs || '',
				"amount": scope.logout.fuelAmount || '',
				"bunkName": scope.logout.fuelName || '',
				"bunkLocation": scope.logout.fuelLocation || '',
				"bunkLatitude": "12345.564",
				"bunkLongitude": "988756.345",
				"receipt": scope.logout.fuelReceiptNo || '',
				"voucher": scope.logout.fuelVoucher || '',
				"incharge": scope.logout.fuelIncharge || ''
			},
				// till the time we get the current kms in base object, in some vehicle state we don't get previous kms
				startOrPreviousKms = scope.vehicleDetails.vehicleMainDetails.details.previousKms || scope.vehicleDetails.vehicleMainDetails.startKms;

			// validations
			if (oData.currentKms < startOrPreviousKms) {
				alert('Current Kms cannot be less than previous kms.');
				return;
			} else if (oData.checkedBy === '' || oData.location === '' || isNaN(oData.currentKms) || oData.comments === '') {
				alert('Please enter valid information');
				return;
			} else if(new Date(oData.expLoginTime).getTime() < new Date().getTime()) {
				alert('Next login time should not be less than current Time');
				return;
			} else if (oData.driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			} else // if company vehicle
			if (scope.logout.isFuel && (oData.fuelLtrs == '' ||
				oData.amount == '' ||
				oData.bunkName == '' ||
				oData.bunkLocation == '' ||
				oData.receipt == '' ||
				oData.voucher == '' ||
				oData.incharge == ''
			)) {
				alert('Please enter fuel information.');
				return;
			}

			serverService.sendData('P',
				'vehicle/logout',
				oData, scope.fnVehicleLogoutSuccess, scope.fnVehicleLogoutError);
		}

		scope.fnVehicleLogoutSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			// alert(data.result[0].message);
			$rootScope.$emit('eventGetVehicleStatus', null);
		};
		scope.fnVehicleLogoutError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});