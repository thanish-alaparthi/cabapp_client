'use strict';

angular.module('sigmaCabsApp')
    .run(function(AuthenticationService, $window, URLService, $rootScope) {
        // check for userSession.. and redirect to login screen if session dznt exists.
        AuthenticationService.getSession()
            .success(function(oData) {
                $rootScope.$broadcast('userInfoFromSession', {
                    "displayName": "Mario Ray",
                    "role": 1,
                    "id": 234565434
                });
                return;
                if (oData.status != 200) {
                    $window.location = URLService.page('logout');
                } else {
                    // trigger the event to show all the userName
                    $rootScope.$broadcast('userInfoFromSession', oData.result.userInfo);
                }
            })
    })
    .controller('controlViewController', function($scope, $rootScope, URLService, DispatchService, PrerequisiteService, $dialog, modalWindow, $timeout, serverService,PreConfigService) {
        var scope = $scope, 
            _controller = 'controlViewController';

        // Get the preRequisiteData
        PrerequisiteService.fnGetPrerequisites();


        /* Auto Refresh stuff*/
        scope.autoRefreshBookingMgmt = true;


        /*START: setting heights for the elements*/
          scope.containerHeight = 30;
          scope.bookingGridBorder = 96;
          scope.bookingGridHeight = 88;
          scope.bookingVehiclesGridHeight = 123;
          /*END: setting heights for the elements*/

          /*START: setting initial views to display*/
          scope.showControlViewDetails = true;
          scope.informationViewDisplay = true;
          scope.vehicleViewDisplay = true;
          scope.infoVehicleCombiDisplay = false;
          scope.bookingSelected = false;
          scope.showingBookingsGrid = true;
          scope.bookingVehicleSelected = false;
          scope.whileDrivingVehicleSelected = false;
          scope.bookingInfoRecordSelected = false;

          scope.showVacantVehicleGrid = true;
          scope.showVehicleInfo = false;
          scope.showCloseVehicleInfoBtn = true;
          /*END: setting initial views to display*/

          /*START: setting initial data*/
          var POLLING_INTERVAL = 4000;
          scope.bookingData = [];
          scope.bookingDataObjs = []
          scope.bookingDataLength = 0;

          scope.bookingInfoData = [];
          // setting to current Date
          scope.bookingInfoDate = PrerequisiteService.fnFormatDate();
          scope.bookingInfoDataObjs = [];
          scope.bookingInfoDataLength = 0;

          scope.whileDrivingData = [];
          scope.whileDrivingDataObjs = [];
          scope.whileDrivingDataLength = 0;

          scope.vehiclesForBookingData = [];
          scope.vacantVehiclesData = [];        
          scope.vacantVehiclesDataObjs = [];        
          scope.selectedBookingItems = [];
          scope.selectedVacantVehicleRecords = [];
          scope.selectedBookingVehicleRecords = [];
          scope.selectedWhileDrivingVehicleRecords = [];
          scope.selectedBookingInfoRecords = [];
          scope.selectedAutoLoginVehiclesRecords = [];

          // on load datepicker gives error if ngMode is undefiend.
          scope.biSearch = {
            bookingInfoDate : scope.bookingInfoDate,
          };
          scope.alSearch = {
            loginDate : scope.bookingInfoDate,
          };

        scope.fnResetVehicleDetailsPanel = function(){
          scope.showVacantVehicleGrid = true;
          scope.showVehicleInfo = false;
          scope.showCloseVehicleInfoBtn = true;

          scope.selectionFirstTab();
        };


        scope.fnInitializeVars = function() {
          scope.currentSelectedTab = 0;  // vehicle Details tab selected by default

          scope.vehicleDetailedInfoSplitView = URLService.view('vehicleDetailedInfoSplitView');

          scope.mainGridView = 'bMgmt';
          /*END: setting initial data*/

          /* date picker min and max */
          scope.dpMinDate = '01/02/2014';
          scope.dpMaxDate = '10/03/2014';

          /*START: resize methods for grids */
          scope.resize_BookingMgmtGrid = function(){
            $timeout(function(){
              $('#dispatcherBookingsListGrid').trigger('resize');
            },0);
          }
          scope.resize_vacantVehiclesGrid = function(){
            $timeout(function(){
              $('#dispatcherVacantVehiclesGrid').trigger('resize');
            },0);
          }
          scope.resize_BookingVehiclesGrid = function(){
            $timeout(function() {
              $('#dispatcherVehiclesForBookingGrid').trigger('resize');
            }, 0);
          }
          scope.resize_WhileDrivingVehiclesGrid = function(){
            $timeout(function() {
              $('#dispatcherWhileDrivingListGrid').trigger('resize');
            }, 0);
          }
          scope.resize_BookingInfoGrid = function(){
            $timeout(function() {
              $('#dispatcherBookingsInfoGrid').trigger('resize');
            }, 0);
          };
          scope.resize_AutoLoginVehiclesGrid = function(){
            $timeout(function() {
              $('#autoLoginVehicleGrid').trigger('resize');
            }, 0);
          };

          // get the vehicleTypes for filters        
          scope.subJourneyTypes = angular.copy(PrerequisiteService.fnGetAllJourneyTypes());

          scope.hours =angular.copy(PrerequisiteService.hours);
          scope.hours['all'] = 'All';
          
          scope.oSearchBy = angular.copy(PrerequisiteService.fnGetSearchByTypes());
          scope.journeyTypes = angular.copy(PrerequisiteService.fnGetAllJourneyTypes());
          scope.journeyTypes.push({
            id: "",
            journeyType: "----All----",
            parentId: "0"
          });
          scope.vNames = angular.copy(PrerequisiteService.fnGetVehicleNames());
          scope.vTypes = angular.copy(PrerequisiteService.fnGetVehicleTypes());
          scope.vStates = angular.copy(PrerequisiteService.fnGetAllVehicleStatus());
          scope.vStates.push({
            description: "----All----",
            id: "",
            status: "1",
            vehicleStatus: "----All----"
          });
          // push vehicleTypes and vehicleNames in 1 filter
          scope.oVehicles = [];
          scope.oVehicleDefault = {
            title : '----All----',
            id : '',
            isVehicleType : false,
            vehicleType : ''
          };
          for(var i=0;i<scope.vTypes.length;i++){
            scope.oVehicles.push({
              title : scope.vTypes[i].vehicleType,
              id : scope.vTypes[i].id,
              isVehicleType : true,
              vehicleType : scope.vTypes[i].vehicleType
            });
          }
          scope.oVehicles.push(scope.oVehicleDefault);
          for(var i=0;i<scope.vNames.length;i++){
            scope.oVehicles.push({
              title : scope.vNames[i].vehicleName,
              id : scope.vNames[i].id,
              isVehicleType : false,
              vehicleType : scope.vNames[i].vehicleType,
            });
          }

          scope.oVacantTimes = angular.copy(PrerequisiteService.fnGetVacantTimes());
          scope.oVacantTimes.push({
            'title' : '---All---',
            id: ''
          });

          scope.vAttTypes = angular.copy(PrerequisiteService.fnGetAttachmentTypes());
          scope.vAttTypes.push({
            attachmentType: "---All---",
            id: ""
          });
          scope.vConditions = angular.copy(PrerequisiteService.fnGetVehicleConditionTypes());
          scope.vConditions.push({
            condition: "---All---",
            id: ""
          });
          scope.vModYear = angular.copy(PrerequisiteService.fnGetVehicleManufacturingYears());
          scope.vModYear[''] = 'All';
          scope.vNames.push({
            id: "0",
            status: "1",
            tariffType: "0",
            vehicleName: "All",
            vehicleType: "0"
          });
          scope.vTypes.push({
            description: "All Vehicle Types",
            id: "0",
            status: "1",
            vehicleType: "All"
          });
          scope.chbVtype = [];
          for(var i=0,iC=scope.vTypes.length;i<iC;i++){
            scope.chbVtype[scope.vTypes[i].id] = false;
          }

          // set default counts for filter statuses
          scope.allCount = 0;
          scope.ytdCount = 0;
          scope.altCount = 0;
          scope.cnfCount = 0;

          scope.nxtHrs = [{
            'txt' : 'Next 1 hour',
            'val' : '1'
          }, {
            'txt' : 'Next 2 hour',
            'val' : '2'
          }, {
            'txt' : 'Next 3 hour',
            'val' : '3'
          }];
          scope.oMonths = angular.copy(PrerequisiteService.fnGetMonthsObjects());
          scope.oMonths[''] = 'All';

          scope.projHrs = [{ 'txt' : 'All', 'val': ''}];
          for(var i=12;i<=24;i+=2) {
            scope.projHrs.push({
              'txt' : i.toString(),
              'val' : i.toString()
            });
          }
          scope.collections = [{ 'txt' : 'All', 'val': ''}];
          for(var i=500;i<=2000;i+=500) {
            scope.collections.push({
              'txt' : i.toString(),
              'val' : i.toString()
            });
          }

          scope.bdSearch = {
            bookingStatus : [PreConfigService.BOOKING_YET_TO_DISPATCH],  // default to yet to dispatch
            vehicle : scope.oVehicleDefault,
            nxtHrs: '1',
            projHrs : '',
            collection: '',
            vModMonth : '',
            vModYear : '',
            attType : '',
            vCondtion : '',
            vacantTm : ''
          };

          scope.viSearch = {
            collection : '',
            projHrs  : '',
            zone : '',
            area: '',
            vacantTm : '',
            vCondtion  : '',
            vehicle : scope.oVehicleDefault,
            attType :  ''
          };
          scope.biSearch = {
            bookingInfoDate : scope.bookingInfoDate,
            vehicle : scope.oVehicleDefault,
            pickupTm : 'all',
            journey : '',
            sjFrom : '',
            sjTo :  '',
            zone : '',
            area : '',
            searchByType : '',
            searchByText: ''
          };
          scope.alSearch = {
            loginDate :scope.bookingInfoDate,
            vehicle : scope.oVehicleDefault,
            zone : '',
            area : '',
            fromTime : 'all',
            toTime: 'all'
          };
        };

        //generic function to extract vehicleType and vehcileName from filter specified
        scope.fnGetVehicleTypeAndName = function(oD){
          if(oD.isVehicleType) {
            return {  
              vName : '',
              vType : oD.id
            }
          } else {
            return {
              vName : oD.id,
              vType : oD.vehicleType
            }
          }
        };


      /********** Start of Polling Functionality ***********/
        scope.pollForBookingsAfter30Seconds = function(){
          console.log('------------------ in pollForBookingsAfter30Seconds');
            $timeout(function(){
              if(scope.autoRefreshBookingMgmt == false && scope.mainGridView == 'bMgmt'){
                console.log('3333333333333333333333333333 pollForBookingsAfter30Seconds 30seconds');
                scope.autoRefreshBookingMgmt = true;
                scope.setBookingMgmtGrid();

                scope.setVacantVehiclesGrid();
              }
            }, 30000);
        };
        var pollForBookings = function(){
          console.log('------------------ in pollForBookings');
          $timeout(function(){
            if(scope.autoRefreshBookingMgmt && scope.mainGridView == 'bMgmt') {
              console.log('4444444444444444 pollForBookings 4seconds');
              scope.setBookingMgmtGrid();
            }
          }, POLLING_INTERVAL);
        };
        var pollForVacantVehicles = function(){
          $timeout(scope.setVacantVehiclesGrid, POLLING_INTERVAL);
        }
        var pollForWhileDrivingVehicles = function(){
          $timeout(scope.setWhileDrivingVehiclesGrid, POLLING_INTERVAL);
        }
      /********** End of Polling Functionality ***********/

        /*END: resize methods for grids*/

    /*START: Formatting and Loading methods for the grids data */
        /*START: Formatter methods*/
        scope.FormatNloadBookingMgmtGridData = function(data){
          console.log('raw bookingGridData', data)

          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.bookingId = datum.bookingId;
            datum.vehicleName = (datum.vehicleName) ? formatSource.fnGetVehicleDisplayNameById(datum.vehicleName) : '';
            datum.bookingStatusNm = formatSource.fnGetBookingStatusName(datum.bookingStatus);
            datum.bookingStatus = datum.bookingStatus;
            var sJourneyTypeId = datum.subJourneyType;
            datum.subJourneyType = (datum.subJourneyType) ? formatSource.fnGetJourneyTypeName(datum.subJourneyType) : '';
            datum.pickupTime = formatSource.fnFormatHours(datum.pickupTime) + ':' + formatSource.fnFormatMinutes(datum.pickupTime);
          }
          console.log('Formated data',data);
          scope.loadBookingMgmtGridData(data);
        }
        scope.FormatNloadWhileDrivingVehiclesGridData = function(data){
          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.bookingId = datum.bookingId;
            datum.vehicleName = formatSource.fnGetVehicleDisplayNameById(datum.vehicleName);
            datum.vehicleType = formatSource.fnGetVehicleDisplayTypeById(datum.vehicleType);
            var sJourneyTypeId = datum.subJourneyType;
            datum.subJourneyType = formatSource.fnGetJourneyTypeName(datum.subJourneyType);            
            datum.pickupTime = formatSource.fnFormatHours(datum.pickupTime) + ':' + formatSource.fnFormatMinutes(datum.pickupTime);
          }
          scope.loadWhileDrivingVehiclesGridData(data);
        }
        scope.FormatNloadVacantVehiclesGridData = function(data){
          var data = data, 
              dataLen = data.length,          
              namesService = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.vehicleName = namesService.fnGetVehicleDisplayNameById(datum.vehicleName);
          }
          scope.loadVacantVehiclesGridData(data);
        }
        scope.FormatNloadBookingVehiclesGridData = function(data){
         var data = data, 
              dataLen = data.length,          
              namesService = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.vehicleName = (datum.vehicleName) ? namesService.fnGetVehicleNameById(datum.vehicleName).vehicleName : '';
          }
          scope.loadBookingVehiclesGridData(data);
        }
        scope.FormatNloadVehicleDetailsData = function(data){
          var data = data, 
              dataLen = data.length,          
              namesService = PrerequisiteService,
              oData = {};

          // vehicle details
          if(data.vehicle) {
            console.log('selected vehicle details: ',data);
            oData.vehicle = {
              "id": data.vehicle.vehicleId || '',
              "vehicleCode": data.vehicle.vehicleCode || '',
              "registrationNumber": data.vehicle.registrationNumber || '',
              "vehicleNameId": data.vehicle.vehicleName || '',
              "currentKms": data.vehicle.currentKms || '0',
              "vehicleName": PrerequisiteService.fnGetVehicleDisplayNameById(data.vehicle.vehicleName) || '',
              "vehicleTypeId": data.vehicle.vehicleType || '',
              "vehicleType": PrerequisiteService.fnGetVehicleDisplayTypeById(data.vehicle.vehicleType) || '',
              "registeredMobile": data.vehicle.registeredMobile || '', // should be changed to array
              "previousLocation": data.vehicle.previousLocation || '',
              "totalDays": data.vehicle.totalDays || 0,
              "vehicleStatus": data.vehicle.vehicleStatus || 0,
              "totalWorkingDays": data.vehicle.totalWorkingDays || 0,
              "projectedLoginTime": PrerequisiteService.fnFormatMinutesToHoursAndMinutes(data.vehicle.projectedLoginTime) || 0,
              "presentAvgLoginTime": PrerequisiteService.fnFormatMinutesToHoursAndMinutes(data.vehicle.presentAvgLoginTime) || 0,
              "projectedCollection": data.vehicle.projectedCollection || 0,
              "presentAvgCollection": data.vehicle.presentAvgCollection || 0,

              "loginTime": data.vehicle.loginTime || 0,
              "logoutTime": data.vehicle.logoutTime || 0,
              "prevousLocation": data.vehicle.prevousLocation || 0,
              "status": data.vehicle.status || 0,
              "dayCollection": data.vehicle.dayCollection || 0,
              "totalBreakTime": data.vehicle.totalBreakTime || 0,
              "totalWorkingTime": data.vehicle.totalWorkingTime || 0,
              "performance": data.vehicle.performance || 0,
              "totalBookings": data.vehicle.totalBookings || 0,
              "completedBookings": data.vehicle.completedBookings || 0,
              "roadsideBookings": data.vehicle.roadsideBookings || 0,
              "rejectedBookings": data.vehicle.rejectedBookings || 0,
              "canceledBookings": data.vehicle.canceledBookings || 0,
              "manufactureYear": data.vehicle.manufactureYear || 0,
              "manufactureMonth": data.vehicle.manufactureMonth || 0,

              // on a rating scale of 5
              "rating": data.vehicle.rating || 0,
              "aRating": PrerequisiteService.fnFormatRatingAndReturnClassArray(data.vehicle.rating),
              "facilities": data.vehicle.facilities || []
            };
          } else {
            oData.vehicle = {};
          }
          // driver details
          if(data.driver) {
            oData.driver = {
                  "id": data.driver.id || '',
                  "driverCode": data.driver.driverCode || '',
                  "name": data.driver.name || '',
                  "mobile": data.driver.mobile || '',
                  "aRating": PrerequisiteService.fnFormatRatingAndReturnClassArray(data.driver.rating),
                  "rating": Math.round(parseFloat(data.driver.rating)) || 0
              };
          } else {
            oData.driver = {};
          }

          scope.loadVehicleDetailsData(oData);
        }
        scope.FormatNloadBookingDetailsData = function(data){
          var data = data,
            dataLen = data.length,
            namesService = PrerequisiteService,
            oData = {};
          // customer details
          oData.customer = {};
          if (data.customer) {
            oData.customer = data.customer;
            oData.customer.mobile = data.customer.mobile || [];
          }

          // booking details
          oData.booking = {};
          if (data.booking) {
            oData.booking = data.booking;
            oData.booking.journeyTypeText = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(data.booking.subJourneyType).journeyType || '';
            oData.booking.subJourneyTypeText = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(data.booking.subJourneyType).journeyType || 0,
            oData.booking.tariffText = PrerequisiteService.fnGetTariffById(data.booking.tariffId).text || '';
          }

          // vehicle details
          oData.vehicle = {};
          if (data.vehicle) {
            oData.vehicle = data.vehicle;
            oData.vehicle.vehicleNameId = data.vehicle.vehicleName || '';
            oData.vehicle.vehicleTypeId = data.vehicle.vehicleType || '';
            oData.vehicle.vehicleName = PrerequisiteService.fnGetVehicleDisplayNameById(data.vehicle.vehicleName) || '';
            oData.vehicle.vehicleType = PrerequisiteService.fnGetVehicleDisplayTypeById(data.vehicle.vehicleType) || '';
          }

          // driver details
          oData.driver = {};
          if (data.driver) {
            oData.driver = data.driver;
          }

          // employee details
           oData.employee = {};
          if (data.employee) {
            oData.employee = data.employee;
          }

          scope.loadBookingDetailsData(oData);
        };
        scope.FormatNloadAutoLoginVehicleGridData = function(data){
          console.log('raw autoLoginData', data);

          attachmentType: null
          breakTime: "0"
          dayCollection: "0"
          inBreak: "No"
          location: null
          loginTime: "17:16:12"
          mobileNumber: "9603606095"
          vehicleCode: "1213"
          vehicleId: "13"
          vehicleName: "1"
          vehicleStatus: "1"
          vehicleType: "1"

          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.attachmentType = formatSource.fnGetAttachmentTypeById(datum.attachmentType);
            datum.breakTime = datum.breakTime;
            datum.dayCollection = datum.dayCollection;
            datum.inBreak = datum.inBreak;
            datum.location = datum.location;
            datum.loginTime = datum.loginTime;
            datum.mobileNumber = datum.mobileNumber;
            datum.vehicleCode = datum.vehicleCode;
            datum.vehicleId = datum.vehicleId;
            datum.vehicleName =  datum.vehicleName;
            datum.vehicleNameNm =  formatSource.fnGetVehicleNameById(datum.vehicleName).vehicleName;
            datum.vehicleStatus =  datum.vehicleStatus;
            datum.vehicleStatusNm =  formatSource.fnGetVehicleStatusTextById(datum.vehicleStatus);
            datum.vehicleType =  datum.vehicleType;
            datum.vehicleTypeNm =  formatSource.fnGetVehicleTypeById(datum.vehicleType).vehicleType;
          }
          console.log('FormatNloadAutoLoginVehicleGridData Formated data',data);
          scope.loadAutoLoginVehicleGridData(data);
        };
        scope.FormatNloadBookingInfoGridData = function(data){
          console.log('raw bookingInfoData', data);
          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            console.log(datum.vehicleStatus, datum);
            datum.attachmentTypeNm =  datum.attachmentType ? formatSource.fnGetAttachmentTypeById(datum.attachmentType): "";
            datum.vehicleNameNm =  datum.vehicleName ? formatSource.fnGetVehicleNameById(datum.vehicleName).vehicleName : "";
            datum.vehicleStatusNm =  datum.vehicleStatus ? formatSource.fnGetVehicleStatusTextById(datum.vehicleStatus) : "";
            datum.bookingStatusNm =  datum.bookingStatus ? formatSource.fnGetBookingStatusName(datum.bookingStatus) : "";
            datum.vehicleTypeNm =  datum.vehicleType ? formatSource.fnGetVehicleTypeById(datum.vehicleType).vehicleType : "";
          }
          console.log('FormatNloadBookingInfoGridData Formated data',data);
          scope.loadBookingInfoGridData(data);
        };

        scope.fnChangeToTime = function(){
          scope.alSearch.toTime = scope.alSearch.fromTime;
        };

        /*END: Formatter methods*/

        /*START: Loader methods*/
        scope.loadBookingMgmtGridData = function(data){
          var data = data;

          console.log('loadBookingMgmtGridData',data);

          scope.bookingData = data;
          scope.bookingDataObjs = angular.copy(data);
          scope.bookingDataLength = data.length;
          scope.resize_BookingMgmtGrid();
        }

        scope.loadVacantVehiclesGridData = function(data){
          scope.vacantVehiclesData = data;
          scope.vacantVehiclesDataObjs = angular.copy(data);
          scope.resize_vacantVehiclesGrid();
        }
        
        scope.loadBookingVehiclesGridData = function(data){
          scope.vehiclesForBookingData = data;
          scope.resize_BookingVehiclesGrid();
        }

        scope.loadWhileDrivingVehiclesGridData = function(data){
          scope.whileDrivingData = data;
          scope.whileDrivingDataObjs = angular.copy(data);
          scope.whileDrivingDataLength = data.length;
        }

        scope.loadAutoLoginVehicleGridData = function(data){
          scope.autoLoginVehiclesData = data;
          scope.autoLoginVehiclesObjs = angular.copy(data);
          scope.autoLoginVehiclesLength = data.length;
        }
        scope.loadBookingInfoGridData = function(data){
          scope.bookingInfoData = data;
          scope.bookingInfoDataObjs = angular.copy(data);
          scope.bookingInfoDataLength = data.length;
        }
        scope.loadVehicleDetailsData = function(data){
          scope.vehicleDetailsData = data;
          scope.vehicleDetailsData.dispatchCallDriverNo = data.driver.mobile;
        }
        scope.loadBookingDetailsData = function(data){
          scope.bookingDetailsData = data;
          scope.bookingDetailsData.bookingCallDriverNo = data.driver.mobile;
        }
        /*END: Loader methods*/
    /*END: Loading methods for the grids*/

        /*START: Loading initial grids*/
        /*START: setting the booking management grid*/
        // fn to load booking status wise bookings
        scope.fnLoadBookingStatusWise = function(aStatus) {
          scope.bdSearch.bookingStatus = aStatus;
          scope.setBookingMgmtGrid();
          scope.setVacantVehiclesGrid();

          scope.fnResetVehicleDetailsPanel();

          scope.bookingUnSelectedFn();
        };
        scope.setBookingMgmtGrid = function(doEmptyGrid){
          var oData = {};
          if(doEmptyGrid && doEmptyGrid == true){
            scope.loadBookingMgmtGridData([]);
          } else {

            // take the search filters for booking Grid load

            var oVty = scope.fnGetVehicleTypeAndName(scope.bdSearch.vehicle);
            scope.bdSearch.vName = oVty.vName;
            scope.bdSearch.vType = oVty.vType;

            console.log('bdSearch Filters', scope.bdSearch);

            oData = {
              "bookingStatus" : scope.bdSearch.bookingStatus, // send as an array.
              'nextHours' : scope.bdSearch.nxtHrs
            };


            console.log('Making call dispatcher/getAllBookings');
            serverService.sendData('P','dispatcher/getAllBookings', oData, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
          }
        }        
        scope.setBookingMgmtGrid_Success = function(data){
          console.log('>>>>>>>>>> setBookingMgmtGrid_Success', data);
          scope.FormatNloadBookingMgmtGridData(data);
          pollForBookings();
        }
        scope.setBookingMgmtGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the booking management grid*/
        
        /*START: setting the vacant vehicles grid*/
        scope.setVacantVehiclesGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true) {
            scope.loadVacantVehiclesGridData([]);
          } else {

            var oData = {};
            switch(scope.mainGridView) {
              // case 'vInfo':
              //   var oVty = scope.fnGetVehicleTypeAndName(scope.viSearch.vehicle);
              //   scope.viSearch.vName = oVty.vName;
              //   scope.viSearch.vType = oVty.vType;
              //   console.log('viSearch', scope.viSearch);
                
              //   oData = {
              //     vehicleStatus :[2,3],
              //     attachmentType : scope.viSearch.attType,
              //     condition :  scope.viSearch.vCondtion,
              //     vehicleType :  scope.viSearch.vType ? [scope.viSearch.vType] : [],
              //     vehicleName :  scope.viSearch.vName,
              //     projectedHrs :  scope.viSearch.projHrs,
              //     dayCollection :  scope.viSearch.collection
              //   };
              // break;
              case 'bMgmt':
                oData = {
                  'vehicleStatus' :[2,3],
                  'attachmentType' : scope.bdSearch.attType,
                  'collection' : scope.bdSearch.collection,
                  'projectedHours' : scope.bdSearch.projHrs,
                  'vehicleCondtion' : scope.bdSearch.vCondtion,
                  'modelMonth' : scope.bdSearch.vModMonth || '',
                  'modelYear' : scope.bdSearch.vModYear || '',
                  'vehicleName' : scope.bdSearch.vName,
                  'vehicleType' : scope.bdSearch.vType ? [scope.bdSearch.vType] : scope.fnGetAllVehicleTypeIds()
                };
              break;
            }

            serverService.sendData('P','dispatcher/getAllVehicles',oData, scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'vacantVehiclesData'},scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
          }
        }
        scope.setVacantVehiclesGrid_Success = function(data){
          scope.FormatNloadVacantVehiclesGridData(data);
          //pollForVacantVehicles();
        }
        scope.setVacantVehiclesGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the vacant vehicles grid*/

        /*START: setting the while-driving vehicles grid*/        
        scope.fnSearchWhileDrivingVehicleInfo = function(){
          scope.setWhileDrivingVehiclesGrid();
        };
        scope.setWhileDrivingVehiclesGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadWhileDrivingVehiclesGridData([]);
          else{

            var oData = {},
                oVty = scope.fnGetVehicleTypeAndName(scope.viSearch.vehicle);
                scope.viSearch.vName = oVty.vName;
                scope.viSearch.vType = oVty.vType;
                console.log('viSearch', scope.viSearch);
                
                oData = {
                  attachmentType : scope.viSearch.attType,
                  condition :  scope.viSearch.vCondtion,
                  vehicleType :  scope.viSearch.vType ? [scope.viSearch.vType] : [],
                  vehicleName :  scope.viSearch.vName,
                  projectedHrs :  scope.viSearch.projHrs,
                  dayCollection :  scope.viSearch.collection,
                  zone : scope.viSearch.zone,
                  area : scope.viSearch.area,
                  vacantTm : scope.viSearch.vacantTm
                };

            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getWhileDrivingVehicles', oData, scope.setWhileDrivingVehiclesGrid_Success, scope.setWhileDrivingVehiclesGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'whileDrivingData'},scope.setWhileDrivingVehiclesGrid_Success, scope.setWhileDrivingVehiclesGrid_Error);
          }
        }        
        scope.setWhileDrivingVehiclesGrid_Success = function(data){
          scope.FormatNloadWhileDrivingVehiclesGridData(data);
          //pollForWhileDrivingVehicles();
        }
        scope.setWhileDrivingVehiclesGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the while-driving vehicles grid*/

        /*START: setting the vehicles for booking grid*/
        scope.setVehiclesForBookingGrid = function(doEmptyGrid, data, aVehTyp){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingVehiclesGridData([]);
          else{
            var bookingObj = {'bookingId': data, 'vehicleTypes' : aVehTyp};
            
            serverService.sendData('P','dispatcher/getAllVehiclesForBooking', bookingObj, scope.setVehiclesForBooking_Success, scope.setVehiclesForBooking_Error);
            //serverService.stubData({'controller': _controller,'url':'vehiclesForBookingData'},scope.setVehiclesForBooking_Success, scope.setVehiclesForBooking_Error);
          }
        }
        scope.setVehiclesForBooking_Success = function(data){
          scope.FormatNloadBookingVehiclesGridData(data);
        }
        scope.setVehiclesForBooking_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the vehicles for booking grid*/

        /*START: setting the booking info grid*/
        scope.fnSearchBookingInfo = function(){
          scope.setBookingInfoGrid();  
        };
        scope.setBookingInfoGrid = function(doEmptyGrid){
          var oData = {};
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingInfoGridData([]);
          else{

            var oVty = scope.fnGetVehicleTypeAndName(scope.biSearch.vehicle);
            scope.biSearch.vName = oVty.vName;
            scope.biSearch.vType = oVty.vType;

            oData = {
              "bookingStatus" : [PreConfigService.BOOKING_FOLLOW_UP, PreConfigService.BOOKING_YET_TO_DISPATCH],
              "pickupDate" : PrerequisiteService.formatToServerDate(scope.biSearch.bookingInfoDate),
              "pickupTm" : ((scope.biSearch.pickupTm == 'all') ? '' : scope.biSearch.pickupTm),
              "vehicleType" : scope.biSearch.vType,
              "vehicleName" : scope.biSearch.vName,
              "journeyType" : scope.biSearch.journey,
              "subJourneyTypeFrom" : scope.biSearch.sjFrom,
              "subJourneyTypeTo" : scope.biSearch.sjTo,
              "zone" : scope.biSearch.zone,
              "area" : scope.biSearch.area,
              "searchByType" : scope.biSearch.searchByType,
              "searchByText" : scope.biSearch.searchByText
            };

            console.log('biSearch', scope.biSearch);

            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getAllBookings', oData, scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
          }
        }        
        scope.setBookingInfoGrid_Success = function(data){
          console.log('in setBookingInfoGrid_Success', data);
          scope.FormatNloadBookingInfoGridData(data);
        }
        scope.setBookingInfoGrid_Error = function(xhr, data){
          console.error('in setBookingInfoGrid_Error :: api error');
          scope.loadBookingInfoGridData([]);
        }
        /*END: setting the booking info grid*/

        /*START: setting the auto-login vehicle grid*/
        scope.fnSearchAutoLoginVehicleGrid = function(){
          scope.setAutoLoginVehicleGrid();  
        };
        scope.setAutoLoginVehicleGrid = function(doEmptyGrid){
          var oData = {};
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadAutoLoginVehicleGridData([]);
          else{

            var oVty = scope.fnGetVehicleTypeAndName(scope.alSearch.vehicle);
            scope.alSearch.vName = oVty.vName;
            scope.alSearch.vType = oVty.vType;

            oData = {
              // "attachmentType" : "",
              "loginDate" : PrerequisiteService.formatToServerDate(scope.alSearch.loginDate),
              "vehicleType" : scope.alSearch.vType,
              "vehicleName" : scope.alSearch.vName,
             //  "projectedHrs" : "",
              "zone" : scope.alSearch.zone,
              "area" : scope.alSearch.area,
              "expLoginFrom" : ((scope.alSearch.fromTime == 'all') ? '' : scope.alSearch.fromTime ),
              "expLoginTo" : ((scope.alSearch.toTime == 'all') ? '' : scope.alSearch.toTime )
            };

            console.log('alSearch', scope.alSearch);

            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getAutoLoginVehicles', oData, scope.setAutoLoginVehicleGrid_Success, scope.setAutoLoginVehicleGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
          }
        }        
        scope.setAutoLoginVehicleGrid_Success = function(data){
          // scope.loadAutoLoginVehicleGridData(data);
          scope.FormatNloadAutoLoginVehicleGridData(data);
        }
        scope.setAutoLoginVehicleGrid_Error = function(xhr, data){
          console.error('in setAutoLoginVehicleGrid_Error :: api error');
          scope.loadAutoLoginVehicleGridData([]);
        }
        /*END: setting the Auto-login vehicle grid*/


        /********** Start of Details loaders ***********/
        /*START: setting the vehicle details for selected Vehicle*/
        scope.setVehicleDetails = function(clearDetails, data){
          if(clearDetails && clearDetails == true)
            scope.loadVehicleDetailsData({});
          else{
            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getVehicleQuickInfo',{'vehicleId':data},scope.setVehicleDetails_Success, scope.setVehicleDetails_Error);
            // serverService.stubData({'controller': _controller,'url':'vehicleDetails'},scope.setVehicleDetails_Success, scope.setVehicleDetails_Error);
          }
        }
        scope.setVehicleDetails_Success = function(data){
          scope.FormatNloadVehicleDetailsData(data);          
        }
        scope.setVehicleDetails_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the vehicle details for selected Vehicle */

        /*START: setting the booking details for selected booking record*/
        scope.setBookingDetails = function(clearDetails, data){
          if(clearDetails && clearDetails == true)
            scope.loadBookingDetailsData({});
          else{
            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getBookingQuickInfo',{'bookingId':data},scope.setBookingDetails_Success, scope.setBookingDetails_Error);
            // serverService.stubData({'controller': _controller,'url':'bookingDetails'},scope.setBookingDetails_Success, scope.setBookingDetails_Error);
          }
        }        
        scope.setBookingDetails_Success = function(data){
          scope.FormatNloadBookingDetailsData(data);
        }
        scope.setBookingDetails_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the booking details for selected booking record*/
        /********** End of Details loaders ***********/

        /******************************************************
        START: Init method, starting point of this controller*/
        scope.fnInit = function(){
          scope.fnInitializeVars();

          scope.selectionFirstTab();

          scope.setBookingMgmtGrid();
          scope.setVacantVehiclesGrid();          
        }
        /*END: Init method, starting point of this controller
        ******************************************************/

        $rootScope.$on('eventPrerequisitsLoaded', function() {
            scope.fnInit();
        });
    /*END: Loading initial grids*/


        /*START: Tabs functionality*/
        var whichTab = 0;
        scope.tabs=[
          {
             "label": 'Vehicles'
            , "tooltip": 'Vehicles for the selected booking'
            , "id": 0
            , "splitTabId": "splitBookingVehicles"
            , "selected": false
            , "template": "views/dispatches/vehiclesForBookingSplitView.html"
            , "callback": 'vehicleTabClicked'
          },{
              "label": 'Booking Details'
            , "tooltip": 'Detailed booking info'
            , "id": 1
            , "splitTabId": "splitBookingInfo"
            , "selected": false
            , "template": "views/dispatches/bookingDetailedInfoSplitView.html"
            , "callback": 'bookingTabClicked'
          }
        ];

        scope.tabs_whileDriving=[
           {
             "label": 'Vehicle Details'
            , "tooltip": 'Selected Vehicle\'s details'
            , "id": 0
            , "splitTabId": "splitVehicleDetails"
            , "selected": false
            , "template": "views/dispatches/vehicleDetailedInfoSplitView.html"
            , "callback": 'vehicleDetailsTabClicked'
          }, {
              "label": 'Booking Details'
            , "tooltip": 'Detailed booking info'
            , "id": 1
            , "splitTabId": "splitBookingInfo"
            , "selected": false
            , "template": "views/dispatches/bookingDetailedInfoSplitView.html"
            , "callback": 'bookingTabClicked'
          }

        ];

        scope.previousSelectedTab = null;        
        scope.currentlyClickedTab = null;

        scope.selectionFirstTab = function(){
          for(var i=0;i<scope.tabs.length;i++){
            scope.tabs[i].selected = false;
          }
          scope.tabs[0].selected = true;
          
          scope.splitCurrentTab = scope.tabs[0].template;
          scope.currentSelectedTab = scope.tabs[0].id;
        };
        scope.selectionFirstTab_WhileDriving = function(){
          for(var i=0;i<scope.tabs_whileDriving.length;i++){
            scope.tabs_whileDriving[i].selected = false;
          }

          scope.tabs_whileDriving[0].selected = true;
          scope.splitCurrentTab = scope.tabs_whileDriving[0].template;
          scope.currentSelectedTab = scope.tabs_whileDriving[0].id;
        };

        /*
          Method description: Handle tab click
          PARAMS: steps array
        */
        scope.handleTabClick = function(clickedid, tabs){
          console.log(tabs);
          if(scope.currentSelectedTab == clickedid)
            return;          
          tabs[scope.currentSelectedTab].selected = false;
          tabs[clickedid].selected = true;
          scope.previousSelectedTab = scope.currentSelectedTab;
          scope.currentSelectedTab = clickedid;
          whichTab = clickedid;
          scope.splitCurrentTab = tabs[whichTab].template;
          if(tabs[whichTab].callback)
            scope[tabs[whichTab].callback].call();
        };

        scope.vehicleTabClicked = function(){

        }
        scope.bookingTabClicked = function(){
          if(!scope.selectedBookingId){
            alert('Please select a booking first.');

            scope.selectionFirstTab();

            return;
          }
          scope.setBookingDetails(false, scope.selectedBookingId);
        }
        scope.vehicleDetailsTabClicked = function(){
          
        }
        
        /*END: Tabs functionality*/

       /*START: Grid related functionality*/
        
        /*START: Bookings Management Grid*/
        scope.bookingSearch = function(){          
          $scope.getBookingDataAsync(scope.bookingGridPgOptions.pageSize,scope.bookingGridPgOptions.currentPage, scope.filterText);
        }
        scope.setPageSize = function(){
          return scope.bookingGridPgOptions.pageSize;
        }
        scope.$watch('bookingGridPgOptions', function () {
          $scope.getBookingDataAsync($scope.bookingGridPgOptions.pageSize,$scope.bookingGridPgOptions.currentPage, $scope.filterText);
        }, true);

        scope.getBookingDataAsync = function (pageSize, page, searchText) {
          var data, resultLabel;
            if(searchText){
              var ft = searchText.toLowerCase();
              data = scope.bookingData.filter(function(item) {
                return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
              });
              $scope.setPagingData(data,page,pageSize, true);
            
            }else{
              $scope.setPagingData(scope.bookingDataObjs,page,pageSize);
            }  
        };

        scope.setPagingData = function(data, page, pageSize, setToFirstPage){
          if(data){
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            scope.bookingData = pagedData;
            if(setToFirstPage)
              $scope.bookingGridPgOptions.currentPage = 1;
          }
        };
        
        scope.bookingGridPgOptions = {
          pageSizes: [20, 25, 30],
          pageSize: 20,
          currentPage: 1
        };

        scope.fnVehicleCodeAdded = function(oRow, oField) {
          console.log('arguments', arguments);
          var sVCode = angular.copy(oField.sModel);
          if(confirm('Assign Vehicle:' + sVCode + ' to Booking:' + oRow.bookingCode + '?')){
            scope.fnControlViewVehicleReserveBooking(oField.sModel, oRow.bookingId);
          }
          oField.sModel = '';
        };

        scope.fnTest = function(){
            scope.gridBookingsData.selectAll(false);
            scope.tst  = true;
            $timeout(function(){
                      // scope.bookingUnSelectedFn();     
            }, 10);
           
        };

        scope.bookingGridColDefs = [
          {field:'bookingCode', displayName:'B.No', width: '55'},
          {field:'vehicleName', displayName:'V.Name', width: '70'},
          {field:'pickupTime', displayName:'P.Time', width: '60'},
          {field:'pickupPlace', displayName:'P.Place', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'Origin', width: '50'},
          {field:'bookingStatusNm', displayName:'Status', width: '50'},
          {field:'vehicleCode', displayName:'VID', width: '100', cellTemplate : '<input ng-model="sModel" class="textFieldCompact" type="text" phone data-ng-enter="fnVehicleCodeAdded(row.entity,this);" ng-click="fnTest()" ng-show="(row.getProperty(\'vehicleId\') ? false : true )" /> <span>{{row.getProperty(\'vehicleCode\')}}</span>'}
        ];

        scope.bookingSelectedFn = function(booking, aVehTyp){

          // booking selected
          scope.autoRefreshBookingMgmt = false;
          scope.pollForBookingsAfter30Seconds();


          console.log('scope.bookingSelectedFn: ', booking);
          scope.selectedBookingDetails = booking;

          if(scope.tst) {
            scope.tst = false;
            return;
          }

          scope.bookingSelected = true;
          var bookingId = booking.bookingId;
          scope.selectedBookingId = bookingId;

          console.log('Selected booking details: ',booking);

          switch(parseInt(booking.bookingStatus)) {
            case PreConfigService.BOOKING_ENQUIRY:
            case PreConfigService.BOOKING_FOLLOW_UP:
            case PreConfigService.BOOKING_REJECTED:
            case PreConfigService.BOOKING_YET_TO_DISPATCH:
              if(!scope.vehicleViewDisplay) {
                scope.vehiclePanelToggle(true);          
              }
              scope.setVacantVehiclesGrid(true);
              // scope.setVehiclesForBookingGrid(false, bookingId, aVehTyp);
              scope.vacantVehicleSelected = false;
              scope.bookingVehicleSelected = false;

              scope.fnVehicleTypeTicked();

              scope.showVacantVehicleGrid = true;
              scope.showVehicleInfo = false;
              scope.showCloseVehicleInfoBtn = true;

            break;
            case PreConfigService.BOOKING_VEHICLE_ASSIGNED:            
            case PreConfigService.WHILE_DRIVING:
            case PreConfigService.BOOKING_COMPLETED_N_CLOSED:
            case PreConfigService.BOOKING_CANCELLED:

              scope.bookingVehicleSelectedFn({
                vehicleId : booking.vehicleId
              });

              scope.showVacantVehicleGrid = false;
              scope.showVehicleInfo = true;
              scope.showCloseVehicleInfoBtn = false;

            break;
          }

          scope.selectionFirstTab();

        };

        scope.bookingUnSelectedFn = function(){


          // booking unselected selected
          scope.autoRefreshBookingMgmt = true;

          if(scope.mainGridView != 'bMgmt'){
            console.log('>>>>> not in bMgmt');
            return;
          }

          scope.selectedBookingDetails = null;

          scope.bookingSelected = false;
          scope.setVehiclesForBookingGrid(true);          
          if(scope.vehicleViewDisplay) {
            scope.setVacantVehiclesGrid();
          }

          scope.showVacantVehicleGrid = true;
          scope.showVehicleInfo = false;
          scope.showCloseVehicleInfoBtn = true;

          scope.selectedBookingId = null;
          scope.selectionFirstTab();


        };

        scope.gridBookingsData = {
          data: 'bookingData',
          disableKeyEvents : true,
          columnDefs: 'bookingGridColDefs',
          filterOptions: {
            filterText: "",
            useExternalFilter: true
          },
          selectedItems: scope.selectedBookingItems,
          totalServerItems: 'bookingDataLength',
          pagingOptions: scope.bookingGridPgOptions,
          rowHeight: 24,
          footerRowHeight: 35,
          multiSelect: false,
          showFilter: false,
          showFooter: true,
          enableRowSelection: true,
          enablePaging: true,
          keepLastSelected: false,
          showColumnMenu: false,
          enableColumnResize: true,
          enableSorting: false,
          afterSelectionChange: function () {
            if(scope.selectedBookingItems.length) {              
              // uncheck all the vehicleType filteres
              for(var i=0,iC=scope.vTypes.length;i<iC;i++){
                scope.chbVtype[scope.vTypes[i].id] = (scope.selectedBookingItems[0].vehicleType == scope.vTypes[i].id ? true : false);
              }
              scope.bookingSelectedFn(scope.selectedBookingItems[0], [scope.selectedBookingItems[0].vehicleType])
            } else {
              scope.bookingUnSelectedFn();
            }
          }
        };

        scope.unselectBookingFn = function(){
          scope.gridBookingsData.selectAll(false)
        };

        /*END: Bookings Management Grid*/
        /*START: Vehicles for Booking Grid*/
        scope.vehiclesForBookingColDefs = [
          {field:'vehicleCode', displayName:'VID', width: '*'},
          {field:'vehicleName', displayName:'V.Name', width: '*'},
          {field:'location', displayName:'Location', width: '*'}
        ];

        scope.bookingVehicleSelectedFn = function(data){
          scope.bookingVehicleSelected = true;
          scope.setVehicleDetails(false, data.vehicleId);


          scope.showVehicleButtons = (scope.selectedBookingId) ? true : false;

          scope.resize_BookingVehiclesGrid();
        }
        scope.bookingVehicleUnSelectedFn = function(){
          scope.bookingVehicleSelected = false;
          scope.resize_BookingVehiclesGrid();
        };

        scope.gridForVehicleBookingsData = { 
          data: 'vehiclesForBookingData',
          columnDefs: 'vehiclesForBookingColDefs',
          selectedItems: scope.selectedBookingVehicleRecords,
          multiSelect: false,
          keepLastSelected: false,
          rowHeight: 24,
          showColumnMenu: true,
          enableColumnResize: true,
          enableSorting: false,
          afterSelectionChange: function () {
            if(scope.selectedBookingVehicleRecords.length)
              scope.bookingVehicleSelectedFn(scope.selectedBookingVehicleRecords[0]);
            else
              scope.bookingVehicleUnSelectedFn();
          }
        };
        scope.bookingVehicleDetailsPageCloseFn = function(){
          scope.bookingVehicleSelected = false;
          // scope.gridForVehicleBookingsData.selectAll(false);
          scope.vacantVehicleSelected = false;
          scope.showVehicleInfo = false;


          // scope.resize_vacantVehiclesGrid();

          scope.vacantVehicleUnSelectedFn();


        };
        /*END: Vehicles for Booking Grid*/

        /*START: While-driving vehicles Grid*/                
        scope.whileDrivingSearch = function (searchText) {
          var data, resultLabel;
          if (searchText&& searchText.length >=3) {
            var ft = searchText.toLowerCase();
            data = scope.whileDrivingData.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            scope.whileDrivingData = data;
          }else{
            scope.whileDrivingData = scope.whileDrivingDataObjs;
          }  
        };

        scope.whileDrivingVehicleSelectedFn = function(selected){
          var vehicleId = selected.vehicleId
            , bookingId = selected.bookingId;
          scope.selectedBookingId = bookingId;
          scope.whileDrivingVehicleSelected = true;
          // if(!scope.vehicleViewDisplay) {
          //   scope.vehiclePanelToggle(true);
          // }
          // scope.setVacantVehiclesGrid(true);

          scope.setVehicleDetails(false, vehicleId);
          scope.vehicleViewDisplay = true;

          scope.selectionFirstTab_WhileDriving();
          // scope.setWhileDrivingVehicleDetails(vehicleId);

          scope.resize_WhileDrivingVehiclesGrid();
        };
        scope.whileDrivingVehicleUnSelectedFn = function(){
          scope.whileDrivingVehicleSelected = false;
          scope.vehicleViewDisplay = false;

          scope.resize_WhileDrivingVehiclesGrid();
        };

        scope.vehiclesForWhileDrivingColDefs = [
          {field:'bookingCode', displayName:'B.No', width: '55'},
          {field:'vehicleCode', displayName:'VID', width: '50'},
          {field:'vehicleName', displayName:'V.Name', width: '70'},
          {field:'pickupTime', displayName:'P.Time', width: '60'},
          {field:'pickupPlace', displayName:'P.Place', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'expectedDropTime', displayName:'Vacant', width: '*'},
          {field:'dayCollection', displayName:'Collection', width: '*'},
          {field:'nextBooking', displayName:'Nxt Booking', width: '*'}
        ];

        scope.gridForWhileDrivingVehiclesData = {
          data: 'whileDrivingData',
          filterOptions: {
            filterText: "",
            useExternalFilter: true
          },
          enableSorting: false,
          enableColumnResize: true,
          enableColumnReordering: true,
          columnDefs: 'vehiclesForWhileDrivingColDefs',
          multiSelect: false,
          enableRowSelection: true,
          keepLastSelected: false,
          showColumnMenu: false,
          selectedItems: scope.selectedWhileDrivingVehicleRecords,
          afterSelectionChange: function () {
            if(scope.selectedWhileDrivingVehicleRecords.length)
              scope.whileDrivingVehicleSelectedFn(scope.selectedWhileDrivingVehicleRecords[0]);
            else
              scope.whileDrivingVehicleUnSelectedFn();
          }
        };
        /*END: While-driving vehicles Grid*/


        /*START: Booking info Grid*/        
        scope.bookingInfoSearch = function(){          
          $scope.getBookingInfoDataAsync(scope.bookingInfoGridPgOptions.pageSize,scope.bookingInfoGridPgOptions.currentPage, scope.bookingInfoFilterText);
        }
        
        scope.$watch('bookingInfoGridPgOptions', function () {
          $scope.getBookingInfoDataAsync($scope.bookingInfoGridPgOptions.pageSize,$scope.bookingInfoGridPgOptions.currentPage, $scope.bookingInfoFilterText);
        }, true);

        scope.getBookingInfoDataAsync = function (pageSize, page, searchText) {
          var data, resultLabel;
          if (searchText && searchText.length >=3) {
            var ft = searchText.toLowerCase();
            data = scope.bookingInfoData.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            $scope.setPagingDataForBookingInfoGrid(data,page,pageSize, true);
          }else{
            $scope.setPagingDataForBookingInfoGrid(scope.bookingInfoDataObjs,page,pageSize);
          }  
        };

        scope.setPagingDataForBookingInfoGrid = function(data, page, pageSize, setToFirstPage){
          if(data){
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            scope.bookingInfoData = pagedData;
            if(setToFirstPage)
              $scope.bookingInfoGridPgOptions.currentPage = 1;
          }
        };
        
        scope.bookingInfoGridPgOptions = {
          pageSizes: [20, 25, 30],
          pageSize: 20,
          currentPage: 1
        }

        scope.bookingInfoRecordSelectedFn = function(selected){
          var vehicleId = selected.vehicleId,
              bookingId = selected.bookingId;

            if(!vehicleId) {
              alert('Vehicle is not assigned to ' + selected.bookingCode);
              return;
            }
          scope.selectedBookingId = bookingId;
          scope.bookingInfoRecordSelected = true;
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);
          scope.setVacantVehiclesGrid(true);
          scope.selectionFirstTab_WhileDriving();
          //scope.setWhileDrivingVehicleDetails(vehicleId);
          scope.setVehicleDetails(false, vehicleId);
          scope.resize_BookingInfoGrid();
        }
        scope.bookingInfoRecordUnSelectedFn = function(){
          scope.bookingInfoRecordSelected = false;
          scope.vehiclePanelToggle(false);
          scope.resize_BookingInfoGrid();
        }

        scope.bookingInfoGridColDefs = [
          {field:'bookingCode', displayName:'Booking ID', width: '*'},
          {field:'attachmentTypeNm', displayName:'Att.Type', width: '*'},
          {field:'vehicleTypeNm', displayName:'V.Type', width: '*'},
          {field:'vehicleNameNm', displayName:'V.Name', width: '*'},
          {field:'pickupTime', displayName:'Pickup Time', width: '*'},
          {field:'pickupPlace', displayName:'Pickup Place', width: '*'},
          {field:'journeyType', displayName:'Journey', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'booked from', width: '*'},
          {field:'bookingStatusNm', displayName:'B.Status', width: '*'},
          {field:'vehicleStatusNm', displayName:'V.Status', width: '*'},
          {field:'vehicleCode', displayName:'VID', width: '*'}
        ];

        scope.gridBookingsInfoData = {
          data: 'bookingInfoData',
          multiSelect: false,
          filterOptions: {
            filterText: "",
            useExternalFilter: true
          },
          enableSorting: false,
          enableColumnResize: true,
          enableColumnReordering: true,
          enableRowSelection: true,
          keepLastSelected: false,
          enablePaging: true,
          totalServerItems: 'bookingInfoDataLength',
          pagingOptions: scope.bookingInfoGridPgOptions,
          rowHeight: 24,
          footerRowHeight: 35,
          showFooter: true,
          selectedItems: scope.selectedBookingInfoRecords,
          columnDefs: 'bookingInfoGridColDefs',
          afterSelectionChange: function () {
            if(scope.selectedBookingInfoRecords.length)
              scope.bookingInfoRecordSelectedFn(scope.selectedBookingInfoRecords[0]);
            else
              scope.bookingInfoRecordUnSelectedFn();
          }
        };
        /*END: Booking info Grid*/

        /*START: Booking info Grid*/        
        scope.autoLoginVehicleSearch = function(){          
          $scope.getAutoLoginVehicleDataAsync(scope.autoLoginVehiclesPgOptions.pageSize,scope.autoLoginVehiclesPgOptions.currentPage, scope.bookingInfoFilterText);
        }
        
        scope.$watch('autoLoginVehiclesPgOptions', function () {
          $scope.getAutoLoginVehicleDataAsync($scope.autoLoginVehiclesPgOptions.pageSize,$scope.autoLoginVehiclesPgOptions.currentPage, $scope.bookingInfoFilterText);
        }, true);

        scope.getAutoLoginVehicleDataAsync = function (pageSize, page, searchText) {
          var data, resultLabel;
          if (searchText && searchText.length >=3) {
            var ft = searchText.toLowerCase();
            data = scope.autoLoginVehiclesData.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            $scope.setPagingDataForAutoLoginVehiclesGrid(data,page,pageSize, true);
          }else{
            $scope.setPagingDataForAutoLoginVehiclesGrid(scope.autoLoginVehiclesObjs,page,pageSize);
          }  
        };

        scope.setPagingDataForAutoLoginVehiclesGrid = function(data, page, pageSize, setToFirstPage){
          if(data){
            var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
            scope.autoLoginVehiclesData = pagedData;
            if(setToFirstPage)
              $scope.autoLoginVehiclesPgOptions.currentPage = 1;
          }
        };
        
        scope.autoLoginVehiclesPgOptions = {
          pageSizes: [20, 25, 30],
          pageSize: 20,
          currentPage: 1
        }

        scope.autoLoginVehiclesRecordSelectedFn = function(selected){
          
        }
        scope.autoLoginVehiclesRecordUnSelectedFn = function(){
          scope.bookingInfoRecordSelected = false;
          scope.vehiclePanelToggle(false);
          scope.resize_AutoLoginVehiclesGrid();
        }

        scope.autoLoginVehiclesGridColDefs = [
          {field:'vehicleCode', displayName:'VID', width: '*'},
          {field:'vehicleTypeNm', displayName:'V.Type', width: '*'},
          {field:'vehicleNameNm', displayName:'V.Name', width: '*'},
          {field:'attachmentType', displayName:'Att.Type', width: '*'},
          {field:'mobileNumber', displayName:'Mobile', width: '*'},
          {field:'vehicleStatusNm', displayName:'Status', width: '*'},
          {field:'loginTime', displayName:'Login Tm.', width: '*'},
          {field:'location', displayName:'Location', width: '*'},
          {field:'dayCollection', displayName:'Day Col.', width: '*'},
          {field:'inBreak', displayName:'In Break', width: '*'},
          {field:'breakTime', displayName:'Break Tm.', width: '*'},
        ];

        scope.gridAutoLoginVehiclesData = {
          data: 'autoLoginVehiclesData',
          multiSelect: false,
          filterOptions: {
            filterText: "",
            useExternalFilter: true
          },
          enableSorting: false,
          enableColumnResize: true,
          enableColumnReordering: true,
          enableRowSelection: true,
          keepLastSelected: false,
          enablePaging: true,
          totalServerItems: 'autoLoginVehiclesLength',
          pagingOptions: scope.autoLoginVehiclesPgOptions,
          rowHeight: 24,
          footerRowHeight: 35,
          showFooter: true,
          selectedItems: scope.selectedAutoLoginVehiclesRecords,
          columnDefs: 'autoLoginVehiclesGridColDefs',
          afterSelectionChange: function () {
            if(scope.selectedAutoLoginVehiclesRecords.length)
              scope.autoLoginVehiclesRecordSelectedFn(scope.selectedAutoLoginVehiclesRecords[0]);
            else
              scope.autoLoginVehiclesRecordUnSelectedFn();
          }
        };
        /*END: Booking info Grid*/

        /*START: Vacant vehicles Grid*/
        scope.fnVacantVehicleSearch = function(){          
          $scope.fnGetVacantVehicleDataAsync(scope.vacantVehicleFilterText);
        }
        scope.fnGetVacantVehicleDataAsync = function (searchText) {
          var data, resultLabel;
          if(searchText){
            var ft = searchText.toLowerCase();
            data = scope.vacantVehiclesData.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            scope.vacantVehiclesData = angular.copy(data);
          } else {
            scope.vacantVehiclesData = angular.copy(scope.vacantVehiclesDataObjs);
          }
        };
        scope.fnGetAllVehicleTypeIds = function() {
          var x = [];
          for(var i=0;i<scope.vTypes.length;i++){
            if(scope.vTypes[i].id == '0'){
              continue;
            }
            x.push(scope.vTypes[i].id);
          }
          return x;
        };
        scope.fnLoadVacantVehiclesGridData = function(aSelectedVehicleTypes) {
          // function which gets called when tickbox is changed.. 
          scope.setVacantVehiclesGrid(true);


          var oVty = {};

          if(aSelectedVehicleTypes.length == 1 && aSelectedVehicleTypes[0] != '0'){
            oVty = scope.fnGetVehicleTypeAndName(aSelectedVehicleTypes[0]);
            scope.bdSearch.vName = oVty.vName;
          } else if((aSelectedVehicleTypes.length == 1 && aSelectedVehicleTypes[0] == '0')
            || aSelectedVehicleTypes.length == 0){
            // pass all the vehicle types
            aSelectedVehicleTypes = [];
            aSelectedVehicleTypes = scope.fnGetAllVehicleTypeIds();

          }

          var oData = {
              'vehicleStatus' :[2,3],
              'attachmentType' : scope.bdSearch.attType,
              'collection' : scope.bdSearch.collection,
              'projectedHours' : scope.bdSearch.projHrs,
              'vehicleCondtion' : scope.bdSearch.vCondtion,
              'modelMonth' : scope.bdSearch.vModMonth || '',
              'modelYear' : scope.bdSearch.vModYear || '',
              'vehicleName' : ((aSelectedVehicleTypes.length >= 2 || aSelectedVehicleTypes[0] == '0') ? '' : scope.bdSearch.vName),
              'vehicleType' : aSelectedVehicleTypes
            };
            
            serverService.sendData('P','dispatcher/getAllVehicles',oData, scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
        };
        scope.vacantVehiclesColDefs = [
          {field:'vehicleCode', displayName:'VID', width: '*'},            
          {field:'vacantTime', displayName:'VacantTm', width: '*'},            
          {field:'vehicleName', displayName:'V.Name', width: '*'},
          {field:'loginTime', displayName:'L.Hrs', width: '*'},
          {field:'location', displayName:'Location', width: '*'},
          {field:'inBreak', displayName:'Break?', width: '*'},
          {field:'dayCollection', displayName:'Collection', width: '*'}
        ];

        scope.vacantVehicleSelectedFn = function(selected){
          scope.showVehicleInfo = true;
          scope.showCloseVehicleInfoBtn = true;

          scope.vacantVehicleSelected = true;
          scope.setVehicleDetails(false, selected.vehicleId);

          scope.showVehicleButtons = (scope.selectedBookingId) ? true : false;

          scope.resize_vacantVehiclesGrid();

        }
        scope.vacantVehicleUnSelectedFn = function(){
          console.log(scope.selectedVacantVehicleRecords);
          
          console.log('in vacantVehicleUnSelectedFn');
          scope.vacantVehicleSelected = false;

          scope.resize_vacantVehiclesGrid();
        }
        scope.gridForVacantVehiclesData = { 
          data: 'vacantVehiclesData',
          columnDefs: 'vacantVehiclesColDefs',
          selectedItems: scope.selectedVacantVehicleRecords,
          rowHeight: 24,
          enableColumnResize: true,
          multiSelect: false,
          enableRowSelection: true,
          keepLastSelected: false,
          showColumnMenu: false,          
          enableSorting: false,
          afterSelectionChange: function () {            
            if(scope.selectedVacantVehicleRecords.length)
              scope.vacantVehicleSelectedFn(scope.selectedVacantVehicleRecords[0]);
            else
              scope.vacantVehicleUnSelectedFn();
          }
        };
        scope.vehicleDetailsPageCloseFn = function(){
          scope.vacantVehicleSelected = false;
          scope.resize_vacantVehiclesGrid();
        }      

        scope.fnHideVacantInfoPanel = function(){
          scope.vacantVehicleSelected = false;
          scope.gridForVacantVehiclesData.selectAll(false);
          scope.resize_vacantVehiclesGrid();
        }  
        /*END: Vacant vehicles Grid*/

    /*END: Grid related functionality*/

        /*START: Panel handling functionality*/
        scope.infoPanelToggle = function(){
          scope.informationViewDisplay = !(scope.informationViewDisplay);
          scope.resize_BookingMgmtGrid();
        };
        scope.vehiclePanelToggle = function(doOpen){
          if(doOpen && doOpen === true){
            scope.vehicleViewDisplay = true;           
          }
          else{
            scope.vehicleViewDisplay = false;
          }
          scope.resize_MainGridView();
        };
        scope.$watch('informationViewDisplay', function(newValue, oldValue){
          if(newValue == false && scope.vehicleViewDisplay == false)
            scope.infoVehicleCombiDisplay = false;
          else
            scope.infoVehicleCombiDisplay = true;
        });
        scope.$watch('vehicleViewDisplay', function(newValue, oldValue){
          if(newValue == false && scope.informationViewDisplay == false)
            scope.infoVehicleCombiDisplay = false;
          else
            scope.infoVehicleCombiDisplay = true;
        });
        /*START: Handle While-driving and bookings hide-show*/
        scope.handleShortPanelClick = function(opt){
          scope.mainGridView = opt;
          hide_reset_AllMainGridViews();
          if(opt == 'bMgmt'){
            scope.showBookingsList();
          }else if(opt == 'vInfo'){
            scope.showWhileDriving();
          }else if(opt == 'bInfo'){
            scope.showBookingInfo();
          }else if(opt == 'autoLog'){
            scope.showAutoLoginVehicles();
          }
        }
        var hide_reset_AllMainGridViews = function(){
          scope.showingBookingsGrid = false;
          scope.showingWhilDrivingGrid = false;
          scope.showingBookingsInfoGrid = false;
          scope.showingAutoLoginVehicleGrid = false;

          scope.setBookingMgmtGrid(true);
          scope.setWhileDrivingVehiclesGrid(true);
          scope.setBookingInfoGrid(true);
          scope.setAutoLoginVehicleGrid(true);

          scope.gridBookingsData.selectAll(false)
        }
        scope.resize_MainGridView = function(){
          if(scope.showingBookingsGrid === true){
            scope.resize_BookingMgmtGrid();
          }
          if(scope.showingWhilDrivingGrid === true){
            scope.resize_WhileDrivingVehiclesGrid();
          }
        }

        scope.showWhileDriving = function(){          
          scope.showingWhilDrivingGrid = true;
          scope.setWhileDrivingVehiclesGrid();
          //scope.vehiclePanelToggle(true)          
          scope.vehicleViewDisplay = false;
        }                    
        scope.showBookingsList = function(){
          scope.showingBookingsGrid = true;          
          scope.setBookingMgmtGrid();
          scope.vehiclePanelToggle(true);          
        }        
        scope.showBookingInfo = function(){
          scope.vehiclePanelToggle(false);
          scope.showingBookingsInfoGrid = true;          
          scope.setBookingInfoGrid();          
        }     
        scope.showAutoLoginVehicles = function(){
          scope.vehiclePanelToggle(false);
          scope.showingAutoLoginVehicleGrid = true;          
          // scope.setAutoLoginVehicleGrid();          
        }     
        /*END: Handle While-driving and bookings hide-show*/
        
      /*END: Panel handling functionality*/

        /*START: Accordion related functionality*/
        scope.oneAtATime = true;
        /*END: Accordion related functionality*/
        
        /*START: Accept / Confirm / Reject functionality */
        // In vehicle state = 2
        scope.fnControlViewVehicleReserveBooking = function(sVId, sBId) {
          var oData = {
            "vehicleCode": sVId,  // vehicleCode
            "bookingId": sBId     // actualBookingID
          };

          serverService.sendData('P',
            'dispatcher/resVehicleToBooking',
            oData,
            scope.vehicleStateChange_Success,
            scope.vehicleStateChange_Error);
        };
        scope.fnControlViewVehicleAccepBooking = function() {

          console.log(':::::scope.fnControlViewVehicleAccepBooking', scope.vehicleDetailsData, scope.selectedBookingDetails);

          // var oData = {
          //   "vehicleId": scope.vehicleDetailsData.vehicle.id,
          //   "bookingId": scope.selectedBookingItems[0].bookingId
          // };

          // serverService.sendData('P',
          //   'dispatcher/acceptBooking',
          //   oData,
          //   scope.vehicleStateChange_Success,
          //   scope.vehicleStateChange_Error);


          var oData = {
            "vehicleId": scope.vehicleDetailsData.vehicle.id,   // actualVehicleID
            "driverId": scope.vehicleDetailsData.driver.id,
            "bookingId": scope.selectedBookingDetails.bookingId  // actualBookingID
          };

          serverService.sendData('P',
            'dispatcher/confirmVehicleToBooking',
            oData, 
            scope.vehicleStateChange_Success, 
            scope.vehicleStateChange_Error);
          };
        // In vehicle state = 4
        scope.fnControlViewVehicleConfirm = function() {
          var oData = {
            "vehicleId": scope.vehicleDetailsData.vehicle.id, // actual VehicleID
            "driverId": scope.vehicleDetailsData.driver.id,
            "bookingId": scope.selectedBookingItems[0].bookingId  // acutal BookingID
          };
          serverService.sendData('P',
            'dispatcher/confirmVehicleToBooking',
            oData,
            scope.vehicleStateChange_Success,
            scope.vehicleStateChange_Error);
        }
        scope.vehicleStateChange_Success = function(data){
          console.log('scope.vehicleStateChange_Success', data);
          scope.fnResetVehicleDetailsPanel();
          alert(data[0].message);
          scope.setBookingMgmtGrid(false);
          scope.bookingVehicleUnSelectedFn();
          scope.vacantVehicleUnSelectedFn();

          scope.setVacantVehiclesGrid();
        }
        scope.vehicleStateChange_Error = function(xhr, data){
          console.error('in vehicleStateChange_Error :: api error', data);
          alert('Error in processing your request');
        }

        scope.fnControlViewVehicleRejectBooking = function() {
            var bookingId = scope.selectedBookingItems[0].bookingId || '';
            if (bookingId === '') {
                alert('Booking Id is required');
                return;
            }
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingRejected'),
                controller: 'vehicleBookingRejected',
                dialogClass: 'modalClass add-request',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: {
                              details : {
                                "bookingId": bookingId
                              },
                              "id": scope.vehicleDetailsData.vehicle.id,
                              "selectedDriver": scope.vehicleDetailsData.driver.id || ''
                            }
                        };
                        return oData;
                    },
                    isControlView: function() {
                      return true;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnControlViewVehicleCancel = function() {
          var bookingId = scope.selectedBookingItems[0].bookingId || '';
          if (bookingId === '') {
              alert('Booking Id is required');
              return;
          }
          $scope.opts = {
              templateUrl: URLService.view('vehicleBookingCancel'),
              controller: 'vehicleBookingCancel',
              dialogClass: 'modalClass cancel-booking-container',
              resolve: {
                  editMode: [

                      function() {
                          return false;
                      }
                  ],
                  oVehicleData: function() {
                      var oData = {
                          vehicleMainDetails: {
                            details : {
                              "bookingId": bookingId
                            },
                            "vehicleId": scope.vehicleDetailsData.vehicle.id,
                            "selectedDriver": scope.vehicleDetailsData.driver.id || ''
                          }
                      };
                      return oData;
                  },
                  isControlView: function() {
                    return true;
                  }
              }
          };
          modalWindow.addDataToModal($scope.opts);
        };
        /*END: Accept / Confirm / Reject functionality */

        // Tab Navigation
        scope.showControlViewTab = function(){
            scope.showTariffDetails =  false;
            scope.showBookingHistoryDetails =  false;
            scope.showBookingDetails =  false;
            scope.showDispatchView =  false;
            scope.showControlViewDetails =  true;
            window.location.hash = "#/controlView";

            //scope.fnResizeWindowHack();
        };
        scope.showDispatchViewTab = function(){
            scope.showTariffDetails =  false;
            scope.showBookingHistoryDetails =  false;
            scope.showBookingDetails =  false;
            scope.showControlViewDetails =  false;
            scope.showDispatchView =  true;
            window.location.hash = "#/dispatch";

            //scope.fnResizeWindowHack();
        };
        scope.showBookingDetailsTab = function(){
            scope.showTariffDetails =  false;
            scope.showBookingHistoryDetails =  false;
            scope.showBookingDetails =  true;
            scope.showDispatchView =  false;
            scope.showControlViewDetails =  false;
            window.location.hash = "#/";

            //scope.fnResizeWindowHack();
        };

        // vehicle filter
        scope.fnVehicleTypeTicked = function() {
            // scope.setVehiclesForBookingGrid(true);
            var aSelVt = [];
            // uncheck all the vehicleType filteres

            for(var i=0,iC=scope.vTypes.length;i<iC;i++){
              if(scope.chbVtype[scope.vTypes[i].id]){
                aSelVt.push(scope.vTypes[i].id);
              }
            }

            console.log('fnVehicleTypeTicked', aSelVt);
            scope.fnLoadVacantVehiclesGridData(aSelVt);
        };

        // vehicle / booking related button handlers
        scope.fnVehicleBookingClose = function() {
          console.log(scope.selectedBookingId);
          serverService.sendData('P','dispatcher/getBookingQuickInfo',{'bookingId':scope.selectedBookingId},scope.getBookingDetails_Success, scope.getBookingDetails_Error);
        };

        scope.getBookingDetails_Success = function(data){
          console.log(scope.mainGridView);
          var oTmpJt;
          scope.FormatNloadBookingDetailsData(data);
          console.log(scope.vehicleDetailsData);
          console.log(scope.bookingDetailsData);

          oTmpJt = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(scope.bookingDetailsData.booking.subJourneyType);
          $scope.opts = {
                templateUrl: URLService.view('vehicleBookingClose'),
                controller: 'vehicleBookingClose',
                dialogClass: 'modalClass booking-close-modal',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: {
                              id: scope.vehicleDetailsData.vehicle.id,
                              selectedDriver: scope.vehicleDetailsData.driver.id,
                              tempSelectedJourneyTypeId: oTmpJt.id,
                              vehicleType: scope.vehicleDetailsData.vehicle.vehicleTypeId,
                              details: {
                                bookingId: scope.bookingDetailsData.booking.id,
                                customerId: scope.bookingDetailsData.customer.customerCode,
                                tariffId: scope.bookingDetailsData.booking.tariffId,
                                dropPlace: scope.bookingDetailsData.booking.dropPlace,
                                category: scope.bookingDetailsData.customer.category,
                                grade: scope.bookingDetailsData.customer.grade,
                                startKms: scope.vehicleDetailsData.vehicle.currentKms,
                                pickupDate: scope.bookingDetailsData.booking.pickupDate,
                                displayPickupDate: PrerequisiteService.fnFormatDate(scope.bookingDetailsData.booking.pickupDate),
                                pickupTime: scope.bookingDetailsData.booking.pickupTime,
                                subJourneyType: scope.bookingDetailsData.booking.subJourneyType
                              }
                            }
                        };
                        return oData;
                    },
                    isControlView: function() {
                      return true;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        }
        scope.getBookingDetails_Error = function(xhr, data){
          //do some error processing..
        }

        // Roadside booking - navigate to booking
        scope.fnRoadSideBooking = function() {
            window.location.hash = "#/";
        }

        // Call customer - navigate to booking with mobile no.
        scope.fnBookingCallCustomer = function() {
          var phoneNo = scope.bookingDetailsData.bookingCallCustomerNo;

          console.log(phoneNo);
          if(phoneNo && phoneNo.length === 10 && !isNaN(phoneNo)) {
            window.location.hash = '#/booking?mobile=' + scope.bookingDetailsData.bookingCallCustomerNo;
          } else {
            alert('Invalid phone no.');
          }
        }

        // Call driver - navigate to dispatch with mobile no.
        scope.fnBookingCallDriver = function() {
          var phoneNo = scope.bookingDetailsData.bookingCallDriverNo;

          console.log(phoneNo);
          if(phoneNo && phoneNo.length === 10 && !isNaN(phoneNo)) {
            window.location.hash = '#/dispatch?mobile=' + scope.bookingDetailsData.bookingCallDriverNo;
          } else {
            alert('Invalid phone no.');
          }
        }
        scope.fnDispatchCallDriver = function() {
          var phoneNo = scope.vehicleDetailsData.dispatchCallDriverNo;

          console.log(phoneNo);
          if(phoneNo && phoneNo.length === 10 && !isNaN(phoneNo)) {
            window.location.hash = '#/dispatch?mobile=' + scope.vehicleDetailsData.dispatchCallDriverNo;
          } else {
            alert('Invalid phone no.');
          }
        }

        scope.fnVehicleBookingStart = function() {
          console.log(scope.selectedBookingDetails);
          console.log(scope.vehicleDetailsData);
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingStart'),
                controller: 'vehicleBookingStart',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: {
                              id: scope.vehicleDetailsData.vehicle.id,
                              selectedDriver: scope.vehicleDetailsData.driver.id,
                              details: {
                                // need to change once proviced from api
                                nextBooking: scope.vehicleDetailsData.vehicle.nextBooking || 1,
                                previousKms: scope.vehicleDetailsData.vehicle.currentKms,
                                bookingId: scope.selectedBookingDetails.bookingId,
                                pickupDate: scope.selectedBookingDetails.pickupDate,
                                displayPickupDate: PrerequisiteService.fnFormatDate(scope.selectedBookingDetails.pickupDate),
                                pickupTime: scope.selectedBookingDetails.pickupTime
                              }
                            }
                        };
                        return oData;
                    },
                    isControlView: function() {
                      return true;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnChangeVehPickupLocation = function() {
          console.log(scope.selectedBookingDetails);
          console.log(scope.vehicleDetailsData);
            $scope.opts = {
                templateUrl: URLService.view('changeVehPickupLocation'),
                controller: 'changeVehPickupLocation',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: {
                              id: scope.vehicleDetailsData.vehicle.id,
                              selectedDriver: scope.vehicleDetailsData.driver.id,
                              location: '....', // change it once api chage is done
                              details: {
                                bookingId: scope.selectedBookingDetails.bookingId
                              }
                            }
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return true;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        // handling custom events
        var oEventUpdateControlViewGrid = $rootScope.$on('eventUpdateControlViewGrid', function(oEvent, oData) {
            console.log('>>>>>scope.eventUpdateControlViewGrid changed', arguments);
            console.log('scope.mainGridView: ' + scope.mainGridView);
            switch(scope.mainGridView) {
              case 'bMgmt': scope.setBookingMgmtGrid(false);
                            scope.bookingVehicleUnSelectedFn();
                            scope.vacantVehicleUnSelectedFn();
                            scope.fnResetVehicleDetailsPanel();
                            scope.fnLoadBookingStatusWise(['4']);
                            break; 
              case 'vInfo': scope.whileDrivingVehicleSelected = false;
                            scope.vehicleViewDisplay = false;
                            scope.resize_WhileDrivingVehiclesGrid();
                            scope.fnSearchWhileDrivingVehicleInfo();
                            break; 
              case 'bInfo': scope.bookingInfoRecordSelected = false;
                            scope.vehiclePanelToggle(false);
                            scope.resize_BookingInfoGrid();
                            scope.setBookingInfoGrid(false);
                            break; 
              case 'autoLog': scope.bookingInfoRecordSelected = false;
                              scope.vehiclePanelToggle(false);
                              scope.resize_AutoLoginVehiclesGrid();
                              scope.fnSearchAutoLoginVehicleGrid(false);
                              break; 
            }
        });

        scope.$on('$destroy', function() {
            console.log('destroying eldContainer relative');
            oEventUpdateControlViewGrid();
        });
    });