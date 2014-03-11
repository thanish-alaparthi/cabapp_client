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

		scope.changePhone = {};
		scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
		scope.vehicleChangePhoneReasonTypes = PrerequisiteService.fnGetReasons();

		scope.vehicleDetails = oVehicleData;
		scope.changePhone.phoneChangeComments = '';

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveAndClose = function() {
			var oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
				"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
				"mobile": scope.changePhone.newMobile || '',
				"changedBy": scope.changePhone.categoryId || '',
				"reasonId": scope.changePhone.reasonId || '',
				"comments": scope.changePhone.phoneChangeComments
			};

			// validations
			if (oData.mobile === '' || oData.mobile.length < 10) {
				alert('Please enter valid Mobile No.');
				return;
			} else if (oData.changedBy === '' || oData.reasonId === '') {
				alert('Please select required information');
				return;
			}

			console.log(oData);
			serverService.sendData('P',
				'vehicle/mobilechange',
				oData, scope.fnChangeVehiclePhoneSuccess, scope.fnChangeVehiclePhoneError);
		}

		scope.fnChangeVehiclePhoneSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			//alert(data.result[0].message);
		};
		scope.fnChangeVehiclePhoneError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});