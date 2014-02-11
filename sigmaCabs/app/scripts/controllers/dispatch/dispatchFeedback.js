/*
Name: changeVehicleLocation
Description: changeVehicleLocation
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('dispatchFeedback', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside dispatchFeedback', oVehicleData);

		scope.vehicleDetails = oVehicleData;
		console.log(scope.vehicleDetails.vehicleMainDetials);
		scope.tab = 1;

		scope.fnIsActive = function(iTab){
			return scope.tab == iTab ? true : false;
		};

		scope.fnChangeSaveText = function(){
			switch(scope.tab){
				case 1:
					scope.saveText = 'Save Complaint'
				break;
				case 2:
					scope.saveText = 'Save Suggestions'
				break;
				case 3:
					scope.saveText = 'Save Feedback'
				break;
				case 4:
					scope.saveText = 'Ratings'
				break;
			}
		};

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			/*scope.oData = {
				"vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
				"driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
				"location": scope.changeLocation.newLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.changeLocation.currentKms
			};

			DispatchService.fnVehicleChangeLocation(scope.oData)
				.success(function(data, status, headers, config) {
					console.log('Success: ', data);
					scope.close();
					alert(data.result[0].message);
				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', data)
				});*/
		}
	});