/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('changeVehPickupLocation', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService, $rootScope, isControlView) {

        var scope = $scope;
        console.log('inside changeVehPickupLocation', oVehicleData);
        scope.allLocations = PrerequisiteService.fnGetAllLocations();
        scope.vehicleDetails = oVehicleData;
        scope.changePickup = {};
        isControlView = isControlView || false;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var oData = {
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver.id,
                "bookingId": scope.vehicleDetails.vehicleMainDetails.details.bookingId || '',
                "currentLocation": scope.vehicleDetails.vehicleMainDetails.details.pickupPlace,
                "newLocation": scope.changePickup.newLocation,
                "latitude": "1745.852",
                "longitude": "145821.369",
                "comments": scope.changePickup.comments || ''
            };

            console.log(oData);

            // validations
            if (oData.newLocation === '' || oData.comments === '') {
                alert('Please enter required details.');
                return;
            }

            serverService.sendData('P',
                'booking/savePickupChangeInfo',
                oData, scope.fnUpdateVehPickupLocationSuccess, scope.fnUpdateVehPickupLocationError);
        }

        scope.fnUpdateVehPickupLocationSuccess = function(data, status, headers, config) {
            console.log('Success: ', data);
            scope.close();
            //alert(data.result[0].message);
            if (isControlView) {
                $rootScope.$emit('eventUpdateControlViewGrid', null);
            } else {
                $rootScope.$emit('eventGetVehicleStatus', null);
            }
        };
        scope.fnUpdateVehPickupLocationError = function(data, status, headers, config) {
            console.log('Error: ', data);
        };
    });