/*
Name: blockCustomer
Description: blockCustomer
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingStart', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {
        var scope = $scope,
            currentTimeStamp = new Date().getTime(),
            pickupTimeStamp;
        console.log('inside vehicleBookingStart', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.vehicleReasonTypes = PrerequisiteService.fnGetReasons();
        scope.bookingStart = {};
        scope.vehicleDetails.actualKms = 500; // should get from API
        scope.bookingStart.nextBooking = "1"; // should get from API
        // Decide rating based on Pickup date and time vs current Date and time
        pickupTimeStamp = new Date(scope.vehicleDetails.vehicleMainDetails.details.pickupDate + ' ' + scope.vehicleDetails.vehicleMainDetails.details.pickupTime).getTime();
        console.log('pickupTimeStamp: ' + pickupTimeStamp);
        console.log('currentTimeStamp: ' + currentTimeStamp);
        if (pickupTimeStamp < currentTimeStamp) {
            scope.bookingStart.rating = "Poor";
            scope.bookingStart.moreInfo = true;
        } else {
            scope.bookingStart.rating = "Ok";
            scope.bookingStart.moreInfo = false;
        }

        scope.$watch('bookingStart.currentKms', function(newVal) {
            var currentKms = parseFloat(scope.bookingStart.currentKms),
                actualKms = scope.vehicleDetails.actualKms;

            currentKms = (isNaN(currentKms)) ? actualKms : currentKms;
            scope.bookingStart.deadMileage = currentKms - actualKms;
        }, true);


        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId || '',
                "currentKms": scope.bookingStart.currentKms,
                "deadMileage": scope.bookingStart.deadMileage,
                "nextBooking": scope.bookingStart.nextBooking,
                "reasonId": scope.bookingStart.reasonId, // only in the case of poor
                "rating": "1", // only in the case of poor
                "comments": scope.bookingStart.comments // only in the case of poor
            };

            DispatchService.fnVehicleBookingStart(scope.oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    //alert(data.result[0].message);
                    $rootScope.$emit('eventGetVehicleStatus', null);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });