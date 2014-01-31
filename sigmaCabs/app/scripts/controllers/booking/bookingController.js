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
                        pickupDate : '29/01/2014',
                        pickupHours : '',
                        pickupMinutes : '',
                        pickupAddress : '',
                        pickupLandmark : '',
                        vehicleCount : parseInt('3'),
                        dropAddress : '',
                        passengerCount : '',
                        luggageType : '',
                        comments : '',
                        vehicleTypes : [2,1,3],
                        id: '2342342',
                        bookingState: '1',
                        paymentMode: '1',
                        customerId : '',
                        isPrimaryTraveller : '1',
                        primaryTravellerName:  '',
                        primaryTravellerMobile : ''
                    };


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
                    } else if( data.status==200 
                        && data.result
                        && data.result.length) {
                        console.log('>>>',data.result);
                        scope.customerDetails = data.result[0].customerDetails; // set the customer data which server response.
                        scope.bookingDetails = data.result[0].latestEnquiry;	// set the customer data which server response.
                        scope.bookingDetails.pickupDate = PrerequisiteService.fnFormatDate(scope.bookingDetails.pickupDate);    // setDate in DD/MM/YYYY format
                        scope.bookingDetails.pickupHours = PrerequisiteService.fnFormatHours(scope.bookingDetails.pickupTime);  // setHours 
                        scope.bookingDetails.pickupMinutes = PrerequisiteService.fnFormatMinutes(scope.bookingDetails.pickupTime);  // setMinutes
                        scope.bookingDetails.journeyType = '1';

                        //AltName and AltMobile comes from bookingAPI

                    } else {    // error in data.result object.
                        
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
