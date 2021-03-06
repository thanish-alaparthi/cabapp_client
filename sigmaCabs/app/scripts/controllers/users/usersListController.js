/*
Name: CustomerListController
Description: Handles displaying list (grid) of customers.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('usersListController', function($scope, $rootScope, URLService, PrerequisiteService, $dialog, $http, UsersService) {
		console.log('loaded...');
		$scope.fnLoadUsers = function() {
			UsersService.fnGetAllUsersData()
			.success(function(data, status, headers, config){
				console.log('success fnGetAllUsersData: ',data);
				// change ids to proper text
				for(var i=0;i<data.length; i++){
					data[i].jobcategoryName = PrerequisiteService.userJobCategoriesNames[data[i].jobCategory];
					data[i].usertypeName = PrerequisiteService.userTypes[data[i].userType];
				}
				$scope.usersData = data;
			})
			.error(function(data, status, headers, config){
				console.log('Error fnGetAllUsersData: ',data)
			});
		};

		$scope.fnLoadUsers();

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
				$http.get(URLService.service('customerList'))
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
			data: 'usersData',
			columnDefs: [{
				field: 'id',
				displayName: 'ID'
			},{
				field: 'firstName',
				displayName: 'First Name'
			},{
				field: 'lastName',
				displayName: 'Last Name'
			},{
				field: 'username',
				displayName: 'Username'
			},{
				field: 'mobile',
				displayName: 'Mobile'
			},{
				field: 'usertypeName',
				displayName: 'Type'
			},{
				field: 'jobcategoryName',
				displayName: 'Job Category'
			},{
				field: 'email',
				displayName: 'Email'
			}],
			enablePaging: true,
			showFooter: true,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			pagingOptions: $scope.pagingOptions,
			filterOptions: $scope.filterOptions,
			afterSelectionChange: function(oRow) {
				
				/*
					Do the following when a user is selcted from the customer list.	
				*/

				// Emit eventUserSelectedFromList to notify bookingController
				$scope.$emit('eventUserSelectedFromList', oRow.selectionProvider.selectedItems[0]);
				
				// set the default booking tab for selected customer.
				$rootScope.$broadcast('setDefaultBookingTab', {
					customerData : oRow.selectionProvider.selectedItems[0]
				});


				// load upcoming booking list
				$rootScope.$broadcast('loadUpcomingBookingList', {
					customerData : oRow.selectionProvider.selectedItems[0]
				});
				// load past booking list
				$rootScope.$broadcast('loadPastBookingList', {
					customerData : oRow.selectionProvider.selectedItems[0]
				});
				// load canceled booking list
				$rootScope.$broadcast('loadCanceledBookingList', {
					customerData : oRow.selectionProvider.selectedItems[0]
				});
			}
		};


		/*
			watch the event where customer is searched.
		*/	
		$scope.$on('loadCustomerList', function(ev, oData) {

			if(oData.showAddNewCustomerList) {
				alert('Temp Hack to show Add New Customer screen.');
				$scope.showAddNewCustomerList = oData.showAddNewCustomerList;

				$scope.$emit('eventShowAddNewCustomer', $scope.showAddNewCustomerList);
				return;
			}

			$scope.$emit('eventShowAddNewCustomer', $scope.showAddNewCustomerList);
			



			$scope.showAddNewCustomerList = false;

			$scope.oQuery = oData;

			$scope.myData = [];

			// get customer details when mobile number field has more than 5 characetes OR
				// name field has more than 2 charactes.
			if(		(oData.sType =='mobile' && oData.query && oData.query.toString().length > 5) 
				|| 	(oData.sType =='name' &&oData.query && oData.query.toString().length > 2)){
				$scope.fnGetPagedDataAsync(
					$scope.pagingOptions.pageSize, 
					$scope.pagingOptions.currentPage
				);
			}
		});



		$scope.$on('eventUserDeleted', function(ev, oData) {
			console.log('Reloading users...');
			$scope.fnLoadUsers();
		});
	});