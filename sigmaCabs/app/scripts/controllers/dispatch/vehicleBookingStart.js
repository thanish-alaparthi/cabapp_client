/*
Name: blockCustomer
Description: blockCustomer
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingStart', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {
        var scope = $scope,
            currentTimeStamp = new Date().getTime(),
            pickupTimeStamp;
        console.log('inside vehicleBookingStart', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.vehicleReasonTypes = PrerequisiteService.fnGetReasonsById(5);
        scope.bookingStart = {};
        scope.bookingStart.ratingValue = 2;
        scope.bookingStart.nextBooking = scope.vehicleDetails.vehicleMainDetails.details.nextBooking;
        // Decide rating based on Pickup date and time vs current Date and time
        pickupTimeStamp = new Date(scope.vehicleDetails.vehicleMainDetails.details.pickupDate + ' ' + scope.vehicleDetails.vehicleMainDetails.details.pickupTime).getTime();
        console.log('pickupTimeStamp: ' + pickupTimeStamp);
        console.log('currentTimeStamp: ' + currentTimeStamp);
        if (pickupTimeStamp < currentTimeStamp) {
            scope.bookingStart.rating = "Poor";
            scope.bookingStart.moreInfo = true;
            scope.bookingStart.ratingValue = 1;
        } else {
            scope.bookingStart.rating = "Ok";
            scope.bookingStart.moreInfo = false;
            scope.bookingStart.ratingValue = 2;
        }
        scope.bookingStart.currentKms = scope.vehicleDetails.vehicleMainDetails.details.previousKms;
        scope.$watch('bookingStart.currentKms', function(newVal) {
            var currentKms = parseFloat(scope.bookingStart.currentKms),
                actualKms = scope.vehicleDetails.vehicleMainDetails.details.previousKms;

            currentKms = (isNaN(currentKms)) ? actualKms : currentKms;
            scope.bookingStart.deadMileage = currentKms - actualKms;
        }, true);


        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId || '',
                "currentKms": scope.bookingStart.currentKms,
                "deadMileage": scope.bookingStart.deadMileage,
                "nextBooking": scope.bookingStart.nextBooking,
                "reasonId": scope.bookingStart.reasonId, // only in the case of poor
                "rating": scope.bookingStart.ratingValue, //1 in case of poor and 2 in other case
                "comments": scope.bookingStart.comments // only in the case of poor
            };

            console.log(oData);
            // validations
            if (oData.bookingId === '') {
                alert('Not a valid booking!!!');
                return;
            } else if (oData.driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            } else if (isNaN(oData.currentKms)) {
                alert('Please enter valid Kms');
                return;
            } else if (oData.currentKms < scope.vehicleDetails.vehicleMainDetails.details.previousKms) {
                alert('Current Kms cannot be less than previous kms.');
                return;
            } else if (oData.rating === 1 && (oData.reasonId == '')) {
                alert('Please select valid Reason');
                return;
            }
            serverService.sendData('P',
                'booking/start',
                oData, scope.fnVehicleBookingStartSuccess, scope.fnVehicleBookingStartError);
        }

        scope.fnVehicleBookingStartSuccess = function(data, status, headers, config) {
            console.log('Success: ', data);
            scope.close();
            //alert(data.result[0].message);
            $rootScope.$emit('eventGetVehicleStatus', null);
        };
        scope.fnVehicleBookingStartError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });