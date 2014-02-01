/*
Name: VehiclesService
Description: Service which handles REST Calls for Vehicles
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('PrerequisiteService', function($http, URLService, $rootScope) {
        var oUser = null,

            oDate = new Date(),
            yyyy = oDate.getFullYear().toString(),
            mm = (oDate.getMonth() + 1).toString(),
            dd = oDate.getDate().toString(),
            currentDate = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),
            nextYearDate = (parseInt(yyyy) + 1) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),

            d1 = new Date(),
            d2 = new Date(d1);
        d2.setHours(d1.getHours() + 1);
        var sDefaultBookingHours = d2.getHours(),
            sDefaultBookingMinutes = d2.getMinutes(),

            sLs = localStorage.getItem('sigmaCabsPrerequisites'),
            oLs = sLs ? JSON.parse(sLs) : {},
            isDataExistsInLocalStorage = ((oLs.hasOwnProperty(currentDate)) ? true : false),

            iApiCount = 0,
            fnEmitSuccess = function(){
                $rootScope.$emit('eventPrerequisitsLoaded');
            };

        return {
            oLs: oLs,
            iApiCount : 0,  // count of successful/Error callback returned.
            iApiLimit : 0,  // Total number of API calls made.
            fnEmitEvent : function(){
                var oThis = this;
                oThis.iApiCount++;
                console.log('No. of Prerequisite API returned:', oThis.iApiCount, '. Total Prerequisite APIs are: ', oThis.iApiLimit);
                if(oThis.iApiCount == oThis.iApiLimit) {
                    $rootScope.$emit('eventPrerequisitsLoaded');
                    localStorage.setItem('sigmaCabsPrerequisites', JSON.stringify(oThis.oLs));
                }   
            },
            fnAddToLocalStorage : function(sType, oResult){
                var oThis = this;
                console.log('Typeof result: ',typeof oResult, '. Token:', sType);
                if(typeof oResult == 'string'){
                    console.warn(sType,' gave empty data for Prerequisite.');
                }

                if(!oThis.oLs.hasOwnProperty(currentDate)){
                    oThis.oLs[currentDate] = {};
                }
                oThis.oLs[currentDate][sType] = oResult;
                return true;
            },

            // call for interrelated configuration/Prequisite data
            fnGetPrerequisites: function() {
                var oThis = this;
                //Note: the call will be made only if data is not present in the local storage on day basis
                $rootScope.$emit('eventPrerequisitsLoaded');
                if (isDataExistsInLocalStorage) {
                // if (1) {
                    console.log('isDataExistsInLocalStorage', isDataExistsInLocalStorage , oThis.oLs);
                    setTimeout(function(){
                        fnEmitSuccess();
                    },0);
                    return;
                }

                console.log('No LocalStore data: getting Prerequisite Data for ' + oThis.currentDate+' from server...');


                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllJourneyTypes'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetAllJourneyTypes: ', data); 
                    if(oThis.fnAddToLocalStorage('journeyTypes', data.result)) {   // add JourneyTypes                        
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetAllJourneyTypes: ', data);
                    oThis.fnEmitEvent();
                });

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllBookingStates'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetAllBookingStates: ', data);
                    if(oThis.fnAddToLocalStorage('bookingStates', data.result)) { // add BookingStates
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetAllBookingStates: ', data);
                    oThis.fnEmitEvent();
                });

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllGrades'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetAllGrades: ', data);
                    if(oThis.fnAddToLocalStorage('grades', data.result)) {    // add Grades
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetAllGrades: ', data);
                    oThis.fnEmitEvent();
                });

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllReasons'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetAllReasons: ', data);
                    if(oThis.fnAddToLocalStorage('reason', data.result)) {    // add Reasons
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetAllReasons: ', data);
                    oThis.fnEmitEvent();
                });

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('getAllTariff'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success getAllTariff: ', data);
                    if(oThis.fnAddToLocalStorage('tariff', data.result)) {    // add Tariffs
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error getAllTariff: ', data);
                    oThis.fnEmitEvent();
                });
            },


            defaultBookingHour: sDefaultBookingHours.toString(),    // default booking Hours
            defaultBookingMinutes: '00',    // default booking minutes
            currentDate: currentDate,   // current Date
            nextYearDate: nextYearDate, // Next days date

            priorities: {               //Priorites
                '1': 'Normal',
                '2': 'Important',
                '3': 'High',
                '4': 'Critical'
            },

            hours: {                    // Hours dropdown
                '00': '00',
                '01': '01',
                '02': '02',
                '03': '03',
                '04': '04',
                '05': '05',
                '06': '06',
                '07': '07',
                '08': '08',
                '09': '09',
                '10': '10',
                '11': '11',
                '12': '12',
                '13': '13',
                '14': '14',
                '15': '15',
                '16': '16',
                '17': '17',
                '18': '18',
                '19': '19',
                '20': '20',
                '21': '21',
                '22': '22',
                '23': '23',
            },
            minutes: {              // minutes dropdown
                '00': '00',
                '10': '10',
                '20': '20',
                '30': '30',
                '40': '40',
                '50': '50'
            },

            fnGetJourneyTypes : function(){         // Function to return JourneyTypes
                return this.oLs[currentDate]['journeyTypes'];
            },
            fnGetTariffData : function(){           // function to return TariffData
                console.log(this.oLs[currentDate]['tariff'],this.oLs)
                return this.oLs[currentDate]['tariff'];
            },

            bookingStatuses: {          // bookingStatuses
                '1': 'Open',
                '2': 'Closed',
                '3': 'Cancled'
            },




            /* Old settings. will be deleted later */
            isPrimaryTraveller: {
                '0': 'No',
                '1': 'Yes'
            },
            paymentModes: {
                '1': 'Cash',
                '2': 'Card'
            },
            userTypes: {
                '1': 'Driver',
                '2': 'Client',
                '3': 'Customer',
                '4': 'Other-Employee',
                '5': 'Dispatcher',
                '6': 'Call-Taker'
            },
            userJobCategoriesNames: {
                '1': 'Permanant',
                '2': 'Contract'
            },
            userJobCategories: [{
                'type': '1',
                'title': 'Permanant'
            }, {
                'type': '2',
                'title': 'Contract'
            }],
            vehicleTypes: [{
                id: '1',
                vehicleType : 'Small'
            },{
                id: '2',
                vehicleType : 'Medium'
            },{
                id: '3',
                vehicleType : 'Big'
            },{
                id: '4',
                vehicleType : 'Luxury'
            }],
            fnGetVehicleTypes : function(){
                return this.vehicleTypes;
            },
            vehicleAttachmentTypeNames: {
                '1': '[COV] Operated by Company',
                '2': '[COV] Leased to Driver',
                '3': '[LV] Operated by Company',
                '4': '[LV] Sub-leased to Driver',
                '5': '[AV] Operated by Self [Driver-Owner]',
                '6': '[AV] Operated by Other Driver'
            },
            vehicleAttachmentTypeOptions: [{
                'type': '1',
                'attachmentCategory': 'Company Owned Vehicle [COV]',
                'name': '[COV] Operated by Company'
            }, {
                'type': '2',
                'attachmentCategory': 'Company Owned Vehicle [COV]',
                'name': '[COV] Leased to Driver'
            }, {
                'type': '3',
                'attachmentCategory': 'Leased Vehicle [LV]',
                'name': '[LV] Operated by Company'
            }, {
                'type': '4',
                'attachmentCategory': 'Leased Vehicle [LV]',
                'name': '[LV] Sub-leased to Driver'
            }, {
                'type': '5',
                'attachmentCategory': 'Attached Vehicle [AV]',
                'name': '[AV] Operated by Self [Driver-Owner]'
            }, {
                'type': '6',
                'attachmentCategory': 'Attached Vehicle [AV]',
                'name': '[AV] Operated by Other Driver'
            }],
            carrierTypes: [{
                "title": "No-Carrier",
                "type": "1"
            }, {
                "title": "Open Carrier",
                "type": "2"
            }, {
                "title": "Carrier With Lock",
                "type": "3"
            }],
            insuranceType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Composite",
                "type": "2"
            }],
            permitType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Composite",
                "type": "2"
            }],
            premiumType: [{
                "title": "Full",
                "type": "1"
            }, {
                "title": "Composite",
                "type": "2"
            }],
            dentAndScratchType: [{
                "title": "Dent",
                "type": "1"
            }, {
                "title": "Scratch",
                "type": "2"
            }],
            dentAndScratchSeverityType: [{
                "title": "Low",
                "type": "1"
            }, {
                "title": "Normal",
                "type": "2"
            }, {
                "title": "Heavy",
                "type": "3"
            }],
            vehicleConditionTypes: [{
                "title": "ok",
                "type": "1"
            }, {
                "title": "Acceptable",
                "type": "2"
            }, {
                "title": "Need to Change",
                "type": "3"
            }],
            billingSystemTypes: [{
                "title": "Company Cutomized",
                "type": "1"
            }, {
                "title": "Regular",
                "type": "2"
            }],
            companyBrandingOptions: [{
                "title": "Yes",
                "type": true
            }, {
                "title": "No",
                "type": false
            }],
            entertainmentOptions: [{
                "title": "Yes",
                "type": true
            }, {
                "title": "No",
                "type": false
            }],
            luggageTypes: [{
                "title": "No-Luggage",
                "type": '1'
            }, {
                "title": "Medium-Luggage",
                "type": '2'
            }, {
                "title": "Heavy-Luggage",
                "type": '3'
            }],
            customerFields: {
                'email': 'Email',
                'altMobile': 'Alt. Mobile',
                'source': 'Source',
                'dob': 'DOB'
            },
            customerFieldTypes: {
                'email': 'text',
                'altMobile': 'text',
                'source': 'text',
                'dob': 'text'
            },
            pickupPlaceTypes: [{
                title: 'Home',
                type: '1'
            }, {
                title: 'Office',
                type: '2'
            }]
             /* EOF : Old settings. will be deleted later */
        }

    });