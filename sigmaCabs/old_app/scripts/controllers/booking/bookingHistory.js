/*
Name: BookingHistory
Description: Adds first time customer
Date: 12Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingHistory', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog) {

		var scope = $scope;


		scope.fnScopeTellAngular = function() {
			//need to put this logic in directive
			var g = $('#topContainerID').height();
			console.log($(window).height() , g ,160);
			$('#customerBookingGridID').height($(window).height() - g - 160);
		}
		
		window.onresize = scope.fnScopeTellAngular;

		scope.customerBookingTabs = URLService.view('customerBookingTabs');

		// default
		scope.customerBookingGridDetails = [{
			'srno' : '1',
			'tripDate' : '25/03/2014',
			'bookingCode' : 'SCB099900001',
			'customerName' : 'Aswin kumar Chowdary',
			'startTime' : '11:20 PM',
			'pickup' : 'Santosh Nagar',
			'drop' : 'Airport',
			'vehicle' : 'Indica',
			'package' : '400KM 500rs',
			'status' : 'Pending',
			'action' : 'Button Here',
		},{
			'srno' : '2',
			'tripDate' : '25/03/2014',
			'bookingCode' : 'SCB099900001',
			'customerName' : 'Aswin kumar Chowdary',
			'startTime' : '11:20 PM',
			'pickup' : 'Santosh Nagar',
			'drop' : 'Airport',
			'vehicle' : 'Indica',
			'package' : '400KM 500rs',
			'status' : 'Closed',
			'action' : 'Button Here',
		},{
			'srno' : '3',
			'tripDate' : '25/03/2014',
			'bookingCode' : 'SCB099900001',
			'customerName' : 'Aswin kumar Chowdary',
			'startTime' : '11:20 PM',
			'pickup' : 'Santosh Nagar',
			'drop' : 'Airport',
			'vehicle' : 'Indica',
			'package' : '400KM 500rs',
			'status' : 'Closed',
			'action' : 'Button Here',
		},{
			'srno' : '4',
			'tripDate' : '25/03/2014',
			'bookingCode' : 'SCB099900001',
			'customerName' : 'Aswin kumar Chowdary',
			'startTime' : '11:20 PM',
			'pickup' : 'Santosh Nagar',
			'drop' : 'Airport',
			'vehicle' : 'Indica',
			'package' : '400KM 500rs',
			'status' : 'Pending',
			'action' : 'Button Here',
		}];

		$scope.gridCustomerBookingOptions = {
			data: 'customerBookingGridDetails',
			columnDefs: [{
				field: 'srno',
				displayName: '#',
				width : 30
			},{
				field: 'tripDate',
				displayName: 'Trip Date'
			}, {
				field: 'bookingCode',
				displayName: 'Booking#'
			}, {
				field: 'customerName',
				displayName: 'Customer Name'
			}, {
				field: 'startTime',
				displayName: 'Start Time',
				width: 85
			}, {
				field: 'pickup',
				displayName: 'Pickup'
			}, {
				field: 'drop',
				displayName: 'Drop'
			}, {
				field: 'vehicle',
				displayName: 'Vehicle',
				width: 80
			}, {
				field: 'package',
				displayName: 'Package'
			}, {
				field: 'status',
				displayName: 'Status',
				width: 70
			}, {
				displayName: 'Action',
				width: 110,
				cellTemplate: '<div style="text-align: center;"><button ng-show="row.getProperty(\'status\') == \'Pending\' ? true : false" style="margin-top: 4px;" class="btnCompact btn-success">Edit/View</button><button ng-show="row.getProperty(\'status\') == \'Closed\' ? true : false" style="margin-top: 4px;" class="btnCompact btn-success">Add as New</button></div>'
			}],
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			afterSelectionChange: function(oRow) {
				console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};


		scope.fnScopeTellAngular();


	});