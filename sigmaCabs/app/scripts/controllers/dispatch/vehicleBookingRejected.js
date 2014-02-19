/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingRejected', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingRejected', oVehicleData);
        scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleBkngRejectReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehiclePriorities = PrerequisiteService.priorities;

        scope.vehicleDetails = oVehicleData;
        scope.vReject = {};

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var driverId = scope.vehicleDetails.vehicleMainDetials.selectedDriver || '',
                oData = {
                    "id": "", // need to check with lala about id
                    "requester": scope.vReject.categoryId,
                    "vehicleId": scope.vehicleDetails.vehicleMainDetials.id || '',
                    "driverId": driverId,
                    "bookingId": scope.vehicleDetails.vehicleMainDetials.bookingId || '',
                    "reasonId": scope.vReject.reasonId || '',
                    "priority": scope.vReject.priorityId || '',
                    "comments": scope.vReject.comments
                };

            /*if (oData.requester === '' || oData.reasonId === '') {
                alert('Please select required information');
                return;
            } else if (scope.vReject.categoryId === 4 && driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }*/

            DispatchService.fnVehicleRejectBooking(oData)
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