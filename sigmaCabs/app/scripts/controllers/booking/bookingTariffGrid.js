/*
Name: BookingHistory
Description: Adds first time customer
Date: 12Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingTariffGrid', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog) {
		var scope = $scope;
		scope.bookingData = [];

		scope.$on('getBookingData', function(event, data){
			if(scope.bookingData.length != 5){
				scope.bookingData.push(data);
	    		$scope.gridBookingTariffOptions.columnDefs = $scope.colDefs;
			}
	    });
		    
	    // var basicCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="editCell(row.entity, row.getProperty(col.field), col.field)"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	  
	    $scope.colDefs = [
	       	{field:'vehicleType', displayName:'Type', width: '80'},
	        {field:'vehicleName', displayName:'Name', width: '100'},
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'distance', displayName:'Distance', width: '*'},
	        {field:'amount', displayName:'Amount', width: '*'},
	        {field:'extraKm', displayName:'Extra K.M.', width: '*'},
	        {field:'graceTime', displayName:'Grace Time', width: '*'},
	        {field:'extraHour', displayName:'Extra Hour', width: '*'},
	        {field:'extraCharges', displayName:'Extra Charges', width: '*'},
	        {field:'comments', displayName:'Comments', width: '500'}
	    ];

	    $scope.gridBookingTariffOptions = { 
	      data: 'bookingData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	    };
	});