/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingClose', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.bookingClose = {};
        scope.vehiclePackageTypes = PrerequisiteService.fnGetTariffByJtypeVType("1", "1");

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
                "driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
                "bookingId": "13",
                "startKms": scope.vehicleDetails.vehicleMainDetials.details.startKms,
                "currentKms": scope.bookingClose.currentKms,
                "actualKms": scope.bookingClose.actualKms,
                "startTime": scope.vehicleDetails.vehicleMainDetials.details.pickupTime,
                "currentTime": "14:30:25",
                "timeConsumed": "240",
                "tariffOpted": "3",
                "tariffActual": "4",
                "totalAmount": "1500",
                "paidAmount": scope.bookingClose.paidAmount,
                "actualDropPlace": scope.bookingClose.actualDropPlace,
                "lattitude": "1523.678",
                "longitude": "678.1523"
            };

            DispatchService.fnVehicleBookingClose(scope.oData)
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