/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakDown', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

		var scope = $scope;
		console.log('inside vehicleBreakDown', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.breakDown = {};
		scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
		scope.vehicleReasonTypes = PrerequisiteService.fnGetReasons();
		scope.vehiclePriorities = PrerequisiteService.priorities;


		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				oData = {
					"requester": scope.breakDown.categoryId,
					"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
					"driverId": driverId,
					"bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
					"reasonId": scope.breakDown.reasonId || '',
					"priority": scope.breakDown.priorityId || '',
					"comments": scope.breakDown.comments
				};
				
			console.log(oData);

			// validations
			/*if (oData.requester === '' || oData.reasonId === '') {
				alert('Please select required information');
				return;
			} else if (scope.breakDown.categoryId === 4 && driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}*/

			serverService.sendData('P',
				'vehicle/saveBreakDownInfo',
				oData, scope.fnVehicleBreakDownSuccess, scope.fnVehicleBreakDownError);
		}

		scope.fnVehicleBreakDownSuccess = function(data, status, headers, config) {
			console.log('fnVehicleBreakDownSuccess: ', data);
			scope.close();
			//alert(data.result[0].message);
			$rootScope.$emit('eventGetVehicleStatus', null);
		};
		scope.fnVehicleBreakDownError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});