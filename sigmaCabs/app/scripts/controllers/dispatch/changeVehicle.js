/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('changeVehicle', function(oVehicleData, DispatchService, $rootScope, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

        var scope = $scope;
        console.log('inside changeVehicle', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.vChange = {};
        scope.vChange.amountPaid = "0";
        // set current Date for pickup date
        scope.dpCurrentDate = PrerequisiteService.fnFormatDate();
        // set date restriction.
        scope.dpCurrentPlusSevenDate = PrerequisiteService.fnGetAdvancedDate(7);
        scope.hours = PrerequisiteService.hours;
        scope.minutes = PrerequisiteService.minutes;
        // default data
        scope.vChange.pickupDate = angular.copy(scope.dpCurrentDate);
        scope.vChange.pickupHours = "00";
        scope.vChange.pickupMinutes = "00";
        scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleReasonTypes = PrerequisiteService.fnGetReasonsById(9);
        scope.vehiclePriorities = PrerequisiteService.priorities;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.vChange.pickupTime = PrerequisiteService.formatToServerDate(scope.vChange.pickupDate) + ' ' + scope.vChange.pickupHours + ':' + scope.vChange.pickupMinutes;
            console.log(scope.vChange.pickupTime);
            var oData = {
                "bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "currentVehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "newVehicleId": scope.vChange.newVehicleId || '1', // need to change
                "location": scope.vChange.location || '',
                "lattitude": "12345.564",
                "longitude": "988756.345",
                "pickupTime": scope.vChange.pickupTime || '0',
                "amountPaid": scope.vChange.amountPaid || '0',
                "changedBy": scope.vChange.categoryId,
                "reasonId": scope.vChange.reasonId || '',
                "priority": scope.vChange.priorityId || '',
                "comments": scope.vChange.comments
            };

            if (oData.newVehicleId === '') {
                alert('Please select new vehicle');
                return;
            } else if(new Date(oData.pickupTime).getTime() < new Date().getTime()) {
                alert('Pickup time should not be less than current Time');
                return;
            } else if (oData.driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            } else if (oData.location === '' || oData.priority === '' || oData.reasonId === '') {
                alert('Please select required information');
                return;
            }

            serverService.sendData('P',
                'booking/saveVehicleChangeInfo',
                oData, scope.fnChangeVehicleSuccess, scope.fnChangeVehicleError);
        }

        scope.fnChangeVehicleSuccess = function(data, status, headers, config) {
            console.log('Success: ', data);
            scope.close();
            $rootScope.$emit('eventGetVehicleStatus', null);
            //alert(data.result[0].message);
        };
        scope.fnChangeVehicleError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });