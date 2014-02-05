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
		    
	    var basicCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="editCell(row.entity, row.getProperty(col.field), col.field)"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	  
	    $scope.colDefs = [
	       	{field:'vhName', displayName:'Vehicle Name', width: '*'},
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'kms', displayName:'Kms', width: '*'},
	        {field:'price', displayName:'Price', width: '*', cellTemplate: basicCellTemplate},
	        {field:'extraHrPrice', displayName:'Extra Hr Price', width: '*', cellTemplate: basicCellTemplate},
	        {field:'extraKmPrice', displayName:'Extra Km Price', width: '*', cellTemplate: basicCellTemplate},
	    ];

	    $scope.gridBookingTariffOptions = { 
	      data: 'bookingData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	    };
	});