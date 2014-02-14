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

		console.log('ExistingCustomerAddBooking:', scope.bookingDetails);
		
		// load all the forms in the booking workarea view
		scope.personalDetailsForm = URLService.view('personalForm');
		scope.chatForm = URLService.view('chatForm');
		scope.bookingHistory = URLService.view('bookingHistory');
		scope.bookingTariffGrid = URLService.view('bookingTariffGrid');
		scope.bookingDetailsForm = URLService.view('bookingForm');
		scope.extraInfoDetails = URLService.view('extraInfoDetails');
		scope.bookingStatistics = URLService.view('bookingStatistics');

		// fn to refresh the booking History
		scope.fnRefreshBookingHistory = function(){
			BookingService.fnGetLatestCustomerBookings({
				id: scope.waCustomerDetails.id,
				page: 1,
				limit: 5
			})
			.success(function(data, status, headers, config){				
				scope.bookingHistoryDetails = [];
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





		/*
			Save customer details function.
		*/
		scope.fnCustomerDetailsBlured = function(){
			console.log('fnCustomerDetailsBlured');
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
		};
		scope.fnSearchedCustomerDetailsBlured = function(){
			console.log('fnSearchedCustomerDetailsBlured');

			// attach search number as customerMobile.
			var sSearch = scope.searchDetails.searchString;
			if(sSearch.length == 10){
				scope.searchedCustomerDetails.mobile = sSearch;
			}

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
				if(sAltMobile.length == 10 || sMainMobile.length== 10){
					scope.fnSaveSearchedCustomerDetails({
						"id":scope.searchedCustomerDetails.id, 
						"name" : scope.searchedCustomerDetails.name, 
						"mobile" : sMainMobile,
						"altMobile" : sAltMobile
					});
				}
			} else {
				console.log('Mobile and Name are mandatory in customer save.');
			}
		};
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
					if((data.result.length && data.result[0].id)){
						scope.customerDetails.id = data.result[0].id;				
					}
				}

				// check first whether searchedCustomer exists,
					// if dznt exists den assign workareaCustomer with customerDetails
				// else assign woarkAreasCustmer with searchedCustomerDetails
				if(scope.searchedCustomerDetails.id) {
					angular.copy(scope.searchedCustomerDetails, scope.waCustomerDetails);
				} else {
					angular.copy(scope.customerDetails, scope.waCustomerDetails);					
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

				// assign waCustomerDetails with searchedCustomerDetails
				angular.copy(scope.searchedCustomerDetails, scope.waCustomerDetails);
			})
			.error(function(data, status, headers, config){
				console.log('error searched Customer Save: ',data);
			});
		};

		scope.fnValidateBookingForm = function() {
			if(!scope.waCustomerDetails.id) {
				alert('Caller details are not specified. Please fill in the caller information first.');
				return false;
			}
			if(!scope.bookingDetails.pickupPlace){
				alert('Please enter a pickup place.');
				return false;
			}	
			if(!scope.bookingDetails.dropPlace){
				alert('Please enter a drop place.');
				return false;
			}		
			if(!scope.bookingDetails.tariffId){
				alert('Please select a tariff Plan.');
				return false;
			}
			if(!scope.bookingDetails.subJourneyType){
				alert('Please select a Sub-Journey type.');
				return false;
			}

			return true;
		};


		// fn to save the booking details
		scope.fnSaveBooking = function() {
			if(! scope.fnValidateBookingForm()){
				return;
			}

			scope.fnApiSaveBooking({
				id : scope.bookingDetails.id, 
				pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
				pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
				pickupPlace : scope.bookingDetails.pickupPlace, 
				dropPlace : scope.bookingDetails.dropPlace,
				tariffId : scope.bookingDetails.tariffId,
				landmark1 : scope.bookingDetails.landmark1, 
				landmark2 : scope.bookingDetails.landmark2, 
				vehicleName : scope.bookingDetails.vehicleName, 
				vehicleType : scope.bookingDetails.vehicleType, 
				subJourneyType : scope.bookingDetails.subJourneyType, 
				bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,
				customerId : scope.waCustomerDetails.id,
				refCustomerId : (scope.customerDetails.id !=scope.waCustomerDetails.id ) ? scope.customerDetails.id : null,
				reserveVehicleId : scope.reserveVehicleId
			});
		};

		scope.fnSaveAsNewBooking = function() {
			if(! scope.fnValidateBookingForm()){
				return;
			}

			console.log('Saving as new booking...');
			scope.fnApiSaveBooking({
				id : "", 
				pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
				pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
				pickupPlace : scope.bookingDetails.pickupPlace, 
				dropPlace : scope.bookingDetails.dropPlace,
				tariffId : scope.bookingDetails.tariffId,
				landmark1 : scope.bookingDetails.landmark1, 
				landmark2 : scope.bookingDetails.landmark2, 
				vehicleName : scope.bookingDetails.vehicleName, 
				vehicleType : scope.bookingDetails.vehicleType, 
				subJourneyType : scope.bookingDetails.subJourneyType, 
				bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,
				customerId : scope.waCustomerDetails.id,				
				refCustomerId : scope.customerDetails.id,
				reserveVehicleId : scope.reserveVehicleId
			});
		};


		scope.fnBlockCustomer = function(){
			if(!scope.waCustomerDetails || !scope.waCustomerDetails.id){
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
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};


		scope.fnOpenCustomerRequest = function(){
			if(!scope.waCustomerDetails || !scope.waCustomerDetails.id){
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
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.fnClearBookingForm = function() {
			scope.bookingDetails = {
	            pickupDate : PrerequisiteService.fnFormatDate(),
	            pickupHours : PrerequisiteService.fnFormatHours(),
	            pickupMinutes : PrerequisiteService.fnFormatMinutes(),
	            pickupAddress : '',
	            pickupLandmark : '',
	            dropAddress : '',
	            passengerCount : '',
	            luggageType : '',
	            comments : '',
	            vehicleType: '',
	            id: '',
	            customerId : ''
	        };
		};

		scope.fnApiSaveBooking = function(oData){
			BookingService.fnSaveBooking(oData)
			.success(function(data, status, headers, config) {				
				console.log('Success fnSaveBooking: ',data);

				if(data.status == 200){
					alert('Booking Saved successfully.');
					// clear booking form
					scope.fnClearBookingForm();
					scope.fnRefreshBookingHistory();
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

		// fn which gets triggered if searchbox is changed.
        scope.fnSearchCustomer = function(){
            scope.fnMultipurposeSearch(scope.searchDetails.searchString);
        };

        // fn which refreshes the tariff grid.
        scope.fnRefreshBookingTariffGrid = function(tariffDetails) {
        	scope.tariffGridData = tariffDetails;
        };

        // check whether boookingDetails are saved from cancelBooking or dispostion form
        $rootScope.$on('eventRefreshBookingHistory', function(ev, oData) {
        	console.log('eventRefreshBookingHistory');
        	scope.fnRefreshBookingHistory();
        });

        // catch eventSingleTariffSelected to reload tariffGrid.
        $rootScope.$on('eventSingleTariffSelected', function(ev, oData) {
        	// single tariff will send oData.tariffType as id and not as an array.
        	// add the tariffType to booking details
        	console.log('eventSingleTariffSelected triggered', oData);
        	scope.bookingDetails.tariffId = oData.tariffId;
        	scope.fnRefreshBookingTariffGrid(oData.tariffDetails);
        });

        // catch eventVehicleTypeChanged to reload tariffGrid.
        $rootScope.$on('eventVehicleTypeChanged', function(ev, oData) {
        	console.log('eventVehicleTypeChanged triggered', oData);
        	scope.bookingDetails.tariffId = null;
        	scope.fnRefreshBookingTariffGrid(null);
        });


        // default search string data.
		scope.searchDetails = {
			searchString : ""
		};

		// watch for waCustomerDetails just to make sure it works
        scope.$watch('waCustomerDetails',function(newVal,oldVal){
            console.log("waCustomerDetails changed...", newVal,oldVal);
        },true);
		// watch for searchString change to make a search for customer.
        scope.$watch('searchDetails',function(){
            console.log("searchString changed...", scope.searchDetails);
        	scope.fnMultipurposeSearch(scope.searchDetails.searchString);
        },true);
        // watch for customerDetails to save the data of customer
		scope.$watch('customerDetails', function(newVal, oldVal) {
			if(!angular.equals(newVal,oldVal)){				
				console.log('Customer details changed....');
				
			}
		}, true);

		// watch for searchedCustomerDetails to save the data of searchedCustomer
		scope.$watch('searchedCustomerDetails', function(newVal, oldVal) {
			if(!angular.equals(newVal,oldVal)){				
					console.log('searchedCustomerDetails changed');
			}
		}, true);

		// watch for tariffGridData change to refresh tariffGrid
        scope.$watch('tariffGridData', function(newVal, oldVal){
	    	console.log('scope.tariffGridData changed', newVal);
	    });
	});