/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope,
            currentTimeStamp = new Date(),
            currentTimeMsec = currentTimeStamp.getTime(),
            pickupTimeStamp,
            actualPackage;
        console.log('inside vehicleBookingClose', oVehicleData);

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
        for (var i = 0; i < scope.vehiclePackageTypes.length; i++) {
            var oPackageData = scope.vehiclePackageTypes[i],
                packageTime = parseFloat(oPackageData.duration) + parseFloat(oPackageData.grace), // package time + grace time
                diffMs = (currentTimeMsec - pickupTimeStamp), // milliseconds between now & pickup time
                diffMinutes = Math.round(diffMs / 60000); // minutes;
            //diffMinutes = 120; // Remove this later
            //console.log('packageTime: ' + packageTime + ' diffMinutes: ' + diffMinutes);
            if (diffMinutes <= packageTime) {
                console.log(oPackageData.id);
                scope.bookingClose.tariffActual = oPackageData.id;
                actualPackage = oPackageData;
                break;
            }
            // change package logic goes here
        }

        scope.$watch('bookingClose.currentKms', function(newVal) {
            if (newVal != '' && !isNaN(newVal)) {
                var currentKms = parseFloat(scope.bookingClose.currentKms),
                    startKms = scope.vehicleDetails.vehicleMainDetials.details.startKms,
                    packageBaseAmount = parseFloat(actualPackage.price),
                    packageExtraKmCharge = parseFloat(actualPackage.extraKmPrice),
                    packageKmLimit = parseFloat(actualPackage.kms),
                    packageExtraCharge = parseFloat(actualPackage.extraCharges),
                    totalKmsCharge = 0,
                    actualKms = 0;

                currentKms = (isNaN(currentKms)) ? startKms : currentKms;
                actualKms = currentKms - startKms;
                scope.bookingClose.actualKms = (actualKms < 0) ? 0 : actualKms;
                console.log('actualKms: ' + actualKms + ' packageKmLimit: ' + packageKmLimit);
                if (actualKms > packageKmLimit) {
                    totalKmsCharge = actualKms * packageExtraKmCharge;
                }

                // Total Amount
                scope.bookingClose.totalAmount = packageBaseAmount + totalKmsCharge + packageExtraCharge;
            }
        }, true);

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
                "driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetials.details.bookingId,
                "customerId": scope.vehicleDetails.vehicleMainDetials.details.customerId,
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
                    $rootScope.$emit('eventGetVehicleStatus', null);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });