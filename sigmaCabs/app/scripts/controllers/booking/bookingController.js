/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('bookingController', function($scope, $rootScope, URLService, BookingService, $routeParams, PrerequisiteService) {

        //attach safeApply
        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };



        // Get the preRequisiteData
        PrerequisiteService.fnGetPrerequisites();


        var scope = $scope;

        // save the getCall phone in scope.
        scope.callerPhone = $routeParams.mobile;

        // show the current time as callTime
        scope.callTime = PrerequisiteService.fnGetCallTime();
        scope.headCustomerCode = "-";

        scope.searchDetails = {
            searchString : ''
        };

        // variable which holds tariffGrid data
        scope.tariffGridData = null;

        scope.showBookingDetails =  true;        
        scope.showExistingCustomerAddBooking = true;
        scope.callerInfo = "";
        scope.tmpDetails = {};

        scope.showBookingDetailsTab = function(){
            $scope.showTariffDetails =  false;
            $scope.showBookingDetails =  true;
        };

        scope.showTariffDetailsTab = function() {
            $scope.showBookingDetails =  false;
            $scope.showTariffDetails =  true;
        };

        // there can be a scenario wherein existing user calls, but asks to book for another existing or new customer.
        // for that issue we are maintaining a separate object called workareaCustomerDetails in short waCustomerDetails
        scope.waCustomerDetails = {};

        // variable which stores searchedCustomerDetails
        scope.searchedCustomerDetails = {
            name : '',
            mobile : '',
            altMobile : ''
        };

        // Set the default Data
        scope.customerDetails = {
            name : '',
            callerPhone : scope.callerPhone,
            mobile2 : '',
            id : ''
        };
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
        scope.bookingHistoryDetails = [];

        // add the loading text message
        scope.existingCustomerAddBooking = URLService.view("loadingText");
        scope.loadingText = "booking data";

        // fn which loads unexpected error
        scope.fnLoadUnexpectedError = function() {
            scope.existingCustomerAddBooking = URLService.view('errorResponseFormatMisMatch');
        };
        // fn which loads booking view
        scope.fnLoadBookingView = function() {
            scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');
        };

        // fn to search customer by mobile.
        scope.fnSearchCustomerByMobile = function(sMobile){
            BookingService.fnFindCustomerByMobile({
                mobile: sMobile
            })
            .success(function(data, status, headers, config) {
                if(data.status == 500){ // no data found of customer/booking 
                    console.log('500 fnSearchCustomerByMobile', data);
                    // make callPhone as mobile 
                    scope.customerDetails.mobile = scope.callerPhone;
                } else if( data.status==200 
                    && data.result) {
                    scope.fnSetCustomerDetails(data, true);                        
                } else {    // error in data.result object.
                    console.log('Erro in result: fnSearchCustomerByMobile', data);   
                }
            })
            .error(function(data, status, headers, config) {
            });
        };

        // fn which sets the customer details in the model.
        scope.fnSetCustomerDetails = function(data, isFromSearchBox) {
            // set the customerCode
            scope.headCustomerCode = data.result[0].customerDetails.customerCode || "LalaSendTheCOde";
            scope.headCustomerCategory = data.result[0].customerDetails.category;
            scope.headCustomerGrade = PrerequisiteService.fnGetGradeById(data.result[0].customerDetails.grade).grade;
            scope.headCustomerTripCount = data.result[0].customerDetails.tripCount;
            scope.headCustomerDiscount = data.result[0].customerDetails.discount;

            scope.callerInfo = " (Existing Caller)";
            
            if(isFromSearchBox){
                scope.searchedCustomerDetails = data.result[0].customerDetails; // set the customer data which server response.

                // if callerPhone is altPHone den display mainPhone as altPhone
                if(scope.searchDetails.searchString == scope.searchedCustomerDetails.mobile2){
                    scope.searchedCustomerDetails.altMobile = scope.searchedCustomerDetails.mobile;
                } else {
                    scope.searchedCustomerDetails.altMobile = scope.searchedCustomerDetails.mobile2;
                }
                // assign workareaCustmerDetails with searchedCustomerDetails
                angular.copy(scope.searchedCustomerDetails, scope.waCustomerDetails);
            } else {
                scope.customerDetails = data.result[0].customerDetails; // set the customer data which server response.

                // if callerPhone is altPHone den display mainPhone as altPhone
                if(scope.callerPhone == scope.customerDetails.mobile2){
                    scope.customerDetails.altMobile = scope.customerDetails.mobile;
                } else {
                    scope.customerDetails.altMobile = scope.customerDetails.mobile2;
                }
                //assign workareaCustomerDetails with customerDetails
                angular.copy(scope.customerDetails, scope.waCustomerDetails);
            }


            // check if enquiry is sent.
            if(data.result[0].hasOwnProperty('latestEnquiry')){                            
                scope.bookingDetails = data.result[0].latestEnquiry;    // set the customer data which server response.
                scope.bookingDetails.pickupDate = PrerequisiteService.fnFormatDate(scope.bookingDetails.pickupDate);    // setDate in DD/MM/YYYY format
                scope.bookingDetails.pickupHours = PrerequisiteService.fnFormatHours(scope.bookingDetails.pickupTime);  // setHours 
                scope.bookingDetails.pickupMinutes = PrerequisiteService.fnFormatMinutes(scope.bookingDetails.pickupTime);  // setMinutes
            }
            // check if enquiry is sent.
            if(data.result[0].hasOwnProperty('bookingHistory')){
                // make the historyDetails in readable form instead of ids
                scope.bookingHistoryDetails = PrerequisiteService.fnFormatBookingHistoryData(data.result[0].bookingHistory);
            }
        };


        scope.fnInit = function() {
            // since mobile is passed, hit server to get CustomerDetails Based on the server
            if (scope.callerPhone) { // mobile passed
                // make a call to server to get the user details...
                BookingService.fnFindCustomerByMobile({
                    mobile: scope.callerPhone
                })
                .success(function(data, status, headers, config) {
                    console.log('Success fnFindCustomerByIncomingCallPhone: ', typeof data, data);

                    if(typeof data !='object') {    // misMatched data is sent from the server.
                        scope.fnLoadUnexpectedError();  // show a red error msg.
                        return;
                    }

                    if(data.status == 500){ // no data found of customer/booking 
                        console.log('500 fnFindCustomerByMobile', data);
                        scope.callerInfo = " (New Caller)";
                        // make callPhone as mobile 
                        scope.customerDetails.mobile = scope.callerPhone;
                    } else if( data.status==200 
                        && data.result
                        && data.result.length) {
                        scope.fnSetCustomerDetails(data);                        
                    } else {    // error in data.result object.
                        console.log('Erro in result: fnFindCustomerByMobile', data);   
                    }                    

                    scope.fnLoadBookingView();
                })
                .error(function(data, status, headers, config) {
                    console.log('error fnFindCustomerByMobile: ', data);
                    
                    alert('There was some error while getting customer details. ');
                    scope.fnLoadBookingView();
                });
            } else {    
                scope.fnLoadBookingView();
                console.warn('Landing on callTaker view even when there is no in-coming call.');
            }
        };

        scope.fnFormatTariffGridDetails = function(oData){
            console.log('fnFormatTariffGridDetails', oData);
        };

        // Main Controller Init Point
        // // waits until configuration/prerequisits data loads always
        $rootScope.$on('eventPrerequisitsLoaded', function(){
            scope.fnInit();
        });

        $rootScope.$on('eventSelectedBookingFromHistory', function(ev, oData) {
            scope.bookingDetails = {};
            console.log('eventSelectedBookingFromHistory: ', oData);

            scope.tmpDetails.tmpVehicleType = oData.bookingDetails.vehicleType;
            scope.tmpDetails.tmpVehicleName = oData.bookingDetails.vehicleName;

            var oTmpJt = PrerequisiteService.fnGetJourneyTypeBySubJourneyTypeId(oData.bookingDetails.subJourneyType);
            scope.tmpDetails.tmpJourneyType = oTmpJt.parentId;

            scope.bookingDetails = oData.bookingDetails;
            scope.bookingDetails.pickupDate = PrerequisiteService.fnFormatDate(oData.bookingDetails.pickupDate);    // setDate in DD/MM/YYYY format
            scope.bookingDetails.pickupHours = PrerequisiteService.fnFormatHours(oData.bookingDetails.pickupTime);  // setHours 
            scope.bookingDetails.pickupMinutes = PrerequisiteService.fnFormatMinutes(oData.bookingDetails.pickupTime);  // setMinutes

            // also load tariffGridData
            scope.fnFormatTariffGridDetails(PrerequisiteService.fnGetTariffById(oData.bookingDetails.tariffId));            

            scope.headBookingType = scope.bookingDetails.bookingStatusName;
            scope.headBookingCode = scope.bookingDetails.bookingCode;

        });
    });
