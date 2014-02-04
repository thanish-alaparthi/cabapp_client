/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, dispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingClose', oVehicleData);

        scope.vehicleDetails = oVehicleData;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": "3",
                "driverId": "123",
                "bookingId": "13",
                "startKms": "1523",
                "currentKms": "1563",
                "actualKms": "40",
                "startTime": "11:30:25",
                "currentTime": "14:30:25",
                "timeConsumed": "240",
                "tariffOpted": "3",
                "tariffActual": "4",
                "totalAmount": "1500",
                "paidAmount": "1300",
                "actualDropPlace": "Himayat Nagar",
                "lattitude": "1523.678",
                "longitude": "678.1523"
            };

            dispatchService.fnVehicleBookingClose(scope.oData)
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