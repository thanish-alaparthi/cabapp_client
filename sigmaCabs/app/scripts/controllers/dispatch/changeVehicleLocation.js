/*
Name: changeVehicleLocation
Description: changeVehicleLocation
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('changeVehicleLocation', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside changeVehicleLocation', oVehicleData);
		scope.vehicleChangeLocReasonTypes = PrerequisiteService.fnGetReasons();

		scope.vehicleDetails = oVehicleData;
		scope.changeLocation = {};

		console.log(scope.vehicleDetails.vehicleMainDetails.location);

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
				"location": scope.changeLocation.newLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.changeLocation.currentKms,
				"reasonId": scope.changeLocation.reasonId || '',
                "comments": scope.changeLocation.comments
            };

            /*if (oData.requester === '' || oData.reasonId === '') {
                alert('Please select required information');
                return;
            } else if (scope.vReject.categoryId === 4 && driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }*/

			DispatchService.fnVehicleChangeLocation(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					//alert(data.result[0].message);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		}
	});