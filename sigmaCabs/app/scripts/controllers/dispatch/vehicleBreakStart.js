/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStart', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside vehicleBreakStart', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.breakStart = {};
		scope.breakStart.newLocation = scope.vehicleDetails.vehicleMainDetials.details.location;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
				"driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
				"reasonId": "2",
				"location": scope.breakStart.newLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"comments": "This is test.... functionality done", //only if reason is other
				"breakTime": scope.breakStart.breakStartTime
			};

			DispatchService.fnVehicleBreakStart(scope.oData)
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