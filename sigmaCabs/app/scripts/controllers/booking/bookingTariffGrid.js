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
	  
	    scope.colDefs = [
	       	{field:'vehicleType', displayName:'V.Type', width: '80'},
	        {field:'vehicleName', displayName:'V.Name', width: '100'},
	        {field:'duration', displayName:'Package', width: '*'},
	        {field:'distance', displayName:'Min. KMs.', width: '*'},
	        {field:'amount', displayName:'Amount', width: '*'},
	        {field:'extraKm', displayName:'Extra K.M.', width: '*'},
	        {field:'graceTime', displayName:'Grace Tm.', width: '*'},
	        {field:'extraCharges1', displayName:'Extra Charges', width: '*', cellFilter: 'number'},
	        {field:'extraHour', displayName:'Extra Hours', width: '*'},
	        {field:'driverBatha', displayName:'Driver Batha', width: '*'},
	        {field:'comments', displayName:'Comments', width: '380'},
	        {field:'id', displayName:'Id',visible:false, width: '*'}
	    ];

	    scope.gridBookingTariffOptions = { 
	      data: 'aData',
	      multiSelect: false,
	      enableRowSelection: false,
	      columnDefs: 'colDefs',
	    };

	    var oEventTarfDataChngd = $rootScope.$on('eventTariffGridDataChanged', function(oEvent, oData){
	    	console.log('>>>>>scope.tariffGridData changed', arguments);
	    	// scope.tariffGridData = oData;	
	    	if(oData){
	    		scope.aData = [oData];
	    	} else {
	    		scope.aData = [];
	    	}

	    	$(window).resize();
	    });


	    scope.$on('$destroy', function () {
            console.log('destroying bookingTariffGrid');
            oEventTarfDataChngd();
        });
	});