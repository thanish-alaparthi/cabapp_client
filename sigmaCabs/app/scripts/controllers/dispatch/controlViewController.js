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
    .controller('controlViewController', function($scope, $rootScope, URLService, DispatchService, PrerequisiteService, $dialog, modalWindow, $timeout, serverService) {
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
        scope.informationViewDisplay = true;
        scope.vehicleViewDisplay = true;
        scope.infoVehicleCombiDisplay = false;
        scope.bookingSelected = false;
        scope.showingBookingsGrid = true;
        scope.bookingVehicleSelected = false;
        scope.whileDrivingVehicleSelected = false;
        /*END: setting initial views to display*/

        /*START: setting initial data*/
        var POLLING_INTERVAL = 10000;
        scope.bookingData = [];
        scope.bookingDataObjs = []
        scope.bookingDataLength = 0;

        scope.bookingInfoData = [];
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

        scope.vehicleDetailedInfoSplitView = URLService.view('vehicleDetailedInfoSplitView');

        scope.mainGridView = 'bMgmt';
        /*END: setting initial data*/

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
        }

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
              namesService = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.bookingId = 'BID'+datum.bookingId;
            datum.vehicleName = namesService.fnGetVehicleDisplayNameById(datum.vehicleName);
            datum.vehicleType = namesService.fnGetVehicleDisplayTypeById(datum.vehicleType);
            datum.bookingStatus = namesService.fnGetBookingStatusName(datum.bookingStatus);
            var sJourneyTypeId = datum.subJourneyType;
            datum.subJourneyType = namesService.fnGetJourneyTypeName(datum.subJourneyType);            
            datum.journeyType = namesService.fnGetMainJourneyTypeObjectBySubJourneyTypeId(sJourneyTypeId).journeyType;
          }
          scope.loadBookingMgmtGridData(data);
        }
        scope.FormatNloadWhileDrivingVehiclesGridData = function(data){
          var data = data, 
              dataLen = data.length,
              formatSource = PrerequisiteService;
          while(dataLen--){
            var datum = data[dataLen];
            datum.bookingId = 'BID'+datum.bookingId;
            datum.vehicleName = formatSource.fnGetVehicleDisplayNameById(datum.vehicleName);
            datum.vehicleType = formatSource.fnGetVehicleDisplayTypeById(datum.vehicleType);
            var sJourneyTypeId = datum.subJourneyType;
            datum.subJourneyType = formatSource.fnGetJourneyTypeName(datum.subJourneyType);            
            datum.journeyType = formatSource.fnGetMainJourneyTypeObjectBySubJourneyTypeId(sJourneyTypeId).journeyType;
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
            datum.vehicleName = namesService.fnGetVehicleNameById(datum.vehicleName).vehicleName;
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
            oData.vehicle = {
              "id": "12",
              "vehicleCode": data.vehicle.vehicleCode || '',
              "registrationNumber": data.vehicle.registrationNumber || '',
              "vehicleNameId": data.vehicle.vehicleName || '',
              "vehicleName": PrerequisiteService.fnGetVehicleDisplayNameById(data.vehicle.vehicleName) || '',
              "vehicleTypeId": data.vehicle.vehicleType || '',
              "vehicleType": PrerequisiteService.fnGetVehicleDisplayTypeById(data.vehicle.vehicleType) || '',
              "registeredMobile": data.vehicle.registrationNumber || '', // should be changed to array
              "previousLocation": data.vehicle.previousLocation || '',
              "totalDays": data.vehicle.totalDays || 0,
              "totalWorkingDays": data.vehicle.totalWorkingDays || 0,
              "projectedLoginTime": PrerequisiteService.fnFormatMinutes(data.vehicle.projectedLoginTime) || 0,
              "presentAvgLoginTime": PrerequisiteService.fnFormatMinutes(data.vehicle.presentAvgLoginTime) || 0,
              "projectedCollection": data.vehicle.projectedCollection || 0,
              "presentAvgCollection": data.vehicle.presentAvgCollection || 0,
              // converting to 5 scale assuming it is 10 point scale
              "rating": Math.round(parseFloat(data.vehicle.rating) / 2) || 0,
              "facilities": data.vehicle.facilities || []
            };
          } else {
            oData.vehicle = {};
          }
          // driver details
          if(data.driver) {
            oData.driver = {
                  "id": "12",
                  "driverCode": data.driver.driverCode || '',
                  "name": data.driver.name || '',
                  "mobile": data.driver.mobile || '',
                  // converting to 5 scale assuming it is 10 point scale
                  "rating": Math.round(parseFloat(data.driver.rating) / 2) || 0
              };
          } else {
            oData.driver = {};
          }

          scope.loadVehicleDetailsData(oData);
        }
        scope.FormatNloadBookingDetailsData = function(data){
         var data = data, 
              dataLen = data.length,          
              namesService = PrerequisiteService;
          /*while(dataLen--){
            var datum = data[dataLen];
            datum.vehicleName = namesService.fnGetVehicleNameById(datum.vehicleName).vehicleName;
          }
*/          scope.loadBookingDetailsData(data);
        }
        /*END: Formatter methods*/

        /*START: Loader methods*/
        scope.loadBookingMgmtGridData = function(data){
          var data = data;
          scope.bookingData = data;
          scope.bookingDataObjs = JSON.parse(JSON.stringify(data));
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
          scope.whileDrivingDataObjs = JSON.parse(JSON.stringify(data));
          scope.whileDrivingDataLength = data.length;
        }

        scope.loadBookingInfoGridData = function(data){
          scope.bookingInfoData = data;
          scope.bookingInfoDataObjs = JSON.parse(JSON.stringify(data));
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
        scope.setBookingMgmtGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingMgmtGridData([]);
          else{
            serverService.sendData('P','dispatcher/getAllBookings', {"bookingStatus" : [4]}, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
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
        scope.setVacantVehiclesGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadVacantVehiclesGridData([]);
          else{
            serverService.sendData('P','dispatcher/getAllVehicles',{"vehicleStatus":[2,3]}, scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
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
        scope.setVehiclesForBookingGrid = function(doEmptyGrid, data){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingVehiclesGridData([]);
          else{
            var bookingObj = {'bookingId': data}
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
        scope.setBookingInfoGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingInfoGridData([]);
          else{
            //Need to trigger the server call from here
            //serverService.sendData('G','url',scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
            serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingInfoGrid_Success, scope.setBookingInfoGrid_Error);
          }
        }        
        scope.setBookingInfoGrid_Success = function(data){
          scope.loadBookingInfoGridData(data);
        }
        scope.setBookingInfoGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the booking info grid*/
        

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
        
        scope.bookingGridColDefs = [
          {field:'bookingCode', displayName:'BID', width: '*'},
          {field:'vehicleName', displayName:'Vehicle', width: '*'},
          {field:'vehicleType', displayName:'V.Type', width: '*'},
          {field:'pickupTime', displayName:'P.Time', width: '*'},
          {field:'pickupPlace', displayName:'P.Place', width: '*'},
          {field:'journeyType', displayName:'Journey', width: '*'},
          {field:'subJourneyType', displayName:'Package', width: '*'},
          {field:'bookingOrigin', displayName:'Origin', width: '*'},
          {field:'bookingStatus', displayName:'Status', width: '*'},
          {field:'vehicleCode', displayName:'VID', width: '*'}
        ];

        scope.bookingGridPgOptions = {
          pageSizes: [20, 25, 30],
          pageSize: 20,
          currentPage: 1
        }

        scope.bookingSelectedFn = function(booking){
          scope.bookingSelected = true;
          var bookingId = booking.bookingId;
          scope.selectedBookingId = bookingId;
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);          
          scope.setVacantVehiclesGrid(true);
          scope.setVehiclesForBookingGrid(false, bookingId);
          scope.vacantVehicleSelected = false;
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
          showColumnMenu: true,
          enableColumnResize: true,
          enableSorting: false,
          afterSelectionChange: function () {
            if(scope.selectedBookingItems.length)
              scope.bookingSelectedFn(scope.selectedBookingItems[0])
            else
              scope.bookingUnSelectedFn();
          }
        };

        scope.unselectBookingFn = function(){
          scope.gridBookingsData.selectAll(false)
        }

        /*END: Bookings Management Grid*/
        /*START: Vehicles for Booking Grid*/
        scope.vehiclesForBookingColDefs = [
          {field:'vehicleCode', displayName:'VID', width: '*'},
          {field:'vehicleName', displayName:'Vehicle', width: '*'},
          {field:'mobileNumber', displayName:'Mobile', width: '*'},
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
          {field:'bookingId', displayName:'BID', width: '*'},
          {field:'vehicleCode', displayName:'VID', width: '*'},
          {field:'vehicleName', displayName:'Vehicle', width: '*'},
          {field:'vehicleType', displayName:'V.Type', width: '*'},
          {field:'pickupTime', displayName:'P.Time', width: '*'},
          {field:'pickupPlace', displayName:'P.Place', width: '*'},
          {field:'journeyType', displayName:'J.Type', width: '*'},
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
        scope.bookingInfoSearch = function (searchText) {
          var data, resultLabel;
          if (searchText&& searchText.length >=3) {
            var ft = searchText.toLowerCase();
            data = scope.bookingInfoData.filter(function(item) {
              return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
            });
            scope.bookingInfoData = data;
          }else{
            scope.bookingInfoData = scope.bookingInfoDataObjs;
          }  
        };

        scope.bookingInfoGridColDefs = [
          {field:'bno', displayName:'Booking ID', width: '*'},
          {field:'vehicle', displayName:'Vehicle', width: '*'},
          {field:'pTime', displayName:'Pickup Time', width: '*'},
          {field:'pPlace', displayName:'Pickup Place', width: '*'},
          {field:'custGrade', displayName:'Customer Grade', width: '*'},
          {field:'sJourneyType', displayName:'Journey Package', width: '*'},
          {field:'bookFrom', displayName:'booked from', width: '*'},
          {field:'status', displayName:'Status', width: '*'},
          {field:'vId', displayName:'VID', width: '*'}
        ];

        scope.gridBookingsInfoData = {
          data: 'bookingInfoData',
          multiSelect: false,
          filterOptions: {
            filterText: "",
            useExternalFilter: true
          },
          enableSorting: false,
          columnDefs: 'bookingInfoGridColDefs'
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
          }
        }
        var hide_reset_AllMainGridViews = function(){
          scope.showingBookingsGrid = false;
          scope.showingWhilDrivingGrid = false;
          scope.showingBookingsInfoGrid = false;

          scope.setBookingMgmtGrid(true);
          scope.setWhileDrivingVehiclesGrid(true);
          scope.setBookingInfoGrid(true);

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
        /*END: Handle While-driving and bookings hide-show*/
        
      /*END: Panel handling functionality*/

        /*START: Accordion related functionality*/
        scope.oneAtATime = true;
        /*END: Accordion related functionality*/
        
    });    