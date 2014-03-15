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
          /*END: setting initial views to display*/

          /*START: setting initial data*/
          var POLLING_INTERVAL = 10000;
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


        scope.fnInitializeVars = function() {
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

          scope.vAttTypes = angular.copy(PrerequisiteService.fnGetAttachmentTypes());
          scope.vConditions = angular.copy(PrerequisiteService.fnGetVehicleConditionTypes());
          scope.vModYear = angular.copy(PrerequisiteService.fnGetVehicleManufacturingYears());
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
          scope.oMonths['00'] = 'select';

          scope.projHrs = [];
          for(var i=12;i<=24;i+=2) {
            scope.projHrs.push({
              'txt' : i.toString(),
              'val' : i.toString()
            });
          }
          scope.collections = [];
          for(var i=500;i<=2000;i+=500) {
            scope.collections.push({
              'txt' : i.toString(),
              'val' : i.toString()
            });
          }

          scope.bdSearch = {
            bookingStatus : PreConfigService.BOOKING_YET_TO_DISPATCH,  // default to yet to dispatch
            vehicle : scope.oVehicleDefault,
            nxtHrs: '1',
            projHrs : '12',
            collection: '500',
            vModMonth : '00',
            vModYear : '',
            attType : '',
            vCondtion : ''
          };

          scope.viSearch = {
            collection : '',
            projHrs  : '',
            vStatus  : '',
            vCondtion  : '',
            vehicle : scope.oVehicleDefault,
            attType :  ''
          };
          scope.biSearch = {
            bookingInfoDate : scope.bookingInfoDate,
            vehicle : scope.oVehicleDefault,
            journey : '',
            sjFrom : '',
            sjTo :  '',
            zone : '',
            area : '',
            searchByType : '',
            searchByText: ''
          };
          scope.alSearch = {
            vehicle : scope.oVehicleDefault,
            zone : '',
            area : '',
            fromTime : '',
            toTime: ''
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
        var pollForBookings = function(){
          $timeout(scope.setBookingMgmtGrid, POLLING_INTERVAL);
        }
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
          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.bookingId = datum.bookingId;
            datum.vehicleName = (datum.vehicleName) ? formatSource.fnGetVehicleDisplayNameById(datum.vehicleName) : '';
            datum.bookingStatus = formatSource.fnGetBookingStatusName(datum.bookingStatus);
            var sJourneyTypeId = datum.subJourneyType;
            datum.subJourneyType = (datum.subJourneyType) ? formatSource.fnGetJourneyTypeName(datum.subJourneyType) : '';
            datum.pickupTime = formatSource.fnFormatHours(datum.pickupTime) + ':' + formatSource.fnFormatMinutes(datum.pickupTime);
          }
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
              "id": data.vehicle.id || '',
              "vehicleCode": data.vehicle.vehicleCode || '',
              "registrationNumber": data.vehicle.registrationNumber || '',
              "vehicleNameId": data.vehicle.vehicleName || '',
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
          if (data.customer) {
            oData.customer = {
              "customerCode": data.customer.customerCode || '',
              "tripCount": data.customer.tripCount || 0,
              "name": data.customer.name || '',
              "mobile": data.customer.mobile || [],
              "grade": data.customer.grade || '',
              "category": data.customer.category || ''
            };
          } else {
            oData.customer = {};
          }
          // booking details
          if (data.booking) {
            oData.booking = {
              "bookingCode": data.booking.bookingCode || '',
              "pickupDate": data.booking.pickupDate || '',
              "pickupTime": data.booking.pickupTime || '',
              "pickupPlace": data.booking.pickupPlace || '',
              "dropPlace": data.booking.dropPlace || '',
              "journeyType": data.booking.journeyType || 0,
              "journeyTypeText": PrerequisiteService.fnGetJourneyObjectById(data.booking.journeyType).journeyType || '',
              "subJourneyType": data.booking.subJourneyType || 0,
              "subJourneyTypeText": PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(data.booking.subJourneyType).journeyType || 0,
              "landmark1": data.booking.landmark1 || '',
              "landmark2": data.booking.landmark2 || '',
              "tariffId": data.booking.tariffId || 0,
              "tariffText": PrerequisiteService.fnGetTariffById(data.booking.tariffId).text || ''
            };
          } else {
            oData.booking = {};
          }
          // vehicle details
          if (data.vehicle) {
            oData.vehicle = {
              "vehicleCode": data.vehicle.vehicleCode || '',
              "registrationNumber": data.vehicle.registrationNumber || '',
              "vehicleNameId": data.vehicle.vehicleName || '',
              "vehicleName": PrerequisiteService.fnGetVehicleDisplayNameById(data.vehicle.vehicleName) || '',
              "vehicleTypeId": data.vehicle.vehicleType || '',
              "vehicleType": PrerequisiteService.fnGetVehicleDisplayTypeById(data.vehicle.vehicleType) || '',
              "registeredMobile": data.vehicle.registeredMobile || '',
              "previousLocation": data.vehicle.previousLocation || ''
            };
          } else {
            oData.vehicle = {};
          }
          // driver details
          if (data.driver) {
            oData.driver = {
              "driverCode": data.driver.driverCode || '',
              "name": data.driver.name || '',
              "mobile": data.driver.mobile || ''
            };
          } else {
            oData.driver = {};
          }
          // employee details
          if (data.employee) {
            oData.employee = {
              "callTakenBy": data.employee.callTakenBy || '',
              "callDispatchedBy": data.employee.callDispatchedBy || '',
              "startReportTakenBy": data.employee.startReportTakenBy || '',
              "closeReportTakenBy": data.employee.closeReportTakenBy || '',
              "modifiedBy": data.employee.modifiedBy || '',
              "cancelledBy": data.employee.cancelledBy || ''
            };
          } else {
            oData.employee = {};
          }

          scope.loadBookingDetailsData(oData);
        }
        /*END: Formatter methods*/

        /*START: Loader methods*/
        scope.loadBookingMgmtGridData = function(data){
          var data = data;
          scope.bookingData = data;
          scope.bookingDataObjs = angular.copy(data);
          scope.bookingDataLength = data.length;
          scope.resize_BookingMgmtGrid();
        }

        scope.loadVacantVehiclesGridData = function(data){
          scope.vacantVehiclesData = data;
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
        }
        scope.loadBookingDetailsData = function(data){          
          scope.bookingDetailsData = data;
        }
        /*END: Loader methods*/
    /*END: Loading methods for the grids*/

    /*START: Loading initial grids*/
        /*START: setting the booking management grid*/
        // fn to load booking status wise bookings
        scope.fnLoadBookingStatusWise = function(aStatus) {
          scope.bdSearch.bookingStatus = aStatus;
          scope.setBookingMgmtGrid();
        };
        scope.setBookingMgmtGrid = function(doEmptyGrid){
          var oData = {};
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingMgmtGridData([]);
          else{

            // take the search filters for booking Grid load

            var oVty = scope.fnGetVehicleTypeAndName(scope.bdSearch.vehicle);
            scope.bdSearch.vName = oVty.vName;
            scope.bdSearch.vType = oVty.vType;

            console.log('bdSearch Filters', scope.bdSearch);

            oData = {
              "bookingStatus" : scope.bdSearch.bookingStatus, // send as an array.
              'attachmentType' : scope.bdSearch.attType,
              'collection' : scope.bdSearch.collection,
              'nextHours' : scope.bdSearch.nxtHrs,
              'projectedHours' : scope.bdSearch.projHrs,
              'vehicleCondtion' : scope.bdSearch.vCondtion,
              'modelMonth' : scope.bdSearch.vModMonth,
              'modelYear' : scope.bdSearch.vModYear,
              'vehicleName' : scope.bdSearch.vName,
              'vehicleType' : scope.bdSearch.vType,
            };

            serverService.sendData('P','dispatcher/getAllBookings', oData, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
          }
        }        
        scope.setBookingMgmtGrid_Success = function(data){
          scope.FormatNloadBookingMgmtGridData(data);
          //pollForBookings();
        }
        scope.setBookingMgmtGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the booking management grid*/
        
        /*START: setting the vacant vehicles grid*/
        scope.fnSearchVehicleInfo = function(){
          scope.setVacantVehiclesGrid();
        };
        scope.setVacantVehiclesGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true) {
            scope.loadVacantVehiclesGridData([]);
          } else {

            
            var oVty = scope.fnGetVehicleTypeAndName(scope.viSearch.vehicle);
            scope.viSearch.vName = oVty.vName;
            scope.viSearch.vType = oVty.vType;
            console.log('viSearch', scope.viSearch);
            
            var oData = {
              vehicleStatus :[2,3],
              attachmentType : scope.viSearch.attType,
              condition :  scope.viSearch.vCondtion,
              vehicleType :  scope.viSearch.vType,
              vehicleName :  scope.viSearch.vName,
              projectedHrs :  scope.viSearch.projHrs,
              dayCollection :  scope.viSearch.vCondtion
            };

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
        scope.setWhileDrivingVehiclesGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadWhileDrivingVehiclesGridData([]);
          else{
            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getWhileDrivingVehicles', {}, scope.setWhileDrivingVehiclesGrid_Success, scope.setWhileDrivingVehiclesGrid_Error);
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
              "pickupDate" : scope.biSearch.bookingInfoDate,
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
          scope.loadBookingInfoGridData(data);
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
              "attachmentType" : "",
              "vehicleType" : scope.alSearch.vType,
              "vehicleName" : scope.alSearch.vName,
              "projectedHrs" : "",
              "zone" : scope.alSearch.zone,
              "area" : scope.alSearch.area,
              "expLoginFrom" : scope.alSearch.fromTime,
              "expLoginTo" : scope.alSearch.toTime
            };

            console.log('alSearch', scope.alSearch);

            //Need to trigger the server call from here
            serverService.sendData('P','dispatcher/getAutoLoginVehicles', oData, scope.setAutoLoginVehicleGrid_Success, scope.setAutoLoginVehicleGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
          }
        }        
        scope.setAutoLoginVehicleGrid_Success = function(data){
          scope.loadAutoLoginVehicleGridData(data);
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
              "label": 'Booking Details'
            , "tooltip": 'Detailed booking info'
            , "id": 0
            , "splitTabId": "splitBookingInfo"
            , "selected": false
            , "template": "views/dispatches/bookingDetailedInfoSplitView.html"
            , "callback": 'bookingTabClicked'
          },
          {
             "label": 'Vehicle Details'
            , "tooltip": 'Selected Vehicle\'s details'
            , "id": 1
            , "splitTabId": "splitVehicleDetails"
            , "selected": false
            , "template": "views/dispatches/vehicleDetailedInfoSplitView.html"
            , "callback": 'vehicleDetailsTabClicked'
          }
        ];

        scope.previousSelectedTab = null;        
        scope.currentlyClickedTab = null;

        var selectionFirstTab = function(){
          scope.tabs[0].selected = true;
          scope.splitCurrentTab = scope.tabs[0].template;
          scope.currentSelectedTab = scope.tabs[0].id;
        }
        var selectionFirstTab_WhileDriving = function(){
          scope.tabs_whileDriving[1].selected = true;
          scope.splitCurrentTab = scope.tabs_whileDriving[1].template;
          scope.currentSelectedTab = scope.tabs_whileDriving[1].id;
        }

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
          if (searchText && searchText.length >=3) {
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
            scope.fnControlViewVehicleAccepBooking(oField.sModel, oRow.bookingId);
          }
          oField.sModel = '';
        };

        scope.fnTest = function(){
            scope.gridBookingsData.selectAll(false);
            scope.tst  = true;
            $timeout(function(){
                      // scope.bookingUnSelectedFn();     
            }, 10);
           
        }

        scope.bookingGridColDefs = [
          {field:'bookingCode', displayName:'B.No', width: '55'},
          {field:'vehicleName', displayName:'V.Name', width: '70'},
          {field:'pickupTime', displayName:'P.Time', width: '60'},
          {field:'pickupPlace', displayName:'P.Place', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'Origin', width: '50'},
          {field:'bookingStatus', displayName:'Status', width: '50'},
          {field:'vehicleCode', displayName:'VID', width: '100', cellTemplate : '<input ng-model="sModel" class="textFieldCompact" type="text" phone data-ng-enter="fnVehicleCodeAdded(row.entity,this);" ng-click="fnTest()" />'}
        ];

        scope.bookingSelectedFn = function(booking, aVehTyp){
          if(scope.tst) {
            scope.tst = false;
            return;
          }
          scope.bookingSelected = true;
          var bookingId = booking.bookingId;
          scope.selectedBookingId = bookingId;
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);          
          scope.setVacantVehiclesGrid(true);
          scope.setVehiclesForBookingGrid(false, bookingId, aVehTyp);
          scope.vacantVehicleSelected = false;
          scope.bookingVehicleSelected = false;
          selectionFirstTab();
        }

        scope.bookingUnSelectedFn = function(){
          scope.bookingSelected = false;
          scope.setVehiclesForBookingGrid(true);          
          if(scope.vehicleViewDisplay)
            scope.setVacantVehiclesGrid();
        }

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
        }

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
          scope.resize_BookingVehiclesGrid();
        }
        scope.bookingVehicleUnSelectedFn = function(){
          scope.bookingVehicleSelected = false;
          scope.resize_BookingVehiclesGrid();
        }

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
          scope.gridForVehicleBookingsData.selectAll(false);
          scope.resize_BookingVehiclesGrid();
        }
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
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);
          scope.setVacantVehiclesGrid(true);
          selectionFirstTab_WhileDriving();
          //scope.setWhileDrivingVehicleDetails(vehicleId);
          scope.resize_WhileDrivingVehiclesGrid();
        }
        scope.whileDrivingVehicleUnSelectedFn = function(){
          scope.whileDrivingVehicleSelected = false;
          scope.resize_WhileDrivingVehiclesGrid();
        }

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
          showColumnMenu: true,
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
          var vehicleId = selected.vehicleId
            , bookingId = selected.bookingId;
          scope.selectedBookingId = bookingId;
          scope.bookingInfoRecordSelected = true;
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);
          scope.setVacantVehiclesGrid(true);
          selectionFirstTab_WhileDriving();
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
          {field:'bookingId', displayName:'Booking ID', width: '*'},
          {field:'vehicleName', displayName:'Vehicle', width: '*'},
          {field:'pickupTime', displayName:'Pickup Time', width: '*'},
          {field:'pickupPlace', displayName:'Pickup Place', width: '*'},
          {field:'journeyType', displayName:'Journey', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'booked from', width: '*'},
          {field:'bookingStatus', displayName:'Status', width: '*'},
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
          {field:'bookingId', displayName:'Booking ID', width: '*'},
          {field:'vehicleName', displayName:'Vehicle', width: '*'},
          {field:'pickupTime', displayName:'Pickup Time', width: '*'},
          {field:'pickupPlace', displayName:'Pickup Place', width: '*'},
          {field:'journeyType', displayName:'Journey', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'booked from', width: '*'},
          {field:'bookingStatus', displayName:'Status', width: '*'},
          {field:'vehicleCode', displayName:'VID', width: '*'}
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
        scope.vacantVehiclesColDefs = [
          {field:'vehicleCode', displayName:'VID', width: '*'},            
          {field:'vehicleName', displayName:'V.Name', width: '*'},
          {field:'loginTime', displayName:'L.Hrs', width: '*'},
          {field:'location', displayName:'Location', width: '*'},
          {field:'inBreak', displayName:'Break?', width: '*'},
          {field:'dayCollection', displayName:'Collection', width: '*'}
        ];

        scope.vacantVehicleSelectedFn = function(selected){
          scope.vacantVehicleSelected = true;
          scope.resize_vacantVehiclesGrid();
        }
        scope.vacantVehicleUnSelectedFn = function(){
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
          enableRowSelection: false,
          keepLastSelected: false,
          showColumnMenu: true
          /*afterSelectionChange: function () {            
            if(scope.selectedVacantVehicleRecords.length)
              scope.vacantVehicleSelectedFn(scope.selectedVacantVehicleRecords[0]);
            else
              scope.vacantVehicleUnSelectedFn();
          }*/
        };
        scope.vehicleDetailsPageCloseFn = function(){
          scope.vacantVehicleSelected = false;
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
          scope.vehiclePanelToggle(true)          
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
          scope.setAutoLoginVehicleGrid();          
        }     
        /*END: Handle While-driving and bookings hide-show*/
        
      /*END: Panel handling functionality*/

        /*START: Accordion related functionality*/
        scope.oneAtATime = true;
        /*END: Accordion related functionality*/
        
        /*START: Accept / Confirm / Reject functionality */
        // In vehicle state = 2
        scope.fnControlViewVehicleAccepBooking = function(sVId, sBId) {
          var oData = {
            "vehicleId": sVId || scope.vehicleDetailsData.vehicle.id,
            "bookingId": sBId || scope.selectedBookingItems[0].bookingId
          };
          serverService.sendData('P',
            'dispatcher/resVehicleToBooking',
            oData,
            scope.vehicleStateChange_Success,
            scope.vehicleStateChange_Error);
        };
        // In vehicle state = 4
        scope.fnControlViewVehicleConfirm = function() {
          var oData = {
            "vehicleId": scope.vehicleDetailsData.vehicle.id,
            "driverId": scope.vehicleDetailsData.driver.id,
            "bookingId": scope.selectedBookingItems[0].bookingId
          };
          serverService.sendData('P',
            'dispatcher/confirmVehicleToBooking',
            oData,
            scope.vehicleStateChange_Success,
            scope.vehicleStateChange_Error);
        }
        // In vehicle state = 2 / 4
        /*scope.fnControlViewVehicleRejectBooking = function() {
          var oData = {
            "vehicleId": scope.vehicleDetailsData.vehicle.id,
            "bookingId": scope.selectedBookingItems[0].bookingId
          };
          serverService.sendData('P',
            'dispatcher/cancelVehicleToBooking',
            oData,
            scope.vehicleStateChange_Success,
            scope.vehicleStateChange_Error);
        }*/
        scope.vehicleStateChange_Success = function(data){
          alert(data[0].message);
          scope.setBookingMgmtGrid(false);
          scope.bookingVehicleUnSelectedFn();
          scope.vacantVehicleUnSelectedFn();
        }
        scope.vehicleStateChange_Error = function(xhr, data){
          console.error('in vehicleStateChange_Error :: api error');
          alert('Error in processing your request');
        }

        scope.fnControlViewVehicleRejectBooking = function() {
            var bookingId = scope.selectedBookingItems[0].bookingId || '';
            if (bookingId === '') {
                alert('Booking Id required');
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
                              "vehicleId": scope.vehicleDetailsData.vehicle.id,
                              "bookingId": bookingId,
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
            scope.setVehiclesForBookingGrid(true);
            var aSelVt = [];
            // uncheck all the vehicleType filteres
            for(var i=0,iC=scope.vTypes.length;i<iC;i++){
              if(scope.chbVtype[scope.vTypes[i].id]){
                aSelVt.push(scope.vTypes[i].id);
              }
            }
            console.log(aSelVt, scope.selectedBookingId);
            scope.setVehiclesForBookingGrid(false, scope.selectedBookingId, aSelVt);
        };


        // handling custom events
        var oEventUpdateBookingMgmtGrid = $rootScope.$on('eventUpdateBookingMgmtGrid', function(oEvent, oData) {
            console.log('>>>>>scope.eventUpdateBookingMgmtGrid changed', arguments);
            scope.setBookingMgmtGrid(false);
            scope.bookingVehicleUnSelectedFn();
            scope.vacantVehicleUnSelectedFn();
        });


        scope.$on('$destroy', function() {
            console.log('destroying eventUpdateBookingMgmtGrid');
            oEventUpdateBookingMgmtGrid();
        });
    });