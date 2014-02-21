/*
Name: VehicleListController
Description: Handles displaying list (grid) of vehicles.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleListController', function($scope, $rootScope, URLService, PrerequisiteService, $dialog, $http, VehiclesService) {
		$scope.vehiclesData = [];
		VehiclesService.fnGetAllVehiclesData()
		.success(function(data, status, headers, config){
			console.log('Success: ', data);

			// change ids to proper text
			for(var i=0;i<data.length; i++){
				data[i].attachmenttypeName = PrerequisiteService.vehicleAttachmentTypeNames[data[i].vehicleAttachmentType];
				data[i].vehicletypeName = PrerequisiteService.vehicleTypeOptions[data[i].vehicleType];
			}

			$scope.vehiclesData = data;
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
				$http.get(URLService.service('getAllVehicles'))
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

		$scope.gridOptions = {
			data: 'vehiclesData',
			columnDefs: [{
				field: 'vehicleCode',
				displayName: 'Vehicle Id'
			},{
				field: 'vehicleColor',
				displayName: 'Color'
			},{
				field: 'vehicletypeName',
				displayName: 'Type'
			},{
				field: 'manufacturingYear',
				displayName: 'Manufactured Year'
			},{
				field: 'registrationNumber',
				displayName: 'Registration#'
			},{
				field: 'attachmenttypeName',
				displayName: 'Aattachment Type'
			},{
				field: 'registeredMobileNumber',
				displayName: 'Registartion Mobile'
			}],
			enablePaging: true,
			showFooter: true,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			afterSelectionChange: function(oRow) {
				
				/*
					Do the following when a vehicle is selcted from the vehicle list.	
				*/

				// Emit eventVehicleSelectedFromList to notify bookingController
				$scope.$emit('eventVehicleSelectedFromList', oRow.selectionProvider.selectedItems[0]);

				$scope.selectedVehicleDetails = oRow.selectionProvider.selectedItems[0];

				console.log('Selected vehicle details:', oRow.selectionProvider.selectedItems[0]);
				
				// // set the default booking tab for selected vehicle.
				// $rootScope.$broadcast('setDefaultBookingTab', {
				// 	vehicleData : oRow.selectionProvider.selectedItems[0]
				// });

				// // load upcoming booking list
				// $rootScope.$broadcast('loadUpcomingBookingList', {
				// 	vehicleData : oRow.selectionProvider.selectedItems[0]
				// });
				// // load past booking list
				// $rootScope.$broadcast('loadPastBookingList', {
				// 	vehicleData : oRow.selectionProvider.selectedItems[0]
				// });
				// // load canceled booking list
				// $rootScope.$broadcast('loadCanceledBookingList', {
				// 	vehicleData : oRow.selectionProvider.selectedItems[0]
				// });
			}
		};

	});