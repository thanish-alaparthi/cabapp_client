/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakDown', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

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
			var driverId = scope.vehicleDetails.vehicleMainDetials.selectedDriver || '',
				oData = {
					"id": "", // need to check with lala about id
					"requester": scope.breakDown.categoryId,
					"vehicleId": scope.vehicleDetails.vehicleMainDetials.id || '',
					"driverId": driverId,
					"bookingId": scope.vehicleDetails.vehicleMainDetials.bookingId || '',
					"reasonId": scope.breakDown.reasonId || '',
					"priority": scope.breakDown.priorityId || '',
					"comments": scope.breakDown.comments
				};

			if (oData.requester === '' || oData.reasonId === '') {
				alert('Please select required information');
				return;
			} else if (scope.breakDown.categoryId === 4 && driverId === '') {
				alert('Please select driver in vehicle information');
				return;
			}

			DispatchService.fnVehicleBreakDown(oData)
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