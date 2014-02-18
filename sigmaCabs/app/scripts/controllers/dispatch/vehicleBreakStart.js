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
		scope.vehicleBreakReasonTypes = PrerequisiteService.fnGetReasons();

		scope.vehicleDetails = oVehicleData;
		scope.breakStart = {};
		scope.breakStart.newLocation = scope.vehicleDetails.vehicleMainDetials.location;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var driverId = scope.vehicleDetails.vehicleMainDetials.selectedDriver || '',
				oData = {
					"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
					"driverId": driverId,
					"reasonId": scope.breakStart.reasonId || '',
					"location": scope.breakStart.newLocation,
					"lattitude": "12345.564",
					"longitude": "988756.345",
					"comments": scope.breakStart.comments, // only if reason id is others
					"breakTime": scope.breakStart.breakStartTime
				};

			if (oData.reasonId === '') {
				alert('Please select required information');
				return;
			} else if (driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}

			DispatchService.fnVehicleBreakStart(oData)
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