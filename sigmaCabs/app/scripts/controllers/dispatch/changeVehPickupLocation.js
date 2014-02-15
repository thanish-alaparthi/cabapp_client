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
                "id": "", // need to check with lala about id
                "requester": "1",
                "vehicleId": scope.vehicleDetails.vehicleMainDetials.id,
                "driverId": scope.vehicleDetails.vehicleMainDetials.selectedDriver,
                "bookingId": "13",
                "reasonId": "2",
                "priority": "1",
                "comments": "this is test"
            };

            DispatchService.fnVehicleBookingComplaint(oData)
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