/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('changeVehiclePhone', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside changeVehiclePhone', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.phoneChangeComments = '';

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveAndClose = function() {
			var newMobile = scope.newMobile || '';
			if (newMobile === '' || newMobile.length < 10) {
				alert('Please enter valid Mobile No.');
				return;
			}

			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
				"driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
				"mobile": newMobile,
				"comments": scope.phoneChangeComments
			};

			console.log(scope.oData);

			DispatchService.fnChangeVehiclePhone(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					alert(data.result[0].message);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		};
	});