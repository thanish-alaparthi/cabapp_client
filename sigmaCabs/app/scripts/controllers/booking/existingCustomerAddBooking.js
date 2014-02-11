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

		scope.fnRefreshBookingHistory = function(){
			BookingService.fnGetLatestCustomerBookings({
				id: scope.customerDetails.id,
				page: 1,
				limit: 5
			})
			.success(function(data, status, headers, config){				
				console.log('Success  fnGetLatestCustomerBookings: ',data);
				if(data.status == 500){
					console.warn("fnGetLatestCustomerBookings 500", data);
				} else {
					scope.bookingHistoryDetails = PrerequisiteService.fnFormatBookingHistoryData(data.result);
				}
			})
			.error(function(data, status, headers, config){
				console.log('Error  fnGetLatestCustomerBookings: ',data);
			});
		};

		scope.fnMultipurposeSearch = function(sSearch) {
			if(!sSearch){
        		return;
        	}
            var sSearchPre = sSearch.slice(0,2);
            if(sSearch.length < 3 ){
                return;
            }
            if(!isNaN(sSearchPre) && sSearch.length == 10){ // mobile
            	console.log('Searching by PoneNo.');
                scope.fnSearchCustomerByMobile(sSearch);
                return;
            }
            switch(sSearchPre.toLowerCase()){
                case 'ci':  // customerId                
            		console.log('Searching by customerID.');
                break;
                case 'bi': // bookingId
            		console.log('Searching by bookingNo.');
                break;
            }
		}


		// default search string data.
		scope.searchDetails = {
			searchString : ""
		};

        scope.$watch('searchDetails',function(){
            console.log("searchString changed...", scope.searchDetails);
        	scope.fnMultipurposeSearch(scope.searchDetails.searchString);
        },true);


		// watch to save the data
		scope.$watch('customerDetails', function(newVal, oldVal) {
			if(!angular.equals(newVal,oldVal)){
				if(scope.customerDetails.mobile && scope.customerDetails.name){
					scope.fnSaveCustomerDetails({
						"id":scope.customerDetails.id, 
						"name" : scope.customerDetails.name, 
						"mobile" : scope.customerDetails.mobile,
						"altMobile" : scope.customerDetails.altMobile
					});
				} else {
					console.log('Mobile and Name are mandatory in customer save.');
				}
			}
		}, true);

		// watch to save the data
		scope.$watch('searchedCustomerDetails', function(newVal, oldVal) {
			console.log('searchedCustomerDetails',scope.searchedCustomerDetails);
			if(!angular.equals(newVal,oldVal)){
				if( (scope.searchedCustomerDetails.altMobile || scope.searchedCustomerDetails.mobile)
					&& scope.searchedCustomerDetails.name){
					var sMainMobile = "", sAltMobile = "";
					if(scope.searchedCustomerDetails.mobile){
						sMainMobile = scope.searchedCustomerDetails.mobile;
						sAltMobile = scope.searchedCustomerDetails.altMobile;
					} else {
						sMainMobile = scope.searchedCustomerDetails.altMobile;
						sAltMobile = "";
					}
					scope.fnSaveSearchedCustomerDetails({
						"id":scope.searchedCustomerDetails.id, 
						"name" : scope.searchedCustomerDetails.name, 
						"mobile" : sMainMobile,
						"altMobile" : sAltMobile
					});
				} else {
					console.log('Mobile and Name are mandatory in customer save.');
				}
			}
		}, true);

		/*
			Save customer details function.
		*/
		scope.fnSaveCustomerDetails = function(oData) {
			CustomerService.fnUpdateCustomerDetails({
				"id":oData.id, 
				"name" : oData.name, 
				"mobile" : oData.mobile,
				"mobile2" : oData.altMobile
			})
			.success(function(data, status, headers, config){
				console.log('Success CustomerSave: ',data);
				if(data.status == 200){
					if(  data.result.hasOwnProperty('id')){
						scope.customerDetails.id = data.result.id;						
					}
					if((data.result.length && data.result[0].id)){
						scope.customerDetails.id = data.result[0].id;				
					}
				}
			})
			.error(function(data, status, headers, config){
				console.log('error Customer Save: ',data);
			});
		};

		/*
			Save searched customer details function.
		*/
		scope.fnSaveSearchedCustomerDetails = function(oData) {
			CustomerService.fnUpdateCustomerDetails({
				"id":oData.id, 
				"name" : oData.name, 
				"mobile" : oData.mobile,
				"mobile2" : oData.altMobile
			})
			.success(function(data, status, headers, config){
				console.log('Success CustomerSave: ',data);
				if(data.status == 200){
					if(  data.result.hasOwnProperty('id')){
						scope.searchedCustomerDetails.id = data.result.id;						
					}
					if((data.result.length && data.result[0].id)){
						scope.searchedCustomerDetails.id = data.result[0].id;				
					}
				}
			})
			.error(function(data, status, headers, config){
				console.log('error searched Customer Save: ',data);
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
				landmark2 : scope.bookingDetails.landmark2, 
				vehicleName : scope.bookingDetails.vehicleName, 
				vehicleType : scope.bookingDetails.vehicleType, 
				subJourneyType : scope.bookingDetails.subJourneyType, 
				bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,
				customerId : scope.customerDetails.id
			});
		};

		scope.fnSaveAsNewBooking = function() {
			console.log('Saving as new booking...');
			scope.fnApiSaveBooking({
				id : "", 
				pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
				pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
				pickupPlace : scope.bookingDetails.pickupPlace, 
				dropPlace : scope.bookingDetails.dropPlace, 
				primaryPassanger : (scope.bookingDetails.primaryPassanger ? scope.bookingDetails.primaryPassanger : scope.customerDetails.name),
				primaryMobile : (scope.bookingDetails.primaryMobile ? scope.bookingDetails.primaryMobile : scope.customerDetails.mobile), 
				extraMobile : scope.customerDetails.mobile2, 
				landmark1 : scope.bookingDetails.landmark1, 
				landmark2 : scope.bookingDetails.landmark2, 
				vehicleName : scope.bookingDetails.vehicleName, 
				vehicleType : scope.bookingDetails.vehicleType, 
				subJourneyType : scope.bookingDetails.subJourneyType, 
				bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,
				customerId : scope.customerDetails.id
			});
		};


		scope.fnBlockCustomer = function(){
			if(!scope.customerDetails || !scope.customerDetails.id){
				alert('Please enter customer details first.');
				return;
			}
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
					oCustomer : function(){
						return scope.customerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};


		scope.fnOpenCustomerRequest = function(){
			if(!scope.customerDetails || !scope.customerDetails.id){
				alert('Please enter customer details first.');
				return;
			}
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

				scope.fnRefreshBookingHistory();

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


        scope.fnSearchCustomer = function(){
            scope.fnMultipurposeSearch(scope.searchDetails.searchString);
        };

        scope.fnRefreshBookingTariffGrid = function(aTariffTypes) {
        	// since there is no way to find out proper plan for each tariffType, loop through and
        };

        // check whether boookingDetails are saved from cancelBooking or dispostion form
        $rootScope.$on('eventRefreshBookingHistory', function(ev, oData) {
        	console.log('~~~~~~~~~eventRefreshBookingHistory');
        	scope.fnRefreshBookingHistory();
        });

        // catch eventSingleTariffSelected to reload tariffGrid.
        $rootScope.$on('eventSingleTariffSelected', function(ev, oData) {
        	// single tariff will send oData.tariffType as id and not as an array.
        	// add the tariffType to booking details
        	scope.bookingDetails.tariffType = oData.tariffType;

        	scope.fnRefreshBookingTariffGrid([oData.tariffType]);
        });
	});