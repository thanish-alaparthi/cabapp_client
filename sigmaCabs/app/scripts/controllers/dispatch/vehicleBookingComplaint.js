/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingComplaint', function(oVehicleData, dispatchService, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

        var scope = $scope;
        console.log('inside vehicleBookingComplaint', oVehicleData);

        scope.vehicleDetails = oVehicleData;

        scope.close = function() {
            dialog.close();
        }
        scope.fnSaveAndClose = function() {
            scope.oData = {
                "id": "", // need to check with lala about id
                "vehicleId": "1",
                "driverId": "13",
                "bookingId": "13",
                "reasonId": "2",
                "priority": "1",
                "comments": "this is test"
            };

            dispatchService.fnVehicleBookingComplaint(scope.oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    alert(data.result.message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });