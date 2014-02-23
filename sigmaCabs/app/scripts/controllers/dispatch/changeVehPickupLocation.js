/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('changeVehPickupLocation', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside changeVehPickupLocation', oVehicleData);

        scope.vehicleDetails = oVehicleData;
        scope.changePickup = {};

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            var oData = {
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,
                "bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
                "currentLocation": "Ameerpet",
                "newLocation": scope.changePickup.newLocation,
                "latitude": "1745.852",
                "longitude": "145821.369",
                "comments": scope.changePickup.comments
            };

            if(oData.newLocation === '') {
                alert('Please enter new location');
                return;
            }

            DispatchService.fnUpdateVehPickupLocation(oData)
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