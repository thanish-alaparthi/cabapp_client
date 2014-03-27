/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingClose', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService, isControlView) {
        var scope = $scope,
            currentTimeStamp = new Date(),
            currentTimeMsec = currentTimeStamp.getTime(),
            currentTimeStampHrs = currentTimeStamp.getHours(),
            currentTimeStampMins = currentTimeStamp.getMinutes(),
            pickupTimeStamp, oJt,
            actualPackage, actualAmountBeforeDiscount = 0,
            modifiedPackage,
            currentPackage,
            initialStartKms = 0,
            diffMinutes = 0;

        scope.allLocations = PrerequisiteService.fnGetAllLocations();

        //prefix 0 for hours & minutes 
        currentTimeStampHrs = (currentTimeStampHrs < 10) ? '0' + currentTimeStampHrs : currentTimeStampHrs;
        currentTimeStampMins = (currentTimeStampMins < 10) ? '0' + currentTimeStampMins : currentTimeStampMins;
        console.log('inside vehicleBookingClose', oVehicleData);
        scope.vehicleBkngCloseReasonTypes = PrerequisiteService.fnGetReasonsById(8);
        scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();

        scope.vehicleDetails = oVehicleData;
        isControlView = isControlView || false;
        scope.bookingClose = {};
        scope.tmpDetails = {};
        initialStartKms = Math.abs(parseFloat(scope.vehicleDetails.vehicleMainDetails.details.startKms).toFixed(2)) || 0;
        scope.bookingClose.currentKms = initialStartKms;
        scope.bookingClose.subJourneyType = scope.vehicleDetails.vehicleMainDetails.details.subJourneyType;
        scope.bookingClose.custCat = PrerequisiteService.fnGetCustomerCategoryById(scope.vehicleDetails.vehicleMainDetails.details.category).categoryName;
        scope.bookingClose.custGrade = PrerequisiteService.fnGetGradeById(scope.vehicleDetails.vehicleMainDetails.details.grade).grade;
        scope.bookingClose.pickupTimeText = scope.vehicleDetails.vehicleMainDetails.details.pickupTime.substring(0, 5); //removing seconds
        scope.bookingClose.discount = scope.vehicleDetails.vehicleMainDetails.details.discount || 0;
        scope.bookingClose.actualKms = 0;
        scope.bookingClose.currentTimeDisplay = currentTimeStamp.getDate() + '/' + currentTimeStamp.getMonth() + '/' + currentTimeStamp.getFullYear() + ' ' + currentTimeStampHrs + ':' + currentTimeStampMins;
        console.log('Journey Type: ' + scope.vehicleDetails.vehicleMainDetails.tempSelectedJourneyTypeId);
        console.log('vehicle Type: ' + scope.vehicleDetails.vehicleMainDetails.vehicleType);
        scope.bookingClose.tariffDetails = PrerequisiteService.fnGetTariffByVtypeAndSubJtype(scope.vehicleDetails.vehicleMainDetails.vehicleType, scope.vehicleDetails.vehicleMainDetails.details.subJourneyType);
        console.log(scope.bookingClose.tariffDetails);
        scope.bookingClose.modifiedPackageShow = false;

        oJt = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(scope.vehicleDetails.vehicleMainDetails.details.subJourneyType);
        scope.tmpSelectedJourneyType = oJt;
        scope.tmpDetails.tmpJourneyType = oJt.id;
        scope.vehiclePackageTypes = PrerequisiteService.fnGetTariffByJtypeVType(oJt.id, scope.vehicleDetails.vehicleMainDetails.vehicleType);
        console.log('scope.vehiclePackageTypes', scope.vehiclePackageTypes);
        console.log(scope.vehiclePackageTypes);
        scope.subJourneyTypes = PrerequisiteService.fnGetSubJourneyTypes(oJt.id);

        scope.bookingClose.actualDropPlace = angular.copy(scope.vehicleDetails.vehicleMainDetails.details.dropPlace);

        /*
         * Decide Actual Package based on following conditions
         * 1. If it exceeds current package time + grace time
         *
         */
        pickupTimeStamp = new Date(scope.vehicleDetails.vehicleMainDetails.details.pickupDate + ' ' + scope.vehicleDetails.vehicleMainDetails.details.pickupTime).getTime();
        console.log('pickupTimeStamp: ' + pickupTimeStamp);
        console.log('currentTimeStamp: ' + currentTimeMsec);
        scope.bookingClose.tripTime = PrerequisiteService.fnDiffInTwoDatesForDisplay(pickupTimeStamp, currentTimeMsec);
        for (var i = 0, pTypelength = scope.vehiclePackageTypes.length; i < pTypelength; i++) {
            var oPackageData = scope.vehiclePackageTypes[i],
                packageTime = parseFloat(oPackageData.duration) + parseFloat(oPackageData.grace), // package time + grace time
                diffMs = (currentTimeMsec - pickupTimeStamp); // milliseconds between now & pickup time

            diffMinutes = Math.round(diffMs / 60000); // minutes;
            console.log(diffMinutes);

            // diffMinutes = 120; // Remove this later
            //console.log('packageTime: ' + packageTime + ' diffMinutes: ' + diffMinutes);
            // if no package is selected till the end of pakage list then select the last package by default
            if (diffMinutes <= packageTime || i === (pTypelength - 1)) {
                console.log(oPackageData.subJourneyType);
                scope.bookingClose.tariffActual = oPackageData.subJourneyType;
                // updating subJourneyType to sync with calculated package
                scope.bookingClose.subJourneyType = oPackageData.subJourneyType;
                scope.bookingClose.tariffActualText = oPackageData.text;
                actualPackage = oPackageData;
                currentPackage = angular.copy(actualPackage);
                scope.bookingClose.graceTime = oPackageData.grace;
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

        // update the package if modified by user
        scope.fnUpdatePackage = function() {
            console.log(scope.bookingClose.subJourneyType);
            console.log(PrerequisiteService.fnGetTariffByVtypeAndSubJtype(scope.vehicleDetails.vehicleMainDetails.vehicleType, scope.bookingClose.subJourneyType));
            modifiedPackage = PrerequisiteService.fnGetTariffByVtypeAndSubJtype(scope.vehicleDetails.vehicleMainDetails.vehicleType, scope.bookingClose.subJourneyType);
            currentPackage = angular.copy(modifiedPackage);
            scope.bookingClose.modifiedPackageText = modifiedPackage.text;
            scope.bookingClose.modifiedPackageShow = true;
            scope.bookingClose.graceTime = currentPackage.grace;
            scope.bookingClose.extraKmsChrg = currentPackage.extraKmPrice;
            scope.bookingClose.extraHrChrg = currentPackage.extraHrPrice;
            scope.fnCalculateOnCurrentKms(modifiedPackage);
        }

        //scope.$watch('bookingClose.currentKms', function(newVal) {
        scope.fnCalculateOnCurrentKms = function() {
            var newVal = scope.bookingClose.currentKms;
            if (newVal != '' && !isNaN(newVal)) {
                newVal = Math.abs(parseFloat(newVal).toFixed(2));
                if (newVal < initialStartKms) {
                    //scope.bookingClose.currentKms = initialStartKms;
                    alert('Current Kms cannot be less than Start kms.');
                    return false;
                }
                var currentKms = newVal,
                    packageBaseAmount = (currentPackage && currentPackage.price) ? parseFloat(currentPackage.price) : alert('Error in package selection'),
                    packageExtraKmCharge = parseFloat(currentPackage.extraKmPrice),
                    packageExtraHrCharge = parseFloat(currentPackage.extraHrPrice),
                    packageDuration = parseInt(currentPackage.duration),
                    packageKmLimit = parseFloat(currentPackage.kms),
                    packageExtraCharge1 = Math.abs(parseFloat(currentPackage.extraCharges1).toFixed(2)),
                    packageExtraCharge2 = Math.abs(parseFloat(currentPackage.extraCharges2).toFixed(2)),
                    totalExtraCharge = packageExtraCharge1 + packageExtraCharge2,
                    totalDurationOrKmsCharge = 0,
                    actualKms = 0,
                    calculatedAmount = 0,
                    discount = scope.bookingClose.discount,
                    discountedAmount = 0;

                currentKms = (isNaN(currentKms)) ? initialStartKms : currentKms;
                actualKms = currentKms - initialStartKms;
                scope.bookingClose.actualKms = (actualKms < 0) ? 0 : actualKms;
                console.log('actualKms: ' + actualKms + ' packageKmLimit: ' + packageKmLimit);
                // extra time / km charge
                if (packageKmLimit > 0 && diffMinutes > packageDuration && packageExtraHrCharge !== 0) {
                    totalDurationOrKmsCharge = (parseFloat(diffMinutes - packageDuration).toFixed(2) / 60) * packageExtraHrCharge;
                    console.log('extra hrs: ' + (parseFloat(diffMinutes - packageDuration).toFixed(2) / 60));
                } else if (actualKms > 0 && actualKms > packageKmLimit) {
                    totalDurationOrKmsCharge = (actualKms - packageKmLimit) * packageExtraKmCharge;
                }

                // Total Amount
                calculatedAmount = packageBaseAmount + totalDurationOrKmsCharge + totalExtraCharge;
                actualAmountBeforeDiscount = calculatedAmount;
                if (!isNaN(discount)) {
                    discountedAmount = (calculatedAmount / 100) * discount;
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
                if (newVal > 10) {
                    newVal = 10;
                    scope.bookingClose.discount = 10;
                }
                discountedAmount = (actualAmountBeforeDiscount / 100) * newVal;
                scope.bookingClose.totalAmount = parseFloat(actualAmountBeforeDiscount - discountedAmount).toFixed(2);
            } else {
                scope.bookingClose.totalAmount = actualAmountBeforeDiscount;
            }
            // });
        }

        scope.$watch('tmpDetails', function(newVal, oldVal) {
            if (newVal.tmpJourneyType != oldVal.tmpJourneyType) {
                scope.fnPopSubJourneyTypes();
            }
        }, true);

        // function to change sub-Journey Types
        scope.fnPopSubJourneyTypes = function() {
            scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.tmpDetails.tmpJourneyType);
            scope.subJourneyTypes = PrerequisiteService.fnGetSubJourneyTypes(scope.tmpSelectedJourneyType.id);
            for (var i = 0; i < scope.subJourneyTypes.length; i++) {
                if (scope.subJourneyTypes[i].parentId == scope.tmpDetails.tmpJourneyType) {
                    scope.bookingClose.subJourneyType = scope.subJourneyTypes[i].id;
                    scope.fnUpdatePackage();
                    break;
                }
            }
        };

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
                "timeConsumed": diffMinutes,
                "tariffOpted": scope.vehicleDetails.vehicleMainDetails.details.tariffId,
                "tariffActual": currentPackage.subJourneyType,
                "tariffCalculated": actualPackage.subJourneyType,
                "totalAmount": scope.bookingClose.totalAmount,
                "paidAmount": scope.bookingClose.paidAmount,
                "actualDropPlace": scope.bookingClose.actualDropPlace,
                "lattitude": "1523.678",
                "longitude": "678.1523",
                "discount": scope.bookingClose.discount,
                "reasonId": scope.bookingClose.reasonId || '',
                "comments": scope.bookingClose.comments || ''
            };
            console.log(oData);
            // validations
            if (isNaN(oData.currentKms) || isNaN(oData.paidAmount) || oData.comments === '') {
                alert('Please enter valid information.');
                return false;
            } else if (oData.currentKms <= initialStartKms) {
                alert('Current Kms cannot be less than or equal to Start kms.');
                return false;
            }

            // if discount is nothing set it as 0
            if (oData.discount === '') {
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
            if (isControlView) {
                $rootScope.$emit('eventUpdateControlViewGrid', null);
            } else {
                $rootScope.$emit('eventGetVehicleStatus', null);
            }
        };
        scope.fnVehicleBookingCloseError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });