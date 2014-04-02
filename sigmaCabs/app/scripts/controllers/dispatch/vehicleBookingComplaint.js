/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingComplaint', function(oVehicleData, DispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingComplaint', oVehicleData);

        scope.vehicleDetails = oVehicleData;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "requester": "1",
                "vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
                "driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver.id,
                "bookingId": "13",
                "reasonId": "2",
                "priority": "1",
                "comments": "this is test"
            };

            DispatchService.fnVehicleBookingComplaint(scope.oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    //alert(data.result.message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });