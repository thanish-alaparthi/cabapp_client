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

		//attach safeApply
        $scope.safeApply = function(fn) {
          var phase = this.$root.$$phase;
          if(phase == '$apply' || phase == '$digest') {
            if(fn && (typeof(fn) === 'function')) {
              fn();
            }
          } else {
            this.$apply(fn);
          }
        };

        scope.aData = [];
		// scope.aData = [{
		// 	vehicleType: 'small',
		// 	vehicleName: 'small',
		// 	duration: 'small',
		// 	amount: 'small',
		// 	extraKm: 'small',
		// 	graceTime: 'small',
		// 	extraHour: 'small',
		// 	extraCharges: 'small',
		// 	comments: 'small'
		// }, {
		// 	vehicleType: 'small',
		// 	vehicleName: 'small',
		// 	duration: 'small',
		// 	amount: 'small',
		// 	extraKm: 'small',
		// 	graceTime: 'small',
		// 	extraHour: 'small',
		// 	extraCharges: 'small',
		// 	comments: 'small'
		// }, {
		// 	vehicleType: 'small',
		// 	vehicleName: 'small',
		// 	duration: 'small',
		// 	amount: 'small',
		// 	extraKm: 'small',
		// 	graceTime: 'small',
		// 	extraHour: 'small',
		// 	extraCharges: 'small',
		// 	comments: 'small'
		// }, {
		// 	vehicleType: 'small',
		// 	vehicleName: 'small',
		// 	duration: 'small',
		// 	amount: 'small',
		// 	extraKm: 'small',
		// 	graceTime: 'small',
		// 	extraHour: 'small',
		// 	extraCharges: 'small',
		// 	comments: 'small'
		// }, {
		// 	vehicleType: 'small',
		// 	vehicleName: 'small',
		// 	duration: 'small',
		// 	amount: 'small',
		// 	extraKm: 'small',
		// 	graceTime: 'small',
		// 	extraHour: 'small',
		// 	extraCharges: 'small',
		// 	comments: 'small'
		// }];
	  
	    scope.colDefs = [
	       	{field:'vehicleType', displayName:'Type', width: '80'},
	        {field:'vehicleName', displayName:'Name', width: '100'},
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'distance', displayName:'Distance', width: '*'},
	        {field:'amount', displayName:'Amount', width: '*'},
	        {field:'extraKm', displayName:'Extra K.M.', width: '*'},
	        {field:'graceTime', displayName:'Grace Time', width: '*'},
	        {field:'extraHour', displayName:'Extra Hour', width: '*'},
	        {field:'extraCharges', displayName:'Extra Charges', width: '*'},
	        {field:'comments', displayName:'Comments', width: '500'},
	        {field:'id', displayName:'Id',display:false, width: '*'}
	    ];

	    scope.gridBookingTariffOptions = { 
	      data: 'aData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	    };

	    scope.$watch('tariffGridData', function(newVal, oldVal){
	    	console.log('>>>>>scope.tariffGridData changed', newVal);
	    	if(newVal){
	    		scope.aData = [newVal];
	    	}
	    });
	});