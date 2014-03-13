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
            actualPackage, actualAmountBeforeDiscount = 0, initialStartKms = 0;
        console.log('inside vehicleBookingClose', oVehicleData);
        scope.vehicleBkngCloseReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehicleDetails = oVehicleData;
        scope.bookingClose = {};
        initialStartKms = Math.abs(parseFloat(scope.vehicleDetails.vehicleMainDetails.details.startKms).toFixed(2)) || 0;
        scope.bookingClose.currentKms = initialStartKms;
        scope.bookingClose.custCat = PrerequisiteService.fnGetCustomerCategoryById(scope.vehicleDetails.vehicleMainDetails.details.category).categoryName;
        scope.bookingClose.custGrade = PrerequisiteService.fnGetGradeById(scope.vehicleDetails.vehicleMainDetails.details.grade).grade;
        scope.bookingClose.pickupTimeText = scope.vehicleDetails.vehicleMainDetails.details.pickupTime.substring(0, 5); //removing seconds
        scope.bookingClose.discount = scope.vehicleDetails.vehicleMainDetails.details.discount || 0;
        scope.bookingClose.actualKms = 0;
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

        //scope.$watch('bookingClose.currentKms', function(newVal) {
        scope.fnCalculateOnCurrentKms = function() {
            var newVal = scope.bookingClose.currentKms;
            if (newVal != '' && !isNaN(newVal)) {
                newVal = Math.abs(parseFloat(newVal).toFixed(2));
                if(newVal < initialStartKms) {
                    //scope.bookingClose.currentKms = initialStartKms;
                    alert('Current Kms cannot be less than Start kms.');
                    return false;
                }
                var currentKms = newVal,
                    packageBaseAmount = (actualPackage) ? parseFloat(actualPackage.price) : alert('Error in package selection'),
                    packageExtraKmCharge = parseFloat(actualPackage.extraKmPrice),
                    packageKmLimit = parseFloat(actualPackage.kms),
                    packageExtraCharge = parseFloat(actualPackage.extraCharges),
                    totalKmsCharge = 0,
                    actualKms = 0,
                    calculatedAmount = 0,
                    discount = scope.bookingClose.discount,
                    discountedAmount = 0;

                currentKms = (isNaN(currentKms)) ? initialStartKms : currentKms;
                actualKms = currentKms - initialStartKms;
                scope.bookingClose.actualKms = (actualKms < 0) ? 0 : actualKms;
                console.log('actualKms: ' + actualKms + ' packageKmLimit: ' + packageKmLimit);
                // change package
                if (actualKms > 0 && actualKms > packageKmLimit) {
                    totalKmsCharge = (actualKms - packageKmLimit) * packageExtraKmCharge;
                }

                // Total Amount
                calculatedAmount = packageBaseAmount + totalKmsCharge + packageExtraCharge;
                actualAmountBeforeDiscount = calculatedAmount;
                if(!isNaN(discount)) {
                    discountedAmount = (calculatedAmount/100) * discount;
                    scope.bookingClose.totalAmount = parseFloat(calculatedAmount - discountedAmount).toFixed(2);
                } else {
                    scope.bookingClose.totalAmount = calculatedAmount;
                }
            } else {
                alert('Please enter valid kms.');
            }
        //}, true);
        };

        // scope.$watch('bookingClose.discount', function(newVal) {
        scope.fnCalculateDiscount = function() {
            var newVal = scope.bookingClose.discount,
                discountedAmount = 0;
            if (newVal != '' && !isNaN(newVal) 
                    // && !isNaN(scope.bookingClose.currentKms)
                    && !isNaN(actualAmountBeforeDiscount)) {
                newVal = Math.abs(parseFloat(newVal).toFixed(2));

                // restricting the discount to max 10
                if(newVal > 10) {
                    newVal = 10;
                    scope.bookingClose.discount = 10;
                }
                discountedAmount = (actualAmountBeforeDiscount/100) * newVal;
                scope.bookingClose.totalAmount = parseFloat(actualAmountBeforeDiscount - discountedAmount).toFixed(2);
            } else {
                scope.bookingClose.totalAmount = actualAmountBeforeDiscount;
            }
            // });
        }

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

            // if discount is nothing set it as 0
            if(oData.discount === '') {
                oData.discount = 0;
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