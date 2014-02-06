/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStop', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside vehicleBreakStop', oVehicleData);

		scope.vehicleDetails = oVehicleData;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"id": "3", // break start id, if already in break start
				"location": "Shaikpeta",
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": "1234"
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