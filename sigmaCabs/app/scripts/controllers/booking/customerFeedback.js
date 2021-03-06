/*
Name: dispositionBooking
Description: canceling a booking
Date: 03Feb2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('customerFeedback', function(oBooking, $rootScope, oCustomer, $scope, $dialog, dialog, wizardHandler, $http, BookingService, PrerequisiteService, PreConfigService, URLService, UsersService, VehiclesService, appUtils, serverService) {

		var scope = $scope;
		console.log('inside customerFeedback', oBooking, oCustomer);

		scope.customerDetails = oCustomer;
		scope.bookingDetails = oBooking;
		scope.feedback = {};
		scope.suggestions = {};
		scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
		scope.vehicleComplaintReasonTypes = PrerequisiteService.fnGetReasonsById(2);
		scope.vehicleSuggestionReasonTypes = PrerequisiteService.fnGetReasonsById(3);
		scope.vehiclePriorities = PrerequisiteService.priorities;

		scope.feedBackRatings = PrerequisiteService.fnGetFeedbackRatings();

		scope.saveText = 'Save Complaint'; //default text for save button.
		scope.tab = 1;

		scope.ratingsAndFeedback = {
			callTakerRating : '',
			callTakerFeedback : '',
			driverRating : '',
			driverFeedback : '',
			vehicleRating : '',
			vehicleFeedback : '',
			companyRating : '',
			companyFeedback : ''
		};

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
					scope.saveText = 'Save Rating & Feedback'
					break;
			}
		};

		scope.fnRestApiError = function(data, status, headers, config) {
			alert('Error in processing your request..');
			console.log("error fnSaveCustomerRequest", data);
		};
		scope.fnRestApiSuccess = function(data, status, headers, config) {
			console.log("Success fnSaveCustomerRequest", data);
			scope.close();
			alert(data[0].message);
		};

		scope.close = function() {
			dialog.close();
		}
		
		scope.fnSaveAndCloseRequest = function() {
			var driverId = scope.bookingDetails.selectedDriver || '';

			switch (scope.tab) {
				case 1: // Complaint Save
					var oData = {
						"id": "", // need to check with lala about id
						"requester": scope.feedback.categoryId,
						"vehicleId": scope.bookingDetails.vehicleId || null,
						"driverId": driverId,
						"bookingId": scope.bookingDetails.bookingId || null,
						"reasonId": scope.feedback.reasonId || '',
						"priority": scope.feedback.priorityId || '',
						"source": 1, // 1 -> Calltaker, 2 -> Dispatcher
						"comments": scope.feedback.comments || ''
					};

					console.log(oData);
					// validations
					if (oData.requester === '' || oData.reasonId === '' || oData.comments === '') {
						alert('Please select required information');
						return;
					} else if (scope.feedback.categoryId === 4 && driverId === '') {
						alert('Please select driver in vehicle information');
						return;
					}

					serverService.sendData('P',
						'booking/complaint',
						oData, scope.fnRestApiSuccess, scope.fnRestApiError);
					break;
				case 2: // Suggestion Save
					var oData = {
						"id": "", // need to check with lala about id
						"requester": scope.suggestions.categoryId,
						"vehicleId": scope.bookingDetails.vehicleId || '',
						"driverId": driverId || '',
						"bookingId": scope.bookingDetails.bookingId || '',
						"reasonId": scope.suggestions.reasonId || '',
						"priority": scope.suggestions.priorityId || '',
						"source": 1, // 1 -> Calltaker, 2 -> Dispatcher
						"comments": scope.suggestions.comments
					};
					
					console.log(oData);
					// validations
					if (oData.requester === '' || oData.reasonId === '' || oData.comments === '') {
						alert('Please select required information');
						return;
					} else if (scope.suggestions.categoryId === 4 && driverId === '') {
						alert('Please select driver in vehicle information');
						return;
					}

					serverService.sendData('P',
						'booking/suggestion',
						oData, scope.fnRestApiSuccess, scope.fnRestApiError);
					break;
				case 3: // Feedback & ratings
					var oData = {
						feedbacks : [{
							feedbackId : '1',	// callTaker
							customerId : scope.bookingDetails.customerId,
							feedbackValue : scope.ratingsAndFeedback.callTakerRating,
							message : scope.ratingsAndFeedback.callTakerFeedback 
						}, {
							feedbackId : '2',	// driver
							customerId : scope.bookingDetails.customerId,
							feedbackValue : scope.ratingsAndFeedback.driverRating,
							message : scope.ratingsAndFeedback.driverFeedback 
						}, {
							feedbackId : '3',	// vehicle
							customerId : scope.bookingDetails.customerId,
							feedbackValue : scope.ratingsAndFeedback.vehicleRating,
							message : scope.ratingsAndFeedback.vehicleFeedback 
						}, {
							feedbackId : '4',	// company
							customerId : scope.bookingDetails.customerId,
							feedbackValue : scope.ratingsAndFeedback.companyRating,
							message : scope.ratingsAndFeedback.companyFeedback 
						}]
					};
					
					console.log(oData);
					// validations
					if (   (!scope.ratingsAndFeedback.callTakerFeedback && !scope.ratingsAndFeedback.callTakerRating)
						&& (!scope.ratingsAndFeedback.driverFeedback && !scope.ratingsAndFeedback.driverRating)
						&& (!scope.ratingsAndFeedback.vehicleFeedback && !scope.ratingsAndFeedback.vehicleRating)
						&& (!scope.ratingsAndFeedback.companyFeedback && !scope.ratingsAndFeedback.companyRating)
					) {
						alert('Please select required information');
						return;
					}

					serverService.sendData('P',
						'booking/customerFeedback',
						oData, scope.fnRestApiSuccess, scope.fnRestApiError);
				break;
			};

		};
	});