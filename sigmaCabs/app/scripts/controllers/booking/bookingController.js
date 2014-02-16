/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('bookingController', function($scope, $rootScope, URLService, BookingService, VehiclesService, $routeParams, PrerequisiteService) {

        //attach safeApply
        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };



        // Get the preRequisiteData
        PrerequisiteService.fnGetPrerequisites();


        var scope = $scope;

        // save the getCall phone in scope.
        scope.callerPhone = $routeParams.mobile;

        // show the current time as callTime
        scope.callTime = PrerequisiteService.fnGetCallTime();
        scope.headCustomerCode = "-";

        scope.searchDetails = {
            searchString : ''
        };

        // variable which holds tariffGrid data
        scope.tariffGridData = null;

        scope.showBookingDetails =  true;        
        scope.showExistingCustomerAddBooking = true;
        scope.callerInfo = "";
        scope.tmpDetails = {};

        scope.fnClearBookingForm = function() {
            scope.bookingDetails = {
                pickupDate : PrerequisiteService.fnFormatDate(),
                pickupHours : PrerequisiteService.fnFormatHours(),
                pickupMinutes : PrerequisiteService.fnFormatMinutes(),
                pickupAddress : '',
                pickupLandmark : '',
                dropAddress : '',
                passengerCount : '',
                luggageType : '',
                comments : '',
                vehicleType: '1',
                vehicleName: '',
                id: '',
                customerId : ''
            };
            scope.tmpDetails.tmpVehicleType = '1';
            scope.tmpDetails.tmpVehicleName = '';

            scope.tmpDetails.tmpJourneyType = '1';
            scope.bookingDetails.subJourneyType = '5'; 

            // also clear selected Tariff Grid
            $rootScope.$emit('eventTariffGridDataChanged', null);
        };

        scope.showBookingDetailsTab = function(){
            $scope.showTariffDetails =  false;
            $scope.showBookingDetails =  true;
        };

        scope.showTariffDetailsTab = function() {
            $scope.showBookingDetails =  false;
            $scope.showTariffDetails =  true;


            window.setTimeout(function(){
                $(window).resize();
                $(window).resize();
            }, 1000);


        };

        // there can be a scenario wherein existing user calls, but asks to book for another existing or new customer.
        // for that issue we are maintaining a separate object called workareaCustomerDetails in short waCustomerDetails
        scope.waCustomerDetails = {};

        // Set the default Data
        scope.customerDetails = {
            name : '',
            callerPhone : scope.callerPhone,
            mobile2 : '',
            id : ''
        };
        scope.fnClearBookingForm();
        scope.bookingHistoryDetails = [];

        // add the loading text message
        scope.existingCustomerAddBooking = URLService.view("loadingText");
        scope.loadingText = "booking data";

        // fn which loads unexpected error
        scope.fnLoadUnexpectedError = function() {
            scope.existingCustomerAddBooking = URLService.view('errorResponseFormatMisMatch');
        };
        // fn which loads booking view
        scope.fnLoadBookingView = function() {
            scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');

            $(window).resize();
        };

        //fn which clears searchedCustomer details
        scope.fnClearSearchCustomerDetails = function() {
            scope.searchedCustomerDetails = {
                name : '',
                mobile : '',
                altMobile : '',
                id : ''
            };
        };


        // variable which stores searchedCustomerDetails
        scope.fnClearSearchCustomerDetails();


        // fn to search customer by mobile.
        scope.fnSearchCustomerByMobile = function(sMobile){
            BookingService.fnFindCustomerByMobile({
                mobile: sMobile
            })
            .success(function(data, status, headers, config) {
                if(data.status == 500){ // no data found of customer/booking 
                    console.log('500 fnSearchCustomerByMobile', data);
                    
                    // clear searchCustomerDetails as there is no customer
                    scope.fnClearSearchCustomerDetails();

                    // copy customerDetails in workArea.
                    angular.copy(scope.customerDetails, scope.waCustomerDetails);   

                } else if( data.status==200 
                    && data.result) {
                    scope.fnSetCustomerDetails(data, true);                        
                } else {    // error in data.result object.
                    console.log('Erro in result: fnSearchCustomerByMobile', data);   
                }
            })
            .error(function(data, status, headers, config) {
            });
        };

        // fn which sets the customer details in the model.
        scope.fnSetCustomerDetails = function(data, isFromSearchBox) {
            // set the customerCode
            scope.headCustomerCode = data.result[0].customerDetails.customerCode || "LalaSendTheCOde";
            scope.headCustomerCategory = data.result[0].customerDetails.category ? PrerequisiteService.fnGetCustomerCategoryById(data.result[0].customerDetails.category).categoryName : "-";
            scope.headCustomerGrade = PrerequisiteService.fnGetGradeById(data.result[0].customerDetails.grade).grade;
            scope.headCustomerTripCount = data.result[0].customerDetails.tripCount;
            scope.headCustomerDiscount = data.result[0].customerDetails.discount;

            scope.callerInfo = " (Existing Caller)";
            
            if(isFromSearchBox){
                scope.searchedCustomerDetails = data.result[0].customerDetails; // set the customer data which server response.

                // if callerPhone is altPHone den display mainPhone as altPhone
                if(scope.searchDetails.searchString == scope.searchedCustomerDetails.mobile2){
                    scope.searchedCustomerDetails.altMobile = scope.searchedCustomerDetails.mobile;
                } else {
                    scope.searchedCustomerDetails.altMobile = scope.searchedCustomerDetails.mobile2;
                }
                // assign workareaCustmerDetails with searchedCustomerDetails
                angular.copy(scope.searchedCustomerDetails, scope.waCustomerDetails);
            } else {
                scope.customerDetails = data.result[0].customerDetails; // set the customer data which server response.

                // if callerPhone is altPHone den display mainPhone as altPhone
                if(scope.callerPhone == scope.customerDetails.mobile2){
                    scope.customerDetails.altMobile = scope.customerDetails.mobile;
                } else {
                    scope.customerDetails.altMobile = scope.customerDetails.mobile2;
                }
                //assign workareaCustomerDetails with customerDetails
                angular.copy(scope.customerDetails, scope.waCustomerDetails);
            }


            // check if enquiry is sent.
            if(data.result[0].hasOwnProperty('latestEnquiry')){                            
                scope.bookingDetails = data.result[0].latestEnquiry;    // set the customer data which server response.
                scope.bookingDetails.pickupDate = PrerequisiteService.fnFormatDate(scope.bookingDetails.pickupDate);    // setDate in DD/MM/YYYY format
                scope.bookingDetails.pickupHours = PrerequisiteService.fnFormatHours(scope.bookingDetails.pickupTime);  // setHours 
                scope.bookingDetails.pickupMinutes = PrerequisiteService.fnFormatMinutes(scope.bookingDetails.pickupTime);  // setMinutes
            }
            // check if enquiry is sent.
            if(data.result[0].hasOwnProperty('bookingHistory')){
                // make the historyDetails in readable form instead of ids
                scope.bookingHistoryDetails = PrerequisiteService.fnFormatBookingHistoryData(data.result[0].bookingHistory, scope.waCustomerDetails);
            }
        };

        scope.fnGetApiOverallStatistics = function() {
            VehiclesService.fnGetOverAllStatistics()
            .success(function(data, status, headers, config) {
                console.log('success fnGetApiOverallStatistics', data);
                
            })
            .error(function(data, status, headers, config) {
                console.log("Error in fnGetApiOverallStatistics", arguments);
            });
        };

        scope.fnColorRows = function(oData){
            for(var i=0;i<oData.length;i++){
                for(var j=0;j<scope.vehicleTypes.length;j++){
                        var sColor = sColor == 'aqua' ? 'orange' : 'aqua';
                    oData[i]['vehicleType' + scope.vehicleTypes[j].id + '_color'] = sColor;
                    
                }
            }
            return oData;
        }

        scope.fnLoadMainTariffGrids = function() {
            // load the tariff grids
            scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
            scope.colDefs = [
                {field:'duration', displayName:'Hrs', width: '60'},
                {field:'kms', displayName:'Kms', width: '60'}
            ];
            /* Add dynamic Columns */
            for(var i=0;i<scope.vehicleTypes.length;i++){
                var sD = scope.vehicleTypes[i].vehicleType;
                if(scope.vehicleTypes[i].id == '4'){
                    sD = 'Innova';
                } else if(scope.vehicleTypes[i].id == '2'){
                    sD = 'Verito';
                }
                scope.colDefs.push({
                    field : 'vehicleType' + scope.vehicleTypes[i].id,
                    displayName : sD,
                    width: 60,
                    // cellTemplate : '<div style="{{col.field == \'vehicleType1\' ? \'background-color: red\' : \'background-color:green;\'}}" ng-class="col.colIndex();">{{row.getProperty(col.field)}}</div>'
                    cellTemplate : '<div ng-style="{ \'background-color\': row.getProperty(col.field + \'_color\') }" ng-class="col.colIndex();">{{row.getProperty(col.field)}}</div>'
                });
            }
           
            var oX= [], oY=[], oZ=[];
            var g = PrerequisiteService.fnGetTariffByVehicleType(1),
                f = PrerequisiteService.fnGetTariffByVehicleType(2),
                l = PrerequisiteService.fnGetTariffByVehicleType(4);
            angular.copy(g, oX);
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>',oX);
            scope.tmpCityTariff = scope.fnColorRows(oX);
            angular.copy(f, oY);
            scope.tmpAirportTariff = scope.fnColorRows(oY);
            angular.copy(l, oZ);
            scope.tmpOutstationTariff = scope.fnColorRows(oZ);

            scope.mainTariffCityGrid = { 
              data: 'tmpCityTariff',
              multiSelect: false,
              columnDefs: 'colDefs',
              enableCellSelection : true
            };
            scope.mainTariffAirportGrid = { 
              data: 'tmpAirportTariff',
              multiSelect: false,
              columnDefs: 'colDefs',
              enableCellSelection : true
            }
            scope.mainTariffOutstationGrid = { 
              data: 'tmpOutstationTariff',
              multiSelect: false,
              columnDefs: 'colDefs',
              enableCellSelection : true
            };
        };


        scope.fnInit = function() {            

            scope.fnLoadMainTariffGrids();

            scope.mainTariffDetails = URLService.view('mainTariffDetails');


            // add dropdwon fields
            scope.hours = PrerequisiteService.hours;
            scope.minutes = PrerequisiteService.minutes;
            scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
            scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
            scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();
            scope.subJourneyTypes = PrerequisiteService.fnGetAllJourneyTypes();


            // show rush or normal hours in statistcs
            var oDt = new Date();
            if((oDt.getHours() >= 6 && oDt.getHours() <= 11)
                || (oDt.getHours() >= 16 && oDt.getHours() <= 22)
            ){
                scope.sHourType = "Rush Hours";
            } else {
                scope.sHourType = "Normal Hours";
            }
            
            // since mobile is passed, hit server to get CustomerDetails Based on the server
            if (scope.callerPhone) { // mobile passed

                // get the 
                scope.fnGetApiOverallStatistics();

                

                // make a call to server to get the user details...
                BookingService.fnFindCustomerByMobile({
                    mobile: scope.callerPhone
                })
                .success(function(data, status, headers, config) {
                    console.log('Success fnFindCustomerByIncomingCallPhone: ', typeof data, data);

                    if(typeof data !='object') {    // misMatched data is sent from the server.
                        scope.fnLoadUnexpectedError();  // show a red error msg.
                        return;
                    }

                    if(data.status == 500){ // no data found of customer/booking 
                        console.log('500 fnFindCustomerByMobile', data);
                        scope.callerInfo = " (New Caller)";
                        // make callPhone as mobile 
                        scope.customerDetails.mobile = scope.callerPhone;
                    } else if( data.status==200 
                        && data.result
                        && data.result.length) {
                        scope.fnSetCustomerDetails(data);                        
                    } else {    // error in data.result object.
                        console.log('Erro in result: fnFindCustomerByMobile', data);   
                    }                    

                    scope.fnLoadBookingView();
                })
                .error(function(data, status, headers, config) {
                    console.log('error fnFindCustomerByMobile: ', data);
                    
                    alert('There was some error while getting customer details. ');
                    scope.fnLoadBookingView();
                });
            } else {    
                scope.fnLoadBookingView();
                console.warn('Landing on callTaker view even when there is no in-coming call.');
            }
        };

        scope.fnFormatTariffGridDetails = function(oData){
            console.log('fnFormatTariffGridDetails', oData);
            $rootScope.$emit('eventTariffGridDataChanged', oData);
            // scope.tariffGridData = oData;
        };

        // Main Controller Init Point
        // // waits until configuration/prerequisits data loads always
        var oRootEventPrereqLoaded = $rootScope.$on('eventPrerequisitsLoaded', function(){
            scope.fnInit();
        });

        scope.$watch('bookingDetails', function(newVal,oldVal){
            console.log('>>>>',scope.bookingDetails.pickupPlace);
            scope.safeApply();
            // scope.bookingDetails.$render();
        });

        var oEventSelBokgFrmHist  = $rootScope.$on('eventSelectedBookingFromHistory', function(ev, oData) {                        
            // clear booking form
            scope.fnClearBookingForm(); 

            console.log('<<||>> eventSelectedBookingFromHistory: ', oData);

            scope.tmpDetails.tmpVehicleType = oData.bookingDetails.vehicleType;
            scope.tmpDetails.tmpVehicleName = oData.bookingDetails.vehicleName;

            var oTmpJt = PrerequisiteService.fnGetJourneyTypeBySubJourneyTypeId(oData.bookingDetails.subJourneyType);

            scope.tmpDetails.tmpJourneyType = oTmpJt.parentId;

            scope.bookingDetails = oData.bookingDetails;
            scope.bookingDetails.pickupDate = PrerequisiteService.fnFormatDate(oData.bookingDetails.pickupDate, true);    // setDate in DD/MM/YYYY format;
            scope.bookingDetails.pickupHours = PrerequisiteService.fnFormatHours(oData.bookingDetails.pickupTime);  // setHours 
            scope.bookingDetails.pickupMinutes = PrerequisiteService.fnFormatMinutes(oData.bookingDetails.pickupTime);  // setMinutes

            // also load tariffGridData
            var oT = PrerequisiteService.fnGetTariffById(oData.bookingDetails.tariffId);
            scope.fnFormatTariffGridDetails({
                amount: oT.price,
                comments: oT.comments,
                distance: oT.distance,
                duration: (oT.duration / 60),
                extraCharges: '',
                extraHour: oT.extraHrPrice,
                extraKm: oT.extraKmPrice,
                graceTime: '',
                id: oT.id,
                vehicleName: scope.bookingDetails.vehicleName ? PrerequisiteService.fnGetVehicleNameById(scope.bookingDetails.vehicleName).vehicleName : 'Any-Vehicle',
                vehicleType: PrerequisiteService.fnGetVehicleTypeById(scope.bookingDetails.vehicleType).vehicleType
            });

            //  scope.headBookingType = scope.bookingDetails.bookingStatusName;
            scope.headBookingCode = scope.bookingDetails.bookingCode;
            scope.safeApply();

        });

        scope.$on('eventHeadBookingType',function(event, oData){
            scope.headBookingType = oData.type
        });

        scope.$on('$destroy', function () {
            console.log('NNNNNNNNNNNNNNNNNNNNNNNNNNNN');
            oEventSelBokgFrmHist();
            oRootEventPrereqLoaded();
        });
    
    });
