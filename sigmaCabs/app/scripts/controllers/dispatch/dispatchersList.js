/*
Name: CustomerListController
Description: Handles displaying list (grid) of customers.
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('dispatchersListController', function($scope, $rootScope, URLService, $dialog, DispatchService, $timeout) {
		$scope.selectedVehicleList = [];
		$scope.selectedBookingRecords= [];
		$scope.mySelections = [];
		$scope.bookingData = [];
		$scope.splitView = false;

		DispatchService.fnGetDisBookingData()
		.success(function(data, status, headers, config){
			console.log('Success: ', data);
			$scope.bookingData = data;
			// change ids to proper text
		/*	for(var i=0;i<data.length; i++){
				data[i].attachmenttypeName = PrerequisiteService.vehicleAttachmentTypeNames[data[i].vehicleAttachmentType];
				data[i].vehicletypeName = PrerequisiteService.vehicleTypeOptions[data[i].vehicleType];
			}

			$scope.vehiclesData = data;*/
		})
		.error(function(data, status, headers, config){
			console.log('Error: ', data)
		});

		// default settings for grid
		$scope.totalServerItems = 0;
		$scope.pagingOptions = {
			pageSizes: [10, 50, 100, 150],
			pageSize: 10,
			currentPage: 1
		};
		$scope.columnDefs =  [{
				field: 'id',
				displayName: 'ID',
				width:'*'
			},{
				field: 'pickupAddress',
				displayName: 'Pickup Address',
				width:'*'
			}, {
				field: 'dropAddress',
				displayName: 'Drop Address',
				width:'*'
			}, {
				field: 'journeyDate',
				displayName: 'Journey Date',
				width:'*'
			}, {
				field: 'pickupTime',
				displayName: 'Pickup Time',
				width:'*'
			}, {
				field: 'customerId',
				displayName: 'Customer Id',
				width:'*'
			},{
				field: 'bookingState',
				displayName: 'Booking State',
				width:'*'
			},{
				field: 'passengerCount',
				displayName: 'Passenger Count',
				width:'*'
			},{
				field: 'vehicleCount',
				displayName: 'Vehicle Count',
				width:'*'
			},{
				field: 'vehicleTypes',
				displayName: 'Vehicle Types',
				width:'*'
			},{
				field: 'status',
				displayName: 'Status',
				width:'*'
			}];


		/*
			Name: fnSetPagingData,
			Description: Handles paging data for grid
		*/

		/*
			Name: fnGetPagedDataAsync,
			Description: Make REST API call to get data
		*/

		$scope.dispBookGridOptions = {
			data: 'bookingData',
			columnDefs: $scope.columnDefs,
			enablePaging: true,
			showFooter: true,
			multiSelect: false,
			enableColumnResize: true,
			totalServerItems: 'totalServerItems',
			pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			showSelectionCheckbox: true,
			selectedItems: $scope.mySelections,
			afterSelectionChange: function () {
				console.log($scope.mySelections);
			  $rootScope.$emit('showVehicleGrid');
			  $scope.showVehicleDetView = true;	
		      $scope.selectedBookings = [];
		      angular.forEach($scope.mySelections, function (item ) {
		        $scope.selectedBookingRecords.push(item);
		      });
		    },
			plugins: [new ngGridRowSelectionEvents()]
		};

		$scope.$on('ngGridRowSelected', function(event, rowselected){
			$timeout(function(){
			 	$rootScope.$emit('showVehicleGrid');
			 	$scope.splitView = true;
				$scope.showVehicleDetView = true;
		    },0)			
		 				    
		});

		$scope.$on('ngGridRowDeSelected', function(event, rowselected){
			$timeout(function(){
				$rootScope.$emit('hideVehicleGrid');
				$scope.splitView = false;
				$scope.showVehicleDetView = false;
		    },0)
			
		   
		});

		$scope.$watch('showVehicleDetView', function(){
	    /*
	      Height of the grid and resize event occuring at the same time. So to serialize both action timeout is used 
	    */
		$timeout(function(){
		      $('.employeeGrid').trigger('resize');
		    },0);
		});

		$scope.$on('getDispatchDetails', function(){
			$scope.sendSelectedRecords();
		});

		$scope.sendSelectedRecords = function (){
			$scope.$emit('selectedBookingDet', $scope.selectedBookingRecords)
		};
		$scope.selectedVehicleList = $scope.vehicleData = [];
		var activity = {
			"activity": "9"
		};
		
		DispatchService.fnGetDisVehiData(activity)
		.success(function(data, status, headers, config){
			console.log('Success: ', data);
			$scope.vehicleData = data;
		})
		.error(function(data, status, headers, config){
			console.log('Error: ', data)
		});


		// grid filterOptions
		$scope.filterOptions = {
			filterText: "",
			useExternalFilter: true
		};

		// default settings for grid
		$scope.totalServerItems = 0;
		$scope.pagingOptions = {
			pageSizes: [10, 50, 100, 150],
			pageSize: 10,
			currentPage: 1
		};

		/*
			Name: fnSetPagingData,
			Description: Handles paging data for grid
		*/
		$scope.fnSetPagingData = function(data, page, pageSize) {
			var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
			$scope.myData = pagedData;
			$scope.totalServerItems = data.length;
			if (!$scope.$$phase) {
				$scope.$apply();
			}
		};

		/*
			Name: fnGetPagedDataAsync,
			Description: Make REST API call to get data
		*/
		$scope.fnGetPagedDataAsync = function(pageSize, page, searchText) {
			setTimeout(function() {
				$http.get(URLService.service('usersList'))
					.success(function(largeLoad) {
						$scope.fnSetPagingData(largeLoad, page, pageSize);
					});
			}, 100);
		};

		
		/*
			watch for any change done in pagination
		*/
		$scope.$watch('pagingOptions', function(newVal, oldVal) {
			if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
				/*
					pagination done, so make a call to the server to get the new data.
				*/
				$scope.fnGetPagedDataAsync(
					$scope.pagingOptions.pageSize, 
					$scope.pagingOptions.currentPage, 
					$scope.filterOptions.filterText
				);
			}
		}, true);

		$scope.mySelections = [];
		$scope.selectedVehicles = [];
		$scope.vehicleGridOptions = {
			data: 'vehicleData',
			columnDefs: [{
				field: 'registrationNumber',
				displayName: 'Registation Number'
			},{
				field: 'id',
				displayName: 'ID'
			},{
				field: 'vehicleCode',
				displayName: 'Vehicle Id'
			},{
				field: 'vehicleType',
				displayName: 'Vehicle Type'
			},{
				field: 'brand',
				displayName: 'Brand'
			},{
				field: 'registrationMobile',
				displayName: 'Registartion Mobile'
			}],
			showFooter: true,
			multiSelect: false,
			enableColumnResize: true,
			selectedItems: $scope.mySelections,
			showSelectionCheckbox: true,
			afterSelectionChange: function () {
		      
		      angular.forEach($scope.mySelections, function (item ) {
		      	console.log(item);
		      	if(item.id){
		        	$scope.selectedVehicles.push(item.id);
		      	}
		      });
		    },
		};
		/*
			watch for any change done in filterOptions
		*/
		$scope.$watch('filterOptions', function(newVal, oldVal) {
			if (newVal !== oldVal) {
				$scope.fnGetPagedDataAsync(
					$scope.pagingOptions.pageSize, 
					$scope.pagingOptions.currentPage, 
					$scope.filterOptions.filterText
				);
			}
		}, true);

		/*$scope.vehicleData = [
			{"id" : 1, "bookingdatetime": "09May2013","journeydatetime": "09May2013", "source" : "Kondapur", "destination" : "Airport", "type" : "Round trip", "remark" : "" }
		];*/

		$rootScope.$on('showVehicleGrid', function(){
			$scope.showVehicleDetView = true;
			//$scope.vehicleGridOptions.$gridScope.columns[0].toggleVisible();
		});

		$rootScope.$on('hideVehicleGrid', function(){
			$scope.showVehicleDetView = false;
		});

		$scope.$on('getDispatchDetails', function(){
			$scope.sendSelectedRecords();
		});

		$scope.$watch('showVehicleDetView', function(){
	    /*
	      Height of the grid and resize event occuring at the same time. So to serialize both action timeout is used 
	    */
		$timeout(function(){
		      $('.dispBookingGrid').trigger('resize');
		    },0);
		});
		var scope = $scope;
		var whichTab = 0;
		scope.layoutHeight = 180;
		scope.gridHeight = 185;
 		scope.assetGridHeight = 243;

		scope.tabs=[
			{
		       "label": "Vehicles"
		      , "id": 0
		      , "splitTabId": "emp_splitAssetsOwned"
		      , "selected": false
		      , "template": "views/dispatches/vehicleTabDetails.html"
		    },
		    {
		        "label": "Booking Info"
		      , "id": 1
		      , "splitTabId": "emp_splitPersonalInfo"
		      , "selected": false
		      , "template": "views/dispatches/bookingTabDetails.html"
		    }
		 ];

		scope.tabs[whichTab].selected = true;
		scope.splitCurrentTab = scope.tabs[whichTab].template;
		scope.previousSelectedTab = null;
		scope.currentSelectedTab = scope.tabs[whichTab].id;
		scope.currentlyClickedTab = null;

		 scope.handleTabClick = function(clickedid){
		    if(scope.currentSelectedTab == clickedid)
		      return;
		    scope.tabs[scope.currentSelectedTab].selected = false;
		    scope.tabs[clickedid].selected = true;
		    scope.previousSelectedTab = scope.currentSelectedTab;
		    scope.currentSelectedTab = clickedid;
		    whichTab = clickedid;
		    scope.splitCurrentTab = scope.tabs[whichTab].template;
		};

		$scope.sendSelectedRecords = function (){
			$scope.$emit('selectedVehicleDet', $scope.selectedVehicles)
		};
		

	});