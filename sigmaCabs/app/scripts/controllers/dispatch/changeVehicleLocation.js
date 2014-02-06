/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('changeVehicleLocation', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside changeVehicleLocation', oVehicleData);

		scope.vehicleDetails = oVehicleData;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": "15",
				"driverId": "28",
				"location": "Shaikpeta",
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": "4567"
			};

			DispatchService.fnVehicleChangeLocation(scope.oData)
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