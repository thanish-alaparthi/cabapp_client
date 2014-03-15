/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStart', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {
		var scope = $scope;
		console.log('inside vehicleBreakStart', oVehicleData);
		scope.vehicleBreakReasonTypes = PrerequisiteService.fnGetReasons();

		scope.vehicleDetails = oVehicleData;
		scope.breakStart = {};
		scope.breakStart.newLocation = scope.vehicleDetails.vehicleMainDetails.location;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				oData = {
					"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
					"driverId": driverId,
					"reasonId": scope.breakStart.reasonId || '',
					"location": scope.breakStart.newLocation,
					"lattitude": "12345.564",
					"longitude": "988756.345",
					"comments": scope.breakStart.comments, // only if reason id is others
					"breakTime": scope.breakStart.breakStartTime
				};
			console.log(oData);

			// validations
			/*if (oData.reasonId === '') {
				alert('Please select required information');
				return;
			} else if (driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}*/

			serverService.sendData('P',
				'vehicle/breakstart',
				oData, scope.fnVehicleBreakStartSuccess, scope.fnVehicleBreakStartError);
		}

		scope.fnVehicleBreakStartSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			// alert(data.result[0].message);
			$rootScope.$emit('eventGetVehicleStatus', null);
		};
		scope.fnVehicleBreakStartError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});