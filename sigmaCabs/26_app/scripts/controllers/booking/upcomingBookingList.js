/*
Name: UpcomingBookingListController
Description: Handles displaying list (grid) of upcoming bookings.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('UpcomingBookingListController', function($scope, $rootScope, URLService, $dialog, $http) {

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
				var data;
				if (searchText) {
					var ft = searchText.toLowerCase();
					$http.get('scripts/fixtures/upcomingBookingList.json').success(function(largeLoad) {
						data = largeLoad.filter(function(item) {
							return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
						});
						$scope.fnSetPagingData(data, page, pageSize);
					});
				} else {
					$http.get('scripts/fixtures/upcomingBookingList.json').success(function(largeLoad) {
						$scope.fnSetPagingData(largeLoad, page, pageSize);
					});
				}
			}, 100);
		};


		/*
			watch for any change done in pagination
		*/
		$scope.$watch('pagingOptions', function(newVal, oldVal) {
			if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
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
			data: 'myData',
			columnDefs: [{
				field: 'bookingdatetime',
				displayName: 'Booking DateTime'
			},{
				field: 'journeydatetime',
				displayName: 'Journey DateTime'
			}, {
				field: 'source',
				displayName: 'Source'
			}, {
				field: 'destination',
				displayName: 'Destination'
			}, {
				field: 'type',
				displayName: 'Type'
			}, {
				field: 'remark',
				displayName: 'Remark'
			}],
			enablePaging: true,
			showFooter: true,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			afterSelectionChange: function(oRow) {
				console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};


		/*
			watch the event where customer is selected from the customeList
		*/
		$scope.$on('loadUpcomingBookingList', function(ev, oData) {

			$scope.oQuery = oData;

			$scope.myData = [];

			$scope.fnGetPagedDataAsync(
				$scope.pagingOptions.pageSize,
				$scope.pagingOptions.currentPage
			);

		});

	});