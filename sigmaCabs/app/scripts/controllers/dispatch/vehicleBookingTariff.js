/*
Name: vehicleBookingTariff
Description: vehicleBookingTariff
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingTariff', function(oVehicleData, oCustomerDetails, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, modalWindow) {

        var scope = $scope;
        console.log('inside vehicleBookingTariff', oVehicleData);
        scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleComplaintReasonTypes = PrerequisiteService.fnGetReasonsById(2);
        scope.vehicleSuggestionReasonTypes = PrerequisiteService.fnGetReasonsById(3);
        //scope.vehiclePriorities = PrerequisiteService.priorities;

        scope.vehicleDetails = oVehicleData;
        scope.vChangeTariff = {};

        scope.close = function() {
            dialog.close();
        }

        scope.checkTariff = function() {
            /*if(!scope.waCustomerDetails.id) {
                alert('Please save the customer details first.');
                return;
            }*/
            $scope.opts = {
                templateUrl: URLService.view('singleTariff'),
                controller: 'singleTariffController',
                dialogClass: 'modalClass',
                resolve: {
                    oBooking: function() {
                        var oDetails = scope.vehicleDetails.vehicleMainDetails.details;
                        // send readyToSave booking details
                        return {
                            bookingStatus: null,
                            customerId: oDetails.customerId,
                            dropPlace: oDetails.dropPlace,
                            extraMobile: "",
                            id: "19",
                            discount: 0,
                            landmark1: oDetails.landmark1,
                            landmark2: oDetails.landmark2,
                            pickupDate: oDetails.pickupDate,
                            pickupPlace: oDetails.pickupPlace,
                            pickupTime: oDetails.pickupTime,
                            primaryMobile: "",
                            primaryPassenger: "",
                            subJourneyType: oDetails.subJourneyType,
                            vehicleName: null,
                            vehicleType: scope.vehicleDetails.vehicleMainDetails.vehicleType
                        }
                    },
                    oCustomer: function() {
                        return oCustomerDetails;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        // catch eventSingleTariffSelected to reload tariffGrid.
        $rootScope.$on('eventSingleTariffSelected', function(ev, oData) {
            // single tariff will send oData.tariffType as id and not as an array.
            // add the tariffType to booking details
            console.log('eventSingleTariffSelected triggered', oData);
            scope.vChangeTariff.newTariffId = oData.tariffId;
            scope.vChangeTariff.newTariff = oData.tariffDetails.vehicleName + ' - ' + oData.tariffDetails.vehicleType;
        });

        scope.fnSaveAndClose = function() {
            var oData = {
                "bookingId": scope.vehicleDetails.vehicleMainDetails.bookingId || '',
                "optedTariffId": scope.vehicleDetails.vehicleMainDetails.details.tariffId,
                "changedTariffId": scope.vChangeTariff.newTariffId || '',
                "changedBy": scope.vChangeTariff.categoryId || '',
                "reasonId": scope.vChangeTariff.reasonId || '',
                "comments": scope.vChangeTariff.comments
            };

            if (oData.changedTariffId === '' || oData.optedTariffId === oData.changedTariffId) {
                alert('Please select a new Tariff');
                return;
            } else if (oData.changedBy === '') { // || oData.reasonId === ''
                alert('Please select required information');
                return;
            } else if (scope.vChangeTariff.categoryId === 4 && driverId === '') {
                alert('Please select driver in vehicle information');
                return;
            }

            DispatchService.fnVehicleChangeTariff(oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
                    scope.close();
                    //alert(data.result[0].message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });