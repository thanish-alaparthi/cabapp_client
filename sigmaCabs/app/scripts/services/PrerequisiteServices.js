/*
Name: VehiclesService
Description: Service which handles REST Calls for Vehicles
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('PrerequisiteService', function($http, URLService, PreConfigService, $rootScope) {
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
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetBookingStatues'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetBookingStatues: ', data);
                    if(oThis.fnAddToLocalStorage('bookingStatues', data.result)) {    // add bookingStatuses
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetBookingStatues: ', data);
                    oThis.fnEmitEvent();
                });
                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetVehicleNames'),
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(function(data, status, headers, config) {
                    console.log('success RestApiGetVehicleNames: ', data);
                    if(oThis.fnAddToLocalStorage('vehicleNames', data.result)) {    // add vehicle Names
                        oThis.fnEmitEvent();
                    }
                }).error(function(data, status, headers, config) {
                    console.log('error RestApiGetVehicleNames: ', data);
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
            vehicleTypes: [{
                id: '1',
                vehicleType : 'Small'
            },{
                id: '2',
                vehicleType : 'Medium'
            },{
                id: '3',
                vehicleType : 'Big'
            }
            // ,{
            //     id: '4',
            //     vehicleType : 'Luxury'
            // }
            ],

            fnGetJourneyTypes : function(){         // Function to return Only Main JourneyTypes
                // filter main journey types i.e. where parentId = 0;
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].parentId == 0) {
                        aRtn.push(oJt[i]);
                    }
                }
                return aRtn;
            },
            fnGetJourneyObjectById : function(sId){         // Function to return Only One JourneyType based on id
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sId) {
                        return oJt[i];
                    }
                }
                return null;
            },
            fnGetAllJourneyTypes : function(){         // Function to return Only Main JourneyTypes
                return this.oLs[this.currentDate]['journeyTypes'];
            },
            fnGetSubJourneyTypes : function(sParentId){         // Function to return Only sub JourneyTypes
                // filter sub journey types i.e. where parentId = sParentId;
                var aRtn = [],
                    oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].parentId == sParentId) {
                        aRtn.push(oJt[i]);
                    }
                }
                return aRtn;
            },
            fnGetMainJourneyTypeOfSubJourneyType : function(sSubJourneyTypeId){    //function to find out MainJourneyType based on SubJourneyTypeId
                var oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sSubJourneyTypeId) {
                        return oJt[i].parentId;
                    }
                }

                return null;
            },
            fnGetJourneyTypeName : function(sId){    //function to get journey type name
                var oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sId) {
                        return oJt[i].journeyType;
                    }
                }

                return null;
            },
            fnGetMainJourneyTypeObjectBySubJourneyTypeId : function(sSubJourneyTypeId){    //function to find out MainJourneyType based on SubJourneyTypeId
                var oJt = this.oLs[this.currentDate]['journeyTypes'],
                    iCount = oJt.length;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sSubJourneyTypeId) {
                        return oJt[i];
                    }
                }

                return null;
            },
            fnGetTariffData : function(){           // function to return TariffData
                return this.oLs[this.currentDate]['tariff'];
            },
            fnFormatDate : function(sDate){
                if(!sDate || sDate.length < 10){
                    return this.fnFormatDate(this.currentDate);
                }

                var aD = sDate.split('-');
                return aD[2] + '/' + aD[1] + '/' + aD[0];
            },
            formatToServerDate : function(sDate){
                if(sDate.length < 10){
                    return this.currentDate;
                }

                var aD = sDate.split('/');
                return aD[2] + '-' + aD[1] + '-' + aD[0];
            },


            fnFormatHours : function(sTime){
                if(!sTime || sTime.length < 8){
                    var oD = new Date();
                    return this.fnFormatHours(
                        (oD.getHours()<=9 ? '0'+oD.getHours() : oD.getHours()) 
                        + ':' 
                        + (oD.getMinutes() <=9? '0' + oD.getMinutes() : oD.getMinutes()) 
                        +':00'
                    );
                }
                var aD = sTime.split(':');
                return aD[0];
            },


            fnFormatMinutes : function(sTime){
                if(!sTime || sTime.length < 8){
                    var oD = new Date(),
                        sM = (oD.getMinutes() - (oD.getMinutes()%10) +  (oD.getMinutes()%10 + (10 - oD.getMinutes()%10 ))),
                        sM = (sM<60 ? sM : (sM - 10));

                    return this.fnFormatMinutes(
                        (oD.getHours()<=9 ? '0'+oD.getHours() : oD.getHours()) 
                        + ':' 
                        + sM
                        +':00'
                    );
                }
                var aD = sTime.split(':');
                return aD[1];
            },
            fnGetBookingStatusName : function(sBookingStatusId){
                var aBs = this.oLs[this.currentDate]['bookingStatues'],
                    iCount = aBs.length;

                for(var i=0;i<iCount;i++){
                    if(aBs[i].id == sBookingStatusId){
                        return aBs[i].bookingStatus;
                    }
                }
                return null;
            },
            fnGetReasons : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['reason'];
            },
            fnGetVehicleNames : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleNames'];
            },
            fnGetVehicleTypeById : function(sId){
                var oThis = this;

                for(var i=0;i<oThis.vehicleTypes.length;i++){
                    if(oThis.vehicleTypes[i].id == sId){
                        return oThis.vehicleTypes[i];
                    }
                }
                return null;
            },
            fnGetVehicleNameById : function(sId){
                var oThis = this,
                    oVn = oThis.oLs[oThis.currentDate]['vehicleNames'];
                for(var i=0;i<oVn.length;i++){
                    if(oVn[i].id == sId){
                        return oVn[i];
                    }
                }
                return null;
            },
            fnGetVehicleDisplayNameById : function(sId){
                var oThis = this,
                    oVn = oThis.oLs[oThis.currentDate]['vehicleNames'];
                for(var i=0;i<oVn.length;i++){
                    if(oVn[i].id == sId){
                        return oVn[i].vehicleName;
                    }
                }
                return null;
            },
            
            getDispositionTypes : function(sId){
                var aRtn = [{
                    id: PreConfigService.BOOKING_ENQUIRY,
                    dispositionName : 'Enquiry'
                }, {
                    id: PreConfigService.BOOKING_FOLLOW_UP,
                    dispositionName : 'Follow-up'
                }, {
                    id: PreConfigService.BOOKING_REJECTED,
                    dispositionName : 'Rejected'
                }];
                return aRtn;
            },
            fnGetCancelBookingCategory : function(sId){
                var aRtn = [{
                    id: 1, 
                    categoryName : 'Customer'
                }, {
                    id: 2,
                    categoryName : 'Dispatcher'
                }, {
                    id: 3,
                    categoryName : 'Call-Taker'
                }];
                return aRtn;
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