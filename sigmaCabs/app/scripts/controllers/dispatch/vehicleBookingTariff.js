/*
Name: vehicleBookingTariff
Description: vehicleBookingTariff
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleBookingTariff', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, modalWindow) {

        var scope = $scope;
        console.log('inside vehicleBookingTariff', oVehicleData);
        scope.vehicleCategoryTypes = PrerequisiteService.fnGetCancelBookingCategory();
        scope.vehicleComplaintReasonTypes = PrerequisiteService.fnGetReasons();
        scope.vehicleSuggestionReasonTypes = PrerequisiteService.fnGetReasons();
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
                        // send readyToSave booking details
                        return {
                            bookingStatus: null,
                            customerId: "2",
                            dropPlace: "Ameerpet, Hyderabad, Andhra Pradesh, India",
                            extraMobile: "",
                            id: "19",
                            discount: 0,
                            landmark1: "asdfffccffd",
                            landmark2: "sadf",
                            pickupDate: "2014-02-16",
                            pickupPlace: "Narayanaguda, Hyderabad",
                            pickupTime: "02:40:00",
                            primaryMobile: "",
                            primaryPassanger: "",
                            subJourneyType: "7",
                            vehicleName: null,
                            vehicleType: "2"


                            /*id: scope.bookingDetails.id,
                            pickupDate: PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate),
                            pickupTime: scope.bookingDetails.pickupHours + ':' + scope.bookingDetails.pickupMinutes + ':00',
                            pickupPlace: scope.bookingDetails.pickupPlace,
                            dropPlace: scope.bookingDetails.dropPlace,
                            primaryPassanger: '',
                            primaryMobile: '',
                            extraMobile: '',
                            landmark1: scope.bookingDetails.landmark1,
                            landmark2: scope.bookingDetails.landmark2,
                            vehicleName: scope.bookingDetails.vehicleName,
                            vehicleType: scope.bookingDetails.vehicleType,
                            subJourneyType: scope.bookingDetails.subJourneyType,
                            bookingStatus: null, // reset the booking status in disposition.
                            customerId: scope.waCustomerDetails.id*/
                        }
                    },
                    oCustomer: function() {
                        return {
                            "id": "6",
                            "name": "Kumar",
                            "mobile": "9666096662",
                            "mobile2": "9703888888",
                            "email": null,
                            "bloodGroup": null,
                            "dob": null,
                            "occupation": null,
                            "grade": "1",
                            "customerCode": "459819",
                            "category": "2",
                            "tripCount": "0",
                            "status": "1",
                            "altMobile": "9703888888"
                        };
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
                "bookingId": "19", //scope.vehicleDetails.vehicleMainDetials.bookingId || '',
                "optedTariffId": "2", // scope.vehicleDetails.vehicleMainDetials.details.tarriff
                "changedTariffId": scope.vChangeTariff.newTariffId || '',
                "changedBy": scope.vChangeTariff.categoryId || '',
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
                    alert(data.result[0].message);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
        }
    });