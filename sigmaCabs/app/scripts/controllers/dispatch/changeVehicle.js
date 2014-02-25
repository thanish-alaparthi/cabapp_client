/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('changeVehicle', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside changeVehicle', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.vChange = {};
        //scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehiclePriorities = PrerequisiteService.priorities;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var oData = {
                "bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "currentVehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "newVehicleId": scope.vChange.newVehicleId || '1', // need to change
                "reasonId": scope.vChange.reasonId || '',
                "priority": scope.vChange.priorityId || '',
                "comments": scope.vChange.comments
            };

            if(oData.newVehicleId === '') {
                alert('Please select new vehicle');
                return;
            } else if (oData.driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            } else if (oData.priority === '' || oData.reasonId === '') {
                alert('Please select required information');
                return;
            }

            DispatchService.fnChangeVehicle(oData)
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