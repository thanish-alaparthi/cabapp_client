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
		scope.vehicleReasonTypes = PrerequisiteService.fnGetReasonsById(12);
		scope.vehiclePriorities = PrerequisiteService.priorities;
		scope.breakDown.currentKms = scope.vehicleDetails.vehicleMainDetails.startKms;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				oData = {
					"requester": scope.breakDown.categoryId,
					"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
					"driverId": driverId,
					"currentKms": scope.breakDown.currentKms,
					"bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
					"reasonId": scope.breakDown.reasonId || '',
					"priority": scope.breakDown.priorityId || '',
					"comments": scope.breakDown.comments
				};
				
			console.log(oData);

			// validations
			if(oData.currentKms > 0 && oData.currentKms < scope.vehicleDetails.vehicleMainDetails.startKms) {
				alert('Current Kms cannot be less than start kms.');
				return;
			} else if (oData.requester === '' || oData.priority === '' || oData.reasonId === '' || oData.comments === '') {
				alert('Please select required information');
				return;
			} else if (scope.breakDown.categoryId === 4 && driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}

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