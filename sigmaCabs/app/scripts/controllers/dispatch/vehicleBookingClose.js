/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope,
            currentTimeStamp = new Date(),
            currentTimeMsec = currentTimeStamp.getTime(),
            pickupTimeStamp;
        console.log('inside vehicleBookingClose', oVehicleData);
        console.log(oTariffData);

        scope.vehicleDetails = oVehicleData;
        scope.bookingClose = {};
        scope.bookingClose.actualKms = scope.vehicleDetails.vehicleMainDetials.details.startKms;
        scope.bookingClose.currentTimeDisplay = currentTimeStamp.getHours() + ':' + currentTimeStamp.getMinutes();
        console.log('Journey Type: ' + scope.vehicleDetails.vehicleMainDetials.tempSelectedJourneyTypeId);
        console.log('vehicle Type: ' + scope.vehicleDetails.vehicleMainDetials.vehicleType);
        scope.bookingClose.tariffDetails = PrerequisiteService.fnGetTariffById(scope.vehicleDetails.vehicleMainDetials.details.tariffId);
        console.log(scope.bookingClose.tariffDetails);
        scope.vehiclePackageTypes = PrerequisiteService.fnGetTariffByJtypeVType(scope.vehicleDetails.vehicleMainDetials.tempSelectedJourneyTypeId, scope.vehicleDetails.vehicleMainDetials.vehicleType);
        console.log(scope.vehiclePackageTypes);
        /*
        * Decide Actual Package based on following conditions
        * 1. If it exceeds current package time + grace time
        * 
        */
        pickupTimeStamp = new Date(scope.vehicleDetails.vehicleMainDetials.details.pickupDate + ' ' + scope.vehicleDetails.vehicleMainDetials.details.pickupTime).getTime();
        console.log('pickupTimeStamp: ' + pickupTimeStamp);
        console.log('currentTimeStamp: ' + currentTimeMsec);
        for(var i = 0; i < scope.vehiclePackageTypes.length; i++) {
            var oPackageData = scope.vehiclePackageTypes[i],
                packageTime = parseFloat(oPackageData.duration) + parseFloat(oPackageData.grace);
            
            // change package logic goes here
        }        

        scope.$watch('bookingClose.currentKms', function(newVal) {
            var currentKms = parseFloat(scope.bookingClose.currentKms),
                startKms = scope.vehicleDetails.vehicleMainDetials.details.startKms;

            currentKms = (isNaN(currentKms)) ? startKms : currentKms;
            scope.bookingClose.actualKms = currentKms - startKms;
        }, true);

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
                "currentTime": scope.bookingClose.currentTimeDisplay,
                "timeConsumed": "240",
                "tariffOpted": scope.vehicleDetails.vehicleMainDetials.details.tariffId,
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