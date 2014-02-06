/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingStart', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingStart', oVehicleData);

        scope.vehicleDetails = oVehicleData;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": "2",
                "driverId": "13",
                "bookingId": "13",
                "currentKms": "1523",
                "deadMileage": "12",
                "reasonId": "2", // only in the case of poor
                "rating": "1", // only in the case of poor
                "comments": "this is test" // only in the case of poor
            };

            DispatchService.fnVehicleBookingStart(scope.oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    alert(data.result.message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });