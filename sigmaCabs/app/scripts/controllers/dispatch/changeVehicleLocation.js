/*
Name: changeVehicleLocation
Description: changeVehicleLocation
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('changeVehicleLocation', function(oVehicleData, DispatchService, $rootScope, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

		var scope = $scope;
		console.log('inside changeVehicleLocation', oVehicleData);

		scope.allLocations = PrerequisiteService.fnGetAllLocations();

		scope.vehicleChangeLocReasonTypes = PrerequisiteService.fnGetReasonsById(7);

		scope.vehicleDetails = oVehicleData;
		scope.changeLocation = {};

		console.log(scope.vehicleDetails.vehicleMainDetails.location);

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				"location": scope.changeLocation.newLocation || '',
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.changeLocation.currentKms || '',
				"reasonId": scope.changeLocation.reasonId || '',
				"comments": scope.changeLocation.comments || ''
			};
			console.log(oData);
			// validations
			if (isNaN(oData.currentKms) || oData.reasonId === '' || oData.location === '' || oData.comments === '') {
                alert('Please select required information');
                return;
            } else if (oData.driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }

			serverService.sendData('P',
				'vehicle/locationchange',
				oData, scope.fnVehicleChangeLocationSuccess, scope.fnVehicleChangeLocationError);
		}

		scope.fnVehicleChangeLocationSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			$rootScope.$emit('eventGetVehicleStatus', null);
			//alert(data.result[0].message);
		};
		scope.fnVehicleChangeLocationError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});