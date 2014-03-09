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
		scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
		scope.vehicleComplaintReasonTypes = PrerequisiteService.fnGetReasons();
		scope.vehicleSuggestionReasonTypes = PrerequisiteService.fnGetReasons();
		scope.vehiclePriorities = PrerequisiteService.priorities;

		scope.vehicleDetails = oVehicleData;
		scope.feedback = {};
		scope.suggestions = {};
		console.log(scope.vehicleDetails.vehicleMainDetails);
		scope.saveText = 'Save Complaint'; //default text for save button.
		scope.tab = 1;

		scope.fnIsActive = function(iTab) {
			return scope.tab == iTab ? true : false;
		};

		scope.fnChangeSaveText = function() {
			switch (scope.tab) {
				case 1:
					scope.saveText = 'Save Complaint'
					break;
				case 2:
					scope.saveText = 'Save Suggestions'
					break;
				case 3:
				case 4:
					scope.saveText = 'Close'
					break;
			}
		};

		scope.fnRestApiError = function(data, status, headers, config) {
			console.log("error fnSaveCustomerRequest", data);
		};
		scope.fnRestApiSuccess = function(data, status, headers, config) {
			console.log("Success fnSaveCustomerRequest", data);
			scope.close();
			//alert(data.result[0].message);
		};

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveAndCloseRequest = function() {
			var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '';

			switch (scope.tab) {
				case 1: // Complaint Save
					var oData = {
						"id": "", // need to check with lala about id
						"requester": scope.feedback.categoryId,
						"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
						"driverId": driverId,
						"bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
						"reasonId": scope.feedback.reasonId || '',
						"priority": scope.feedback.priorityId || '',
						"comments": scope.feedback.comments
					};

					if (oData.requester === '' || oData.reasonId === '') {
						alert('Please select required information');
						return;
					} else if (scope.feedback.categoryId === 4 && driverId === '') {
						alert('Please select driver in vehicle information');
						return;
					}

					DispatchService.fnVehicleComplaint(oData)
						.success(scope.fnRestApiSuccess)
						.error(scope.fnRestApiError);
					break;
				case 2: // Suggestion Save
					var oData = {
						"id": "", // need to check with lala about id
						"requester": scope.suggestions.categoryId,
						"vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
						"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
						"bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
						"reasonId": scope.suggestions.reasonId || '',
						"priority": scope.suggestions.priorityId || '',
						"comments": scope.suggestions.comments
					};

					if (oData.requester === '' || oData.reasonId === '') {
						alert('Please select required information');
						return;
					} else if (scope.suggestions.categoryId === 4 && driverId === '') {
						alert('Please select driver in vehicle information');
						return;
					}

					DispatchService.fnVehicleSuggestion(oData)
						.success(scope.fnRestApiSuccess)
						.error(scope.fnRestApiError);
					break;
				case 3: // Feedback Close
				case 4: // Ratings Close
					scope.close();
					break;
			};

		};
	});