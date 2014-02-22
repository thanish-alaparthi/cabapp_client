/*
Name: vehicleBookingCancel
Description: vehicleBookingCancel
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBookingCancel', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside vehicleBookingCancel', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		scope.vBookingCancel = {};
		scope.vBookingCancel.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;
		scope.reason = PrerequisiteService.fnGetReasons();
		scope.cancelCategories = PrerequisiteService.fnGetCancelBookingCategory();

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
				"driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver || '',
				"bookingId": scope.vehicleDetails.vehicleMainDetials.bookingId || '',
				"reasonId": scope.vBookingCancel.reasonId || '',
				"priorityId": scope.vBookingCancel.priorityId || '',
				"cancelCategory": scope.vBookingCancel.categoryId || '',
				"comments": scope.vBookingCancel.comments
			};

			/*if (oData.cancelCategory === '' || oData.reasonId === '') {
				alert('Please select required information');
				return;
			}*/

			DispatchService.fnVehicleBookingCancel(oData)
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