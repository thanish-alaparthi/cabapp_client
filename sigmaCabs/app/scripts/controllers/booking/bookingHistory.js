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
			console.log('selectedBookingId: ',oRow.entity);
   			var oX = {};
   			angular.copy(oRow.entity, oX);
			$rootScope.$emit('eventSelectedBookingFromHistory', {
				bookingDetails : oX
			});
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
				field: 'bookingDisplayDate',
				displayName: 'Booking Date'
			},{
				field: 'pickupDisplayDate',
				displayName: 'Trip Date'
			}, {
				field: 'bookingCode',
				displayName: 'Booking#'
			}, {
				field: 'primaryPassanger',
				displayName: 'Passenger Name'
			}, {
				field: 'pickupDisplayTime',
				displayName: 'Start Time',
				width: 85
			}, {
				field: 'pickupPlace',
				displayName: 'Pickup'
			}, {
				field: 'dropPlace',
				displayName: 'Drop'
			}, {
				field: 'vehicleDisplayType',
				displayName: 'Type',
				width: 80
			}, {
				field: 'vehicleDisplayName',
				displayName: 'Vehicle',
				width: 80
			}, {
				field: 'subJourneyTypeName',
				displayName: 'Sub-Journey Type',
				width: 80
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
	      	enableCellSelection : false,
	      	enableRowSelection: false
		};
	});