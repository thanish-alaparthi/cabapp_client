/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStart', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService, isControlView) {
		var scope = $scope;

		scope.allLocations = PrerequisiteService.fnGetAllLocations();
			
		isControlView = isControlView || false;
		scope.breakStart = {};
		console.log('inside vehicleBreakStart', oVehicleData);
		scope.vehicleBreakReasonTypes = PrerequisiteService.fnGetReasonsById(14);
		// set current Date for pickup date
		//scope.dpCurrentDate = PrerequisiteService.fnFormatDate();
		// set date restriction.
		//scope.dpCurrentPlusSevenDate = PrerequisiteService.fnGetAdvancedDate(7);
		scope.hours = PrerequisiteService.hours;
		scope.minutes = PrerequisiteService.minutes;
		// default data
		//scope.breakStart.pickupDate = angular.copy(scope.dpCurrentDate);
		scope.breakStart.pickupHours = "00";
		scope.breakStart.pickupMinutes = "00";

		scope.vehicleDetails = oVehicleData;
		scope.breakStart.newLocation = scope.vehicleDetails.vehicleMainDetails.location;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.breakStart.breakStartTime = ((scope.breakStart.pickupHours) * 60) + (scope.breakStart.pickupMinutes * 1);
			console.log(scope.breakStart.breakStartTime);
			var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				oData = {
					"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
					"driverId": driverId,
					"reasonId": scope.breakStart.reasonId || '',
					"location": scope.breakStart.newLocation,
					"lattitude": "12345.564",
					"longitude": "988756.345",
					"comments": scope.breakStart.comments || '', // only if reason id is others
					"breakTime": scope.breakStart.breakStartTime || 0
				};
			console.log(oData);

			// validations
			if (Math.abs(oData.breakTime) <= 0) {
				alert('Please select request time.');
				return;
			} else if (oData.location === '' || oData.reasonId === '' || oData.breakTime === '' || oData.comments === '') {
				alert('Please select required information');
				return;
			} else if (driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}

			serverService.sendData('P',
				'vehicle/breakstart',
				oData, scope.fnVehicleBreakStartSuccess, scope.fnVehicleBreakStartError);
		}

		scope.fnVehicleBreakStartSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			// alert(data.result[0].message);
			if (isControlView) {
                $rootScope.$emit('eventUpdateControlViewGrid', null);
            } else {
                $rootScope.$emit('eventGetVehicleStatus', null);
            }
		};
		scope.fnVehicleBreakStartError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});