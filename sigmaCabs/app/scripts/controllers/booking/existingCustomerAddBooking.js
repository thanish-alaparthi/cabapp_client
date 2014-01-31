/*
Name: ExistingCustomerAddBooking
Description: Adds first time customer
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('ExistingCustomerAddBooking', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, modalWindow) {

		var scope = $scope;

		console.log('bookingDetail:', scope.bookingDetails);
		
		// load all the forms in the booking workarea view
		scope.personalDetailsForm = URLService.view('personalForm');
		scope.chatForm = URLService.view('chatForm');
		scope.bookingHistory = URLService.view('bookingHistory');
		scope.bookingTariffGrid = URLService.view('bookingTariffGrid');
		scope.bookingDetailsForm = URLService.view('bookingForm');
		scope.extraInfoDetails = URLService.view('extraInfoDetails');
		scope.bookingStatistics = URLService.view('bookingStatistics');



		// watch if dynamic field is added
		$scope.$on('dynamicFieldAdded', function(ev, sAddedField) {

			scope.bShowAddMoreFields = false;

			var j = '';
			for(var x in scope.emptyCustomerFields) {
				if(x == sAddedField) {
					delete scope.emptyCustomerFields[x];
				}
			}
			for(var x in scope.emptyCustomerFields) {
				if(x != ""){
					j = x ;
					break;
				}
			}
			scope.nextEmptyCustomerField = j;
			scope.bShowAddMoreFields = ( j) ? true : false;
			scope.$apply();
		});

		// watch to save the data
		scope.$watch('customerDetails', function(newVal, oldVal) {
			if(!angular.equals(newVal,oldVal)){
				scope.fnSaveCustomerDetails();
			}
		}, true);

		/*
			Save customer details function.
		*/
		scope.fnSaveCustomerDetails = function() {
			CustomerService.fnUpdateCustomerDetails({
				"id":scope.customerDetails.id, 
				"name" : scope.customerDetails.name, 
				"mobile" : scope.customerDetails.mobile,
				"altMobile" : scope.customerDetails.mobile2
			})
			.success(function(data, status, headers, config){
				console.log('Success CustomerSave: ',data);
			})
			.error(function(data, status, headers, config){
				console.log('error Customer Save: ',data);
			});
		};

		scope.fnSaveBooking = function() {
			BookingService.fnSaveBooking(scope.bookingDetails)
			.success(function(data, status, headers, config) {
				console.log('Success fnSaveBooking: ',data);
				alert('Booking Saved successfully.');
			})
			.error(function(data, status, headers, config){
				console.log('error fnSaveBooking: ',data);
			});
		};


		scope.fnBlockCustomer = function(){
			$scope.opts = {
				templateUrl: URLService.view('blockCustomerMain'),
				controller: 'blockCustomer',
				dialogClass: 'modalClass cancel-booking-container',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						return scope.bookingDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};


		scope.fnOpenCustomerRequest = function(){
			$scope.opts = {
				templateUrl: URLService.view('customerRequestMain'),
				controller: 'customerRequest',
				dialogClass: 'modalClass add-request',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						return scope.bookingDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};
	});