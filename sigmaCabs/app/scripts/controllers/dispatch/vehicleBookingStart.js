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
        scope.bookingStart = {};

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
                "driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
                "bookingId": "13",
                "currentKms": scope.bookingStart.currentKms,
                "deadMileage": "12",
                "reasonId": "2", // only in the case of poor
                "rating": "1", // only in the case of poor
                "comments": "this is test" // only in the case of poor
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