/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStop', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside vehicleBreakStop', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.breakStop = {};
		scope.breakStop.newLocation = scope.vehicleDetails.vehicleMainDetials.location;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				/*"driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,*/
				"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
				"id": scope.vehicleMainDetials.details.breakId || '', // break start id, if already in break start
				"location": scope.breakStop.newLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.breakStop.currentKms
			};

			DispatchService.fnVehicleBreakStop(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					alert(data.result[0].message);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		}
	});