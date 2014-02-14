/*
Name: blockCustomer
Description: blockCustomer
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingStart', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {
        var scope = $scope;
        console.log('inside vehicleBookingStart', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.vehicleReasonTypes = PrerequisiteService.fnGetReasons();
        scope.bookingStart = {};
        scope.vehicleDetails.actualKms = 500; // should get from API

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
                "vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
                "driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetials.bookingId,
                "currentKms": scope.bookingStart.currentKms,
                "deadMileage": scope.bookingStart.deadMileage,
                "reasonId": scope.bookingStart.reasonId, // only in the case of poor
                "rating": "1", // only in the case of poor
                "comments": scope.bookingStart.comments // only in the case of poor
            };

            DispatchService.fnVehicleBookingStart(scope.oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    alert(data.result[0].message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });