/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

        var scope = $scope,
            currentTimeStamp = new Date(),
            currentTimeMsec = currentTimeStamp.getTime(),
            pickupTimeStamp,
            actualPackage;
        console.log('inside vehicleBookingClose', oVehicleData);
        scope.vehicleBkngCloseReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehicleDetails = oVehicleData;
        scope.bookingClose = {};
        scope.bookingClose.custCat = PrerequisiteService.fnGetCustomerCategoryById(scope.vehicleDetails.vehicleMainDetails.details.category).categoryName;
        scope.bookingClose.custGrade = PrerequisiteService.fnGetGradeById(scope.vehicleDetails.vehicleMainDetails.details.grade).grade;
        scope.bookingClose.pickupTimeText = scope.vehicleDetails.vehicleMainDetails.details.pickupTime.substring(0, 5); //removing seconds
        scope.bookingClose.discount = scope.vehicleDetails.vehicleMainDetails.details.discount;
        scope.bookingClose.actualKms = scope.vehicleDetails.vehicleMainDetails.details.startKms;
        scope.bookingClose.currentTimeDisplay = currentTimeStamp.getDate() + '/' + currentTimeStamp.getMonth() + '/' + currentTimeStamp.getFullYear() + ' ' + currentTimeStamp.getHours() + ':' + currentTimeStamp.getMinutes();
        console.log('Journey Type: ' + scope.vehicleDetails.vehicleMainDetails.tempSelectedJourneyTypeId);
        console.log('vehicle Type: ' + scope.vehicleDetails.vehicleMainDetails.vehicleType);
        scope.bookingClose.tariffDetails = PrerequisiteService.fnGetTariffById(scope.vehicleDetails.vehicleMainDetails.details.tariffId);
        console.log(scope.bookingClose.tariffDetails);
        scope.vehiclePackageTypes = PrerequisiteService.fnGetTariffByJtypeVType(scope.vehicleDetails.vehicleMainDetails.tempSelectedJourneyTypeId, scope.vehicleDetails.vehicleMainDetails.vehicleType);
        console.log(scope.vehiclePackageTypes);
        /*
         * Decide Actual Package based on following conditions
         * 1. If it exceeds current package time + grace time
         *
         */
        pickupTimeStamp = new Date(scope.vehicleDetails.vehicleMainDetails.details.pickupDate + ' ' + scope.vehicleDetails.vehicleMainDetails.details.pickupTime).getTime();
        console.log('pickupTimeStamp: ' + pickupTimeStamp);
        console.log('currentTimeStamp: ' + currentTimeMsec);
        scope.bookingClose.tripTime = PrerequisiteService.fnDiffInTwoDatesForDisplay(pickupTimeStamp, currentTimeMsec);
        for (var i = 0; i < scope.vehiclePackageTypes.length; i++) {
            var oPackageData = scope.vehiclePackageTypes[i],
                packageTime = parseFloat(oPackageData.duration) + parseFloat(oPackageData.grace), // package time + grace time
                diffMs = (currentTimeMsec - pickupTimeStamp), // milliseconds between now & pickup time
                diffMinutes = Math.round(diffMs / 60000); // minutes;
            console.log(diffMinutes);

            // diffMinutes = 120; // Remove this later
            //console.log('packageTime: ' + packageTime + ' diffMinutes: ' + diffMinutes);
            if (diffMinutes <= packageTime) {
                console.log(oPackageData.id);
                scope.bookingClose.tariffActual = oPackageData.id;
                actualPackage = oPackageData;
                scope.bookingClose.graceTime = oPackageData.grace;
                scope.bookingClose.extraKmsChrg = oPackageData.extraKmPrice;
                scope.bookingClose.extraKmsChrg = oPackageData.extraKmPrice;
                scope.bookingClose.extraHrChrg = oPackageData.extraHrPrice;
                break;
            }
        }

        // if no package is set then select the actual package
        // if(actualPackage === undefined) {
        //     //actualPackage = scope.bookingClose.tariffDetails;
        //     alert('Error in package selection');
        //     scope.close();
        // }

        scope.$watch('bookingClose.currentKms', function(newVal) {
            if (newVal != '' && !isNaN(newVal)) {
                var currentKms = parseFloat(scope.bookingClose.currentKms),
                    startKms = scope.vehicleDetails.vehicleMainDetails.details.startKms,
                    packageBaseAmount = (actualPackage) ? parseFloat(actualPackage.price) : alert('Error in package selection'),
                    packageExtraKmCharge = parseFloat(actualPackage.extraKmPrice),
                    packageKmLimit = parseFloat(actualPackage.kms),
                    packageExtraCharge = parseFloat(actualPackage.extraCharges),
                    totalKmsCharge = 0,
                    actualKms = 0;

                currentKms = (isNaN(currentKms)) ? startKms : currentKms;
                actualKms = currentKms - startKms;
                scope.bookingClose.actualKms = (actualKms < 0) ? 0 : actualKms;
                console.log('actualKms: ' + actualKms + ' packageKmLimit: ' + packageKmLimit);
                // change package
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
            var oData = {
                "id": "", // need to check with lala about id
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId,
                "customerId": scope.vehicleDetails.vehicleMainDetails.details.customerId,
                "startKms": scope.vehicleDetails.vehicleMainDetails.details.startKms,
                "currentKms": scope.bookingClose.currentKms,
                "actualKms": scope.bookingClose.actualKms,
                "startTime": scope.vehicleDetails.vehicleMainDetails.details.pickupTime,
                "currentTime": scope.bookingClose.currentTimeDisplay,
                "timeConsumed": "240",
                "tariffOpted": scope.vehicleDetails.vehicleMainDetails.details.tariffId,
                "tariffActual": "4",
                "totalAmount": bookingClose.totalAmount,
                "paidAmount": scope.bookingClose.paidAmount,
                "actualDropPlace": scope.bookingClose.actualDropPlace,
                "lattitude": "1523.678",
                "longitude": "678.1523",
                "discount": scope.bookingClose.discount,
                "reasonId": scope.bookingClose.reasonId || '',
                "comments": scope.bookingClose.comments
            };
            console.log(oData);
            // validations
            if (isNaN(oData.currentKms) || isNaN(oData.paidAmount)) {
                alert('Please enter valid information.');
                return false;
            }

            serverService.sendData('P',
                'booking/close',
                oData, scope.fnVehicleBookingCloseSuccess, scope.fnVehicleBookingCloseError);
        }

        scope.fnVehicleBookingCloseSuccess = function(data, status, headers, config) {
            console.log('Success: ', data);
            scope.close();
            //alert(data.result[0].message);
            $rootScope.$emit('eventGetVehicleStatus', null);
        };
        scope.fnVehicleBookingCloseError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });