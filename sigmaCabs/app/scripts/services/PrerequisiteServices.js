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
            fnEmitEvent : function(sMyDataToken, isFromError){

                var oThis = this;
                oThis.iApiCount++;

                console.log('No. of Prerequisite API returned:', oThis.iApiCount, '. Total Prerequisite APIs are: ', oThis.iApiLimit, '(',sMyDataToken,')');
                if(isFromError){
                    console.error('################### ERROR in Config Response. clearing localstorage ###############:::', sMyDataToken);

                    oThis.oLs = {};
                }

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


                // store tariff properly per vehicleType
                if(sType == 'tariff'){
                    oThis.fnStoreTariffData();
                }

                return true;
            },
            fnSuccessCallback : function(data, status,fnHeaders, oXhr, config) {
                var oMe = oXhr.oMe;
                console.log('success ',oXhr.myDataToken, ': ', data, typeof data); 
                if(typeof data == 'string'){
                    oMe.fnEmitEvent(oXhr.myDataToken,true);
                    return;
                }
                if(oMe.fnAddToLocalStorage(oXhr.myDataToken, data.result)) {
                    oMe.fnEmitEvent(oXhr.myDataToken, false);
                }
            },
            fnErrorCallback : function(data, status, fnHeaders, oXhr, config) {
                var oMe = oXhr.oThis;
                console.log('error ',oXhr.myDataToken,': ', data);
                oMe.fnEmitEvent(oXhr.myDataToken, true);
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
                    myDataToken : 'journeyTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllBookingStates'),
                    method: 'GET',
                    myDataToken : 'bookingStates',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllGrades'),
                    method: 'GET',
                    myDataToken : 'grades',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllReasons'),
                    method: 'GET',
                    myDataToken : 'reason',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetAllTariff'),
                    method: 'GET',
                    myDataToken : 'tariff',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetVehicleNames'),
                    method: 'GET',
                    myDataToken : 'vehicleNames',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetStatistics'),
                    method: 'GET',
                    myDataToken : 'statistics',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestApiGetTravelType'),
                    method: 'GET',
                    myDataToken : 'travelTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);

                oThis.iApiLimit++;  // increment iApiLimit for every Prerequisite API call.
                $http({
                    url: URLService.service('RestGetAllVehicleTypes'),
                    method: 'GET',
                    myDataToken : 'vehicleTypes',
                    oMe : oThis,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }).success(oThis.fnSuccessCallback).error(oThis.fnErrorCallback);
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
            fnGetJourneyTypeBySubJourneyTypeId : function(sId){         // Function to return Only Main JourneyTypes
                // filter main journey types i.e. where parentId = 0;
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
                        return oJt[i];
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
                    iCount = oJt.length,
                    sSelId = null;

                for(var i=0;i<iCount;i++){
                    if(oJt[i].id == sSubJourneyTypeId) {
                        sSelId = oJt[i].parentId;
                        break;
                    }
                }
                if(sSelId){
                    return this.fnGetJourneyObjectById(sSelId);
                }

                return null;
            },
            fnGetTariffData : function(){           // function to return TariffData
                return this.oLs[this.currentDate]['tariff'];
            },
            fnStoreTariffData : function() {
                var oThis = this,
                    aTd = oThis.fnGetTariffData(),
                    aFormatedTd = {};

                for(var k in aTd){
                    var tariffData = aTd[k],
                        oTd = [],
                        sTmpDuration = '',
                        sTmpKms = '';
                    for(var i=0;i<tariffData.length;i++) {
                        var tariffRow = {
                            'duration': tariffData[i].duration,
                            'kms' : tariffData[i].kms
                        }
                        tariffRow['vehicleType' + tariffData[i].vehicleType] = tariffData[i].price;
                        for(var j=i;j<tariffData.length;j++){
                            if(    tariffData[i].duration == tariffData[j].duration
                                && tariffData[i].kms == tariffData[j].kms
                            ){
                                tariffRow['vehicleType' + tariffData[j].vehicleType] = tariffData[j].price;
                            }
                        }
                        if(sTmpDuration != tariffData[i].duration && sTmpKms != tariffData[i].kms) {
                            oTd.push(tariffRow);
                            sTmpDuration = tariffData[i].duration;
                            sTmpKms = tariffData[i].kms;
                        }
                    }
                    aFormatedTd[k] = oTd;
                }
                oThis.fnAddToLocalStorage('tariffTypeOnVehicleType', aFormatedTd);
            },
            fnGetTariffByVehicleType : function(sVehicleType){
                var oThis = this;

                return this.oLs[this.currentDate]['tariffTypeOnVehicleType'][sVehicleType] || null;
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
                var aBs = this.oLs[this.currentDate]['bookingStates'],
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
			fnGetStatistics : function(){
                var oThis = this;
                //return oThis.oLs[oThis.currentDate]['statistics'];
                return oThis.oLs[oThis.currentDate]['statistics']['statistics'];
            },
            fnGetVehicleNames : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleNames'];
            },
            fnGetVehicleTypeById : function(sId){
                var oThis=  this,
                    oVt = oThis.oLs[oThis.currentDate]['vehicleTypes'];
                    if(!oVt){
                        alert('Problem in getting config data from server. Please contact server team immediately.');
                        return;
                    }

                for(var i=0;i<oVt.length;i++){
                    if(oVt[i].id == sId){
                        return oVt[i];
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

            fnFormatBookingHistoryData : function(aData){
                var oThis = this,
                    oRtn = [],
                    iCount = aData.length;
                for(var i=0;i<iCount;i++){
                    var oBh = aData[i];
                    oBh.srno = (i+1);
                    oBh.bookingStatusName = oThis.fnGetBookingStatusName(oBh.bookingStatus);
                    oBh.bookingDisplayDate = oThis.fnFormatDate(oBh.bookingDate) +' '+ oThis.fnFormatHours(oBh.bookingTime)+':'+ oThis.fnFormatMinutes(oBh.bookingTime);
                    oBh.pickupDisplayDate = oThis.fnFormatDate(oBh.pickupDate);
                    oBh.pickupDisplayTime = oThis.fnFormatHours(oBh.pickupTime) + ':' + oThis.fnFormatMinutes(oBh.pickupTime);
                    oBh.subJourneyTypeName = oThis.fnGetJourneyTypeName(oBh.subJourneyType);
                    oBh.vehicleDisplayName = oThis.fnGetVehicleDisplayNameById(oBh.vehicleName);
                    oRtn.push(oBh);
                }
                return oRtn;
            },
            fnGetCallTime : function(){
                var oD = new Date(),
                    sH = oD.getHours(),
                    sM = oD.getMinutes(),
                    sS = oD.getSeconds();

                return ((sH <=9? '0' + sH: sH) + ':' + (sM <=9? '0' + sM: sM) + ':' + (sS <=9? '0' + sS: sS));
            },
            fnGetGradeById : function(sId){
                var oThis = this,
                    oG = oThis.oLs[oThis.currentDate]['grades'];
                for(var i=0;i<oG.length;i++){
                    if(oG[i].id == sId){
                        return oG[i];
                    }
                }
                return null;
            },

            fnGetTravelTypes : function(){
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['travelTypes'];
            },
            fnGetVehicleConditionTypes: function() {
                var oData = [{
                    "id": "1",
                    "condition": "ok"
                }, {
                    "id": "2",
                    "condition": "Acceptable"
                }, {
                    "id": "3",
                    "condition": "Need to Change"
                }];
                return oData;
            },
            fnGetStatusTypes: function() {
                var oData = [{
                    "id": "1",
                    "status": "Active"
                }, {
                    "id": "2",
                    "status": "In Active"
                }];
                return oData;
            },

            /* per Thanish, tariffType are the columns in the tariff sheet.
               Eg. Small, Medium, Tavera, Xylo/Innova
            */
            tariffTypes : [{
                id : 1,
                tariffType : 'Small',
            },{
                id : 3,
                tariffType : 'Medium',
            },{
                id : 5,
                tariffType : 'Tavera',
            },{
                id : 6,
                tariffType : 'Xylo / Innova',
            }],
            fnGetTariffTypes : function() {
                return this.tariffTypes;
            },
            fnGetTariffTypeById : function(sId) {
                var aTt = this.tariffTypes;
                for(var i=0;i<aTt.length;i++){
                    if(sId == aTt[i].id){
                        return aTt[i]
                    }
                }
                return null;
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
                var oThis = this;
                return oThis.oLs[oThis.currentDate]['vehicleTypes'];
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