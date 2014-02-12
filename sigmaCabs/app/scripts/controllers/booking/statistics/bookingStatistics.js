/*
Name: ChatController
Description: Adds first time customer
Date: 26Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingStatisticsController', function($scope, PrerequisiteService, BookingService, CustomerService, $rootScope, URLService, $dialog) {

	var scope = $scope;
	scope.bookingStatistics = URLService.view('bookingStatistics');
	// scope.statisticsData = PrerequisiteService.fnGetStatistics();
	scope.statisticsGridData = [];
	for(var key in scope.statisticsData ){
		scope.statisticsData[key]['vehilce'] = PrerequisiteService.fnGetVehicleNameById(key).vehicleName;
		scope.statisticsGridData.push(scope.statisticsData[key]);
	}

	console.log(scope.statisticsGridData);
	
	scope.gridStatisticsData = {
		data: 'statisticsGridData',
		rowHeight: 25,
		columnDefs: [{
			field: 'vehilce',
			displayName: 'Vehicle'
		},{
			field: 'Available',
			displayName: 'Available'
		}, {
			field: 'Booking',
			displayName: 'Booking'
		}, {
			field: 'Expected',
			displayName: 'Expected'
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