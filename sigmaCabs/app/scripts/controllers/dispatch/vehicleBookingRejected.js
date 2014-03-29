/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingRejected', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, isControlView, serverService) {
        var scope = $scope;
        console.log('inside vehicleBookingRejected', oVehicleData);
        scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleBkngRejectReasonTypes = PrerequisiteService.fnGetReasonsById(4);
        scope.vehiclePriorities = PrerequisiteService.priorities;

        scope.vehicleDetails = oVehicleData;
        scope.vReject = {};
        isControlView = isControlView || false;
        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var driverId = scope.vehicleDetails.vehicleMainDetails.selectedDriver || '',
                oData = {
                    "id": "", // need to check with lala about id
                    "requester": scope.vReject.categoryId,
                    "vehicleId": scope.vehicleDetails.vehicleMainDetails.id || '',
                    "driverId": driverId,
                    "bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId || '',
                    "pickupTimeStamp": scope.vehicleDetails.vehicleMainDetails.details.pickupTimeStamp || '',
                    "reasonId": scope.vReject.reasonId || '',
                    "priority": scope.vReject.priorityId || '',
                    "comments": scope.vReject.comments || ''
                };

            // validations
            if (oData.bookingId === '' || oData.priority === '' || oData.reasonId === '' || oData.comments === '') {
                alert('Please select required information');
                return;
            } else if (scope.vReject.categoryId === 4 && driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }

            serverService.sendData('P',
                'vehicle/rejectBooking',
                oData, scope.fnVehicleRejectBookingSuccess, scope.fnVehicleRejectBookingError);
        }

        scope.fnVehicleRejectBookingSuccess = function(data, status, headers, config) {
            console.log('Success: ', data);
            scope.close();
            //alert(data.result[0].message);
            if (isControlView) {
                $rootScope.$emit('eventUpdateControlViewGrid', null);
            } else {
                $rootScope.$emit('eventGetVehicleStatus', null);
            }
        };
        scope.fnVehicleRejectBookingError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });