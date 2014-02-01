/*
Name: BookingHistory
Description: Adds first time customer
Date: 12Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingHistory', function($scope, PrerequisiteService,PreConfigService, BookingService,CustomerService, $rootScope, URLService, $dialog) {

		var scope = $scope;

		scope.customerBookingTabs = URLService.view('customerBookingTabs');

		scope.fnOpenBookingDetails = function(oRow){
			console.log('selectedBookingId: ',oRow.entity.id);
		}

		scope.BOOKING_CANCELLED = PreConfigService.BOOKING_CANCELLED;
		scope.BOOKING_COMPLETED_N_CLOSED = PreConfigService.BOOKING_COMPLETED_N_CLOSED;

		scope.gridCustomerBookingOptions = {
			data: 'bookingHistoryDetails',
			rowHeight: 25,
			columnDefs: [{
				field: 'srno',
				displayName: '#',
				width : 30
			},{
				field: 'pickupDate',
				displayName: 'Trip Date'
			}, {
				field: 'bookingCode',
				displayName: 'Booking#'
			}, {
				field: 'primaryPassanger',
				displayName: 'Passenger Name'
			}, {
				field: 'pickupTime',
				displayName: 'Start Time',
				width: 85
			}, {
				field: 'pickupPlace',
				displayName: 'Pickup'
			}, {
				field: 'dropPlace',
				displayName: 'Drop'
			}, {
				field: 'vehicleName',
				displayName: 'Vehicle',
				width: 80
			}, {
				field: 'package',
				displayName: 'Package'
			}, {
				field: 'bookingStatusName',
				displayName: 'Status',
				width: 90
			}, {
				field: 'id',
				displayName: 'id',
				visible: false
			}, {
				displayName: 'Action',
				width: 110,
				cellTemplate: '<div style="text-align: center;"><button style="margin-top: 4px;" class="btnCompact btn-success" ng-click="fnOpenBookingDetails(row)">{{((row.getProperty(\'bookingStatus\') == BOOKING_COMPLETED_N_CLOSED || row.getProperty(\'bookingStatus\') == BOOKING_CANCELLED) ? "Book Again" : "Edit/View" )}}</button></div>'
			}],
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			afterSelectionChange: function(oRow) {
				// console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};
	});