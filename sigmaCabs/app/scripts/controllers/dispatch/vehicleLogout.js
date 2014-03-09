/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleLogout', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside vehicleLogout', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.logout = {};

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
				"location": scope.logout.currentLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.logout.currentKms
			};

			DispatchService.fnVehicleLogout(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					// alert(data.result[0].message);
					$rootScope.$emit('eventGetVehicleStatus', null);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		}
	});