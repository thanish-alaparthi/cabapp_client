/*
Name: ExistingCustomerAddBooking
Description: Adds first time customer
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('ExistingCustomerAddBooking', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog) {

		var scope = $scope;
			
		scope.bShowAddMoreFields = true;

		scope.pickupPlaceTypes = PrerequisiteService.pickupPlaceTypes;
		scope.bookingStatuses = PrerequisiteService.bookingStatuses;
		scope.paymentModes = PrerequisiteService.paymentModes;
		scope.isPrimaryTraveller = PrerequisiteService.isPrimaryTraveller;

		scope.extraFieldTypes = {
			'pickupPlace' : 'pickupPlaceTypes'
		}

		/*
			Function to get the empty fields in customer details
		*/
		scope.fnGetEmptyCustomerFields = function() {
			var aRtn = {};

			for(var sField in PrerequisiteService.customerFields){
				if(!scope.customer.customerDetails[sField]){
					aRtn[sField] = PrerequisiteService.customerFields[sField];
				}
			}
			scope.nextEmptyCustomerField = sField;
			return aRtn;
		}

		// more fields dropDown
		scope.emptyCustomerFields = scope.fnGetEmptyCustomerFields(PrerequisiteService.customerFields);

		scope.personalDetailsForm = URLService.view('personalForm');
		scope.bookingHistory = URLService.view('bookingHistory');
		scope.bookingDetailsForm = URLService.view('bookingForm');
		scope.extraInfoDetails = URLService.view('extraInfoDetails');



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
		scope.$watch('customer.customerDetails', function(newVal, oldVal) {
			if(!angular.equals(newVal,oldVal)){
				scope.fnSaveCustomerDetails();
			}
		}, true);

		/*
			Save customer details function.
		*/
		scope.fnSaveCustomerDetails = function() {
			CustomerService.fnUpdateCustomerDetails(scope.customerDetails)
			.success(function(data, status, headers, config){
				console.log('Success CustomerSave: ',data);
			})
			.error(function(data, status, headers, config){
				console.log('error Customer Save: ',data);
				scope.customerDetails = {
					'source' : "Some Text"
				};
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
	});