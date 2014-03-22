/*
Name: ChatController
Description: Adds first time customer
Date: 26Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingStatisticsController', function($scope, PrerequisiteService, BookingService, CustomerService, $rootScope, $timeout, URLService, $dialog, VehiclesService) {

	var scope = $scope,
		oBooking = scope.bookingDetails;

	console.log('in bookingStatisticsController >>>>>>>>>>>>>>>>>>>>>> bookingDetails: ',oBooking);
	
	scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
        var sCellTemplateHtml = '<div class="ngCellText" style="{{ (row.entity[\'type\'] == \'Color Code\' ? \'background-color:\' + row.getProperty(col.field) : \'\') }}{{ (row.entity[\'type\'] == \'total\' ? \'font-weight: bold;\' : \'\') }}" ng-class="col.colIndex()">{{row.entity[\'type\'] == \'Color Code\' && col.field !=\'type\' ? \'\' :row.getProperty(col.field)}}</div>',
        	sCellTemplateHtmlForReserve = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="fnEditCell(row.entity, row.getProperty(col.field), col.field, col,col.field + \'_color\' + col.id + row.getProperty(col.field));">{{row.getProperty(col.field)}}</div>';

        // by default set the text of the button
        scope.selectedHoursText = "Select Hours";

        scope.fnShowStatistics = function(iHour){
        	scope.selStatisticHour = iHour + ' Hour '
        };

        scope.fnRefreshStatistics = function(iHours) {
			scope.vehicleAvailabilityData = [];

        	console.log('fnRefreshStatistics');
        	var sReqTm = "";

        	if(iHours){	// hour is selected
        		var oD = new Date();
        		oD.setHours(oD.getHours() + iHours);

        		// update the button text for the selected Hours
        		scope.selectedHoursText = iHours + ((iHours === 1) ? ' Hour' : ' Hours');

        		sReqTm = PrerequisiteService.fnFormatDateOnDateObj(oD);
        	} else {
        		if(oBooking){	// from callTaker view
	        		sReqTm = PrerequisiteService.formatToServerDate(oBooking.pickupDate) + ' ' + oBooking.pickupHours + ':' + oBooking.pickupMinutes + ':00';
	        	} else {	// from dispatcher view
	        		sReqTm = PrerequisiteService.formatToServerDate(PrerequisiteService.fnFormatDate()) + ' ' + PrerequisiteService.fnFormatHours() +':' +  PrerequisiteService.fnFormatMinutes() +':00';
	        	}
        	}        	
        	console.log('sReqTm: ' + sReqTm)
        	// get the vehicleAvailablity
			VehiclesService.fnGetAvailableVehicles({
				requestTime : sReqTm
			})
			.success(function(data, status,fnHeaders, oXhr, config){
				console.log('success fnGetAvailableVehicles: ', data);
				if(data.status == 200){
					var oD = PrerequisiteService.fnFormatVehicleAvailabilityData(data.result.summary, (oBooking ? oBooking.vehicleType :''));
					scope.vehicleAvailabilityData = oD['summary'];
					
				} else {
					alert('There was some error in getting vehicle availablility.');
				}
				// scope.bReservation = true;
			})
			.error(function(data, status,fnHeaders, oXhr, config){
				console.log('error fnGetAvailableVehicles: ', data);
			});
        };

        scope.fnRefreshStatistics();


		// build column heads
		scope.availableVehicleGridColumnHeads = [
	        {field:'type', displayName:'Type', width: '*', cellTemplate: sCellTemplateHtml}
	    ];
	    scope.reserveGridColumnHeads = [];
	    /* Add dynamic Columns */
	    for(var i=0;i<scope.vehicleTypes.length;i++){
	    	$scope.availableVehicleGridColumnHeads.push({
	    		field : 'vehicleType' + scope.vehicleTypes[i].id,
	    		displayName : scope.vehicleTypes[i].vehicleType,
	    		width: '*',
	    		cellTemplate: sCellTemplateHtml
	    	});

	    	scope.reserveGridColumnHeads.push({
	    		field : 'vehicleType' + scope.vehicleTypes[i].id,
	    		displayName : scope.vehicleTypes[i].vehicleType,
	    		width: '*',
	    		cellTemplate: sCellTemplateHtmlForReserve
	    	});
	    }
	    /* EOF dynamic Columns */

		scope.gridStatisticsData = {
			data: 'vehicleAvailabilityData',
			rowHeight: 25,			
			multiSelect: false,
			enableSorting: false,
			enableCellSelection : false,
   	      	enableRowSelection: false,
			columnDefs: 'availableVehicleGridColumnHeads'
		};


		$rootScope.$on('eventRefreshStats', function() {
			console.log('in eventRefreshStats');
			scope.fnRefreshStatistics();
		});

});