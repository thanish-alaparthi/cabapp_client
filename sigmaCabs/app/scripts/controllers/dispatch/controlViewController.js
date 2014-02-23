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
        /*END: setting initial views to display*/

        /*START: setting initial data*/
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

        /*END: resize methods for grids*/

    /*START: Loading methods for the grids data*/
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
    /*END: Loading methods for the grids*/

    /*START: Loading initial grids*/
        /*START: setting the booking management grid*/
        scope.setBookingMgmtGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingMgmtGridData([]);
          else{
            //Need to trigger the server call from here
            serverService.sendData('G','dispatcher/getAllBookings', {"bookingStatus" : "2"}, scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
            //serverService.stubData({'controller': _controller,'url':'bookingData'},scope.setBookingMgmtGrid_Success, scope.setBookingMgmtGrid_Error);
          }
        }        
        scope.setBookingMgmtGrid_Success = function(data){
          scope.loadBookingMgmtGridData(data);
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
            //Need to trigger the server call from here
            //serverService.sendData('G','url',scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
            serverService.stubData({'controller': _controller,'url':'vacantVehiclesData'},scope.setVacantVehiclesGrid_Success, scope.setVacantVehiclesGrid_Error);
          }
        }        
        scope.setVacantVehiclesGrid_Success = function(data){
          scope.loadVacantVehiclesGridData(data);
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
            //serverService.sendData('G','url',scope.setWhileDrivingVehiclesGrid_Success, scope.setWhileDrivingVehiclesGrid_Error);
            serverService.stubData({'controller': _controller,'url':'whileDrivingData'},scope.setWhileDrivingVehiclesGrid_Success, scope.setWhileDrivingVehiclesGrid_Error);
          }
        }        
        scope.setWhileDrivingVehiclesGrid_Success = function(data){
          scope.loadWhileDrivingVehiclesGridData(data);
        }
        scope.setWhileDrivingVehiclesGrid_Error = function(xhr, data){
          //do some error processing..
        }
        /*END: setting the while-driving vehicles grid*/

        /*START: setting the vehicles for booking grid*/
        scope.setVehiclesForBookingGrid = function(doEmptyGrid){
          if(doEmptyGrid && doEmptyGrid == true)
            scope.loadBookingVehiclesGridData([]);
          else{
            //Need to trigger the server call from here
            //serverService.sendData('G','url',scope.setVehiclesForBooking_Success, scope.setVehiclesForBooking_Error);
            serverService.stubData({'controller': _controller,'url':'vehiclesForBookingData'},scope.setVehiclesForBooking_Success, scope.setVehiclesForBooking_Error);
          }
        }        
        scope.setVehiclesForBooking_Success = function(data){
          scope.loadBookingVehiclesGridData(data);
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

        scope.setBookingMgmtGrid();
        scope.setVacantVehiclesGrid();

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

        scope.previousSelectedTab = null;        
        scope.currentlyClickedTab = null;

        var selectionFirstTab = function(){
          scope.tabs[0].selected = true;
          scope.splitCurrentTab = scope.tabs[0].template;
          scope.currentSelectedTab = scope.tabs[0].id;
        }

        /*
          Method description: Handle tab click
          PARAMS: steps array
        */
        scope.handleTabClick = function(clickedid){
          if(scope.currentSelectedTab == clickedid)
            return;          
          scope.tabs[scope.currentSelectedTab].selected = false;
          scope.tabs[clickedid].selected = true;
          scope.previousSelectedTab = scope.currentSelectedTab;
          scope.currentSelectedTab = clickedid;
          whichTab = clickedid;
          scope.splitCurrentTab = scope.tabs[whichTab].template;
          if(scope.tabs[whichTab].callback)
            scope[scope.tabs[whichTab].callback].call();
        };

        scope.vehicleTabClicked = function(){ 
          
        }
        scope.bookingTabClicked = function(){ 
          
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
          {field:'status', displayName:'Status', width: '*'},
          {field:'vehicleCode', displayName:'VID', width: '*'}
        ];

        scope.bookingGridPgOptions = {
          pageSizes: [20, 25, 30],
          pageSize: 20,
          currentPage: 1
        }

        scope.bookingSelectedFn = function(booking){
          scope.bookingSelected = true;
          if(!scope.vehicleViewDisplay)
            scope.vehiclePanelToggle(true);          
          scope.setVacantVehiclesGrid(true);
          scope.setVehiclesForBookingGrid();
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

        /*END: Bookings Management Grid*/

        /*START: Vehicles for Booking Grid*/
        scope.vehiclesForBookingColDefs = [
          {field:'vehicle', displayName:'Vehicle', width: '*'},
          {field:'pNum', displayName:'Phone No', width: '*'},
          {field:'currLoc', displayName:'Location', width: '*'}
        ];

        scope.bookingVehicleSelectedFn = function(data){
          scope.bookingVehicleSelected = true;
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
          scope.whileDrivingVehicleSelected = true;
          scope.resize_WhileDrivingVehiclesGrid();
        }
        scope.whileDrivingVehicleUnSelectedFn = function(){
          scope.whileDrivingVehicleSelected = false;
          scope.resize_WhileDrivingVehiclesGrid();
        }

        scope.vehiclesForWhileDrivingColDefs = [
          {field:'bId', displayName:'BID', width: '*'},
          {field:'vId', displayName:'VID', width: '*'},
          {field:'vehicle', displayName:'Vehicle', width: '*'},
          {field:'pTime', displayName:'Pickup Time', width: '*'},
          {field:'pPlace', displayName:'Pickup Place', width: '*'},
          {field:'sJourneyType', displayName:'Package', width: '*'},
          {field:'expectVacntTime', displayName:'Expected Vacant time', width: '*'},
          {field:'collection', displayName:'Collection', width: '*'},
          {field:'nxtBookng', displayName:'Next Booking', width: '*'}
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
          enableRowSelection: false,
          keepLastSelected: false,
          showColumnMenu: true,
          afterSelectionChange: function () {            
            if(scope.selectedVacantVehicleRecords.length)
              scope.whileDrivingVehicleSelectedFn(scope.selectedVacantVehicleRecords[0]);
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
          {field:'vId', displayName:'Vehicle ID', width: '*'},            
          {field:'vName', displayName:'Vehicle', width: '*'},
          {field:'lgnHrs', displayName:'Login Hours', width: '*'},
          {field:'currLoc', displayName:'Location', width: '*'},
          {field:'isBreak', displayName:'Break', width: '*'},
          {field:'collection', displayName:'Collection', width: '*'}
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