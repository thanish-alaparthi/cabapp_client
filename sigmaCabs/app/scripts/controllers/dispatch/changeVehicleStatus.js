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

		scope.vChangeStatus = {};
        scope.vehicleChangeStatusReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehiclePriorities = PrerequisiteService.priorities;

		scope.vehicleDetails = oVehicleData;
		previousStatusId = scope.vehicleDetails.vehicleMainDetails.paymentStatus;
		scope.vChangeStatus.statusComments = '';
		scope.vChangeStatus.stateFrom = previousStatusId;
		scope.vChangeStatus.stateTo = previousStatusId;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
				"stateFrom": scope.vChangeStatus.stateFrom,
				"stateTo": scope.vChangeStatus.stateTo,
				"reasonId": scope.vChangeStatus.reasonId || '',
                "priority": scope.vChangeStatus.priorityId || '',
				"comment": scope.vChangeStatus.statusComments
			};
			console.log(scope.oData);

			/*if (oData.requester === '' || oData.reasonId === '') {
                alert('Please select required information');
                return;
            } else if (scope.vReject.categoryId === 4 && driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }*/

			DispatchService.fnChangeVehicleStatus(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					//alert(data.result[0].message);
					$rootScope.$emit('eventGetVehicleStatus', null);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});
		}
	});