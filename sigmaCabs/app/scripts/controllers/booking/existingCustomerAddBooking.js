/*
Name: ExistingCustomerAddBooking
Description: Adds first time customer
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('ExistingCustomerAddBooking', function($scope, PrerequisiteService,PreConfigService, BookingService,CustomerService, $rootScope, URLService, modalWindow) {

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
			scope.fnApiSaveBooking({
				id : scope.bookingDetails.id, 
				pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
				pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
				pickupPlace : scope.bookingDetails.pickupPlace, 
				dropPlace : scope.bookingDetails.dropPlace, 
				primaryPassanger : (scope.bookingDetails.primaryPassanger ? scope.bookingDetails.primaryPassanger : scope.customerDetails.name),
				primaryMobile : (scope.bookingDetails.primaryMobile ? scope.bookingDetails.primaryMobile : scope.customerDetails.mobile), 
				extraMobile : scope.customerDetails.mobile2, 
				landmark1 : scope.bookingDetails.landmark1, 
				landmark2 : scope.bookingDetails.landmark1, 
				vehicleName : scope.bookingDetails.vehicleName, 
				vehicleType : scope.bookingDetails.vehicleType, 
				bookingDate : "", 
				bookingTime : "",
				bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,
				customerId : scope.customerDetails.id
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
					},
					oCustomer : function(){
						return scope.customerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.fnApiSaveBooking = function(oData){
			BookingService.fnSaveBooking(oData)
			.success(function(data, status, headers, config) {				
				console.log('Success fnSaveBooking: ',data);
				if(data.status == 200){
					alert('Booking Saved successfully.');
					return;
				}

				if(data.status == 500){
					if(	data.result 
						& data.result.length
					){
						alert(data.result[0].message);
					} else {
						alert('There was some error in saving booking details.');
					}
				}
			})
			.error(function(data, status, headers, config){
				console.log('error fnSaveBooking: ',data);
			});
		};
	});