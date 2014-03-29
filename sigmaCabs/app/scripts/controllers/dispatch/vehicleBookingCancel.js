/*
Name: vehicleBookingCancel
Description: vehicleBookingCancel
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBookingCancel', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, isControlView, serverService) {

		var scope = $scope;
		console.log('inside vehicleBookingCancel', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.vBookingCancel = {};
		scope.vBookingCancel.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;
		scope.reason = PrerequisiteService.fnGetReasonsById(13);
		scope.cancelCategories = PrerequisiteService.fnGetCancelBookingCategory();

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				"bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId || '',
				"reasonId": scope.vBookingCancel.reasonId || '',
				"priorityId": scope.vBookingCancel.iPriority || '',
				"cancelCategory": scope.vBookingCancel.categoryId || '',
				"comments": scope.vBookingCancel.comments
			};

			// validations
			if (oData.cancelCategory === '' || oData.reasonId === '' || oData.priorityId === '' || oData.comments === '') {
				alert('Please select required information');
				return;
			}

			console.log(oData);
			serverService.sendData('P',
				'booking/cancel',
				oData, scope.fnVehicleBookingCancelSuccess, scope.fnVehicleBookingCancelError);
		};

		scope.fnVehicleBookingCancelSuccess = function(data, status, headers, config) {
			console.log('fnVehicleBookingCancelSuccess: ', data);
			scope.close();
			//alert(data.result[0].message);

			if (isControlView) {
				$rootScope.$emit('eventUpdateControlViewGrid', null);
			} else {
				$rootScope.$emit('eventGetVehicleStatus', null);
			}
		};
		scope.fnVehicleBookingCancelError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});