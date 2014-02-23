/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('changeVehicleStatus', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope,
			previousStatusId;
		console.log('inside changeVehicleStatus', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.statusComments = '';
		previousStatusId = scope.vehicleDetails.vehicleMainDetails.paymentStatus;
		scope.stateFrom = previousStatusId;
		scope.stateTo = previousStatusId;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
				"stateFrom": scope.stateFrom,
				"stateTo": scope.stateTo,
				"comment": scope.statusComments
			};
			console.log(scope.oData);

			DispatchService.fnChangeVehicleStatus(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					alert(data.result[0].message);
					$rootScope.$emit('eventGetVehicleStatus', null);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		}
	});