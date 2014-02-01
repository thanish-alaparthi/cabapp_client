/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .run(function(AuthenticationService, $window, URLService, $rootScope, PrerequisiteService) {
        // check for userSession.. and redirect to login screen if session dznt exists.
        AuthenticationService.getSession()
            .success(function(oData) {
                $rootScope.$broadcast('userInfoFromSession', {
                    "displayName": "Mario Ray",
                    "role": 1,
                    "id": 234565434
                });
                return;
                if (oData.status != 200) {
                    $window.location = URLService.page('logout');

                } else {
                    // trigger the event to show all the userName
                    $rootScope.$broadcast('userInfoFromSession', oData.result.userInfo);

                }
            });
    })
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
        $scope.callTime = "05:30";

        $scope.showBookingDetails =  true;

        $scope.showBookingDetailsTab = function(){
            $scope.showTariffDetails =  false;
            $scope.showBookingDetails =  true;
        };

        $scope.showTariffDetailsTab = function() {
            $scope.showBookingDetails =  false;
            $scope.showTariffDetails =  true;
        };

        // Set the default Data
        scope.customerDetails = {
                        name : '',
                        callerPhone : $routeParams.mobile,
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


        /* Add Views to the bookings */

        // get the phoneNumber from the URL if exists
        // console.log("Rout Params: ", $routeParams.mobile);

        scope.existingCustomerAddBooking = URLService.view("loadingText");
        scope.loadingText = "booking data"

        scope.fnLoadUnexpectedError = function() {
            scope.existingCustomerAddBooking = URLService.view('errorResponseFormatMisMatch');
        };
        scope.fnLoadBookingView = function() {
            scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');
        };

        scope.showExistingCustomerAddBooking = true;

        scope.fnSearchCustomerByMobile = function(){
            console.log('fnSearchCustomerByMobile');
        };

        scope.fnInit = function() {
            // since mobile is passed, hit server to get CustomerDetails Based on the server
            if ($routeParams.mobile) { // mobile passed
                // set the default view to Add a booking
                scope.showExistingCustomerAddBooking = true;

                // make a call to server to get the user details...
                BookingService.fnFindCustomerByMobile({
                    mobile: $routeParams.mobile
                })
                .success(function(data, status, headers, config) {
                    console.log('Success fnFindCustomerByMobile: ', typeof data, data);

                    if(typeof data !='object') {    // misMatched data is sent from the server.
                        scope.fnLoadUnexpectedError();  // show a red error msg.
                        return;
                    }

                    if(data.status == 500){ // no data found of customer/booking 
                        console.log('500 fnFindCustomerByMobile');
                        alert('erro: ');
                    } else if( data.status==200 
                        && data.result
                        && data.result.length) {
                        console.log('>>>',data.result);
                        scope.customerDetails = data.result[0].customerDetails; // set the customer data which server response.

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
                            var iCount = data.result[0].bookingHistory.length;
                            for(var i=0;i<iCount;i++){
                                var oBh = data.result[0].bookingHistory[i];
                                scope.bookingHistoryDetails.push({
                                    srno : (i+1),
                                    id : oBh.id,
                                    bookingCode : oBh.bookingCode,
                                    bookingStatus : (i==2 ? '7' : oBh.bookingStatus) ,
                                    bookingStatusName : PrerequisiteService.fnGetBookingStatusName(oBh.bookingStatus),
                                    dropPlace : oBh.dropPlace,
                                    pickupDate : oBh.pickupDate,
                                    pickupPlace : oBh.pickupPlace,
                                    pickupTime : PrerequisiteService.fnFormatHours(oBh.pickupTime) + ':' + PrerequisiteService.fnFormatMinutes(oBh.pickupTime),
                                    primaryPassanger : oBh.primaryPassanger,
                                    subJourneyType : PrerequisiteService.fnGetJourneyTypeName(oBh.subJourneyType)
                                });
                            }
                        }
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
            }
        }



        // Main Controller Init Point
        // // waits until configuration/prerequisits data loads always
        $rootScope.$on('eventPrerequisitsLoaded', function(){
            scope.fnInit();
        });

        scope.searchString = "";

        scope.$watch('searchString',function(oldVal,newVal){
            var sSearchPre = scope.searchString.slice(0,2);
            if(sSearchPre.length < 3 ){
                return;
            }
            if(!isNaN(sSearchPre)){ // mobile
                scope.fnSearchCustomerByMobile();
                return;
            }
            switch(sSearchPre.toLowerCase()){
                case 'ci':  // customerId
                break;
                case 'bi': // customerId
                break;
            }
        })
    });
