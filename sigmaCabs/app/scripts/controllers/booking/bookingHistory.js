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
   			oX.vehicleName = oX.vehicleName ? oX.vehicleName : "";
			$rootScope.$emit('eventSelectedBookingFromHistory', {
				bookingDetails : oX
			});
		}

		scope.BOOKING_CANCELLED = PreConfigService.BOOKING_CANCELLED;
		scope.BOOKING_COMPLETED_N_CLOSED = PreConfigService.BOOKING_COMPLETED_N_CLOSED;
		scope.BOOKING_CANCELLED_ON_CALL = PreConfigService.BOOKING_CANCELLED_ON_CALL;

		scope.gridCustomerBookingOptions = {
			data: 'bookingHistoryDetails',
			rowHeight: 25,
			columnDefs: [{
				field: 'srno',
				displayName: '#',
				width : 30,
				visible: false
			}, {
				field: 'bookingCode',
				displayName: 'B.Code',
				width: '50'
			},{
				field: 'bookingDisplayDate',
				displayName: 'Booking Dt. & Tm.',
				width: '80'
			},{
				field: 'pickupDisplayDateAndTime',
				displayName: 'Pickup Dt. & Tm.',
				width: '80'
			}, {
				field: 'primaryPassenger',
				displayName: 'Passenger Name',
				width: 110,
				visible: false
			}, {
				field: 'pickupPlace',
				displayName: 'Pickup',
				width: '90'
			}, {
				field: 'dropPlace',
				displayName: 'Drop',
				width: '90'
			}, {
				field: 'subJourneyTypeName',
				displayName: 'J.Type',
				width: '*'
			}, {
				field: 'vehicleDisplayType',
				displayName: 'V. Type',
				width: 60,
				visible: false
			}, {
				field: 'vehicleDisplayName',
				displayName: 'V.Name',
				width: 60
			}, {
				field: 'bookingStatusName',
				displayName: 'St.',
				width: 30
			}, {
				field: 'id',
				displayName: 'id',
				visible: false
			}, { 
				displayName: 'Action',
				width: 90,
				cellTemplate: '<div style="text-align: center;"><button style="margin-top: 4px;" class="btnCompact btn-success" ng-click="fnOpenBookingDetails(row)">{{((row.getProperty(\'bookingStatus\') == BOOKING_COMPLETED_N_CLOSED || row.getProperty(\'bookingStatus\') == BOOKING_CANCELLED || row.getProperty(\'bookingStatus\') == BOOKING_CANCELLED_ON_CALL) ? "Book Again" : "Edit/View" )}}</button></div>'
			}],
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			enableSorting: false,
	      	enableCellSelection : false,
	      	enableRowSelection: false
		};
	});