/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .run(function(AuthenticationService, $window, URLService, $rootScope) {
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
            })
    })
    .controller('bookingController', function($scope, $rootScope, URLService, BookingService, $routeParams, PrerequisiteService) {
        var scope = $scope;
        $scope.callTime = "05:30";
        $scope.customerID = "26012013001"

        $scope.showBookingDetails =  true;

        $scope.showBookingDetailsTab = function(){
            $scope.showTariffDetails =  false;
            $scope.showBookingDetails =  true;
        };

        $scope.showTariffDetailsTab = function(){
            $scope.showBookingDetails =  false;
            $scope.showTariffDetails =  true;
        };

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



        scope.customer = {
                    customerDetails: {
                        mobile: $routeParams.mobile,
                        name: '',
                        source: '',
                        email: '',
                        altMobile: '',
                        dob: '',
                        id: ''
                    },
                    bookingDetails : {
                        date : '',
                        pickupTime : '',
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
                    }
                };

                scope.bookingDetails = {};




        /* Add Views to the bookings */

        // get the phoneNumber from the URL if exists
        // console.log("Rout Params: ", $routeParams.mobile);

        scope.existingCustomerAddBooking = URLService.view("loadingText");
        scope.loadingText = "booking data"

        scope.fnLoadBookingView = function() {
            scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');


            $scope.$on('eventShowAddNewCustomer', function(ev, oData) {
                scope.showAddNewCustomerList = oData;
                scope.showCustomerList = !oData;

                if (scope.showCustomerList) {
                    scope.showExistingCustomerAddBooking = false;
                }
            });

            // existing customer is selected from the customer List grid
            $scope.$on('eventCustomerSelectedFromList', function(ev, oData) {
                scope.showExistingCustomerAddBooking = oData;
                scope.showCustomerList = !oData;
                if (scope.showCustomerList) {
                    scope.showAddNewCustomerList = false;
                }
            });


            //function to show new custoemr bookking
            scope.fnNewCustomerBooking = function() {
                scope.showExistingCustomerAddBooking = false;
                scope.showCustomerList = false;
                scope.showAddNewCustomerList = true;
            }

            //function to show new custoemr bookking
            scope.fnExistingCustomerBooking = function() {
                scope.showExistingCustomerAddBooking = true;
                scope.showCustomerList = false;
                scope.showAddNewCustomerList = false;
            }
            //function to show new custoemr bookking
            scope.fnViewCustomerList = function() {
                scope.showExistingCustomerAddBooking = false;
                scope.showCustomerList = true;
                scope.showAddNewCustomerList = false;
            }
        };

        scope.showExistingCustomerAddBooking = true;

        // since mobile is passed, hit server to get CustomerDetails Based on the server
        if ($routeParams.mobile) { // mobile passed
            // set the default view to Add a booking
            scope.showExistingCustomerAddBooking = true;

            // make a call to server to get the user details...
            BookingService.fnFindCustomerByMobile({
                mobile: $routeParams.mobile
            })
            .success(function(data, status, headers, config) {
                console.log('Success: ', data);
                scope.customer = data;	// set the customer data which server response.

                if(!scope.customer.bookingDetails){
                    scope.customer.bookingDetails = {};
                }

                scope.customer.bookingDetails.customerId = scope.customer.customerDetails.id;

                // set some default values in bookingDetails
                scope.customer.bookingDetails.customerId = scope.customer.id;

                // set scope.bookingDetails object
                scope.bookingDetails = scope.customer.bookingDetails

                scope.fnLoadBookingView();
            })
            .error(function(data, status, headers, config) {
                console.log('error: ', data);
                scope.customerDetails = {
                    'source': "Some Text"
                };
                alert('There was some error while getting customer details. ');
                scope.fnLoadBookingView();
            });
        } else {
            scope.fnLoadBookingView();
        }
    });
