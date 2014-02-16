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
	
	scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();


        var sCellTemplateHtml = '<div class="ngCellText" style="{{ (row.entity[\'type\'] == \'Color Code\' ? \'background-color:\' + row.getProperty(col.field) : \'\') }}{{ (row.entity[\'type\'] == \'Total\' ? \'font-weight: bold;\' : \'\') }}" ng-class="col.colIndex()">{{row.entity[\'type\'] == \'Color Code\' && col.field !=\'type\' ? \'\' :row.getProperty(col.field)}}</div>';


		// build column heads
		$scope.availableVehicleGridColumnHeads = [
	        {field:'type', displayName:'Type', width: '80', cellTemplate: sCellTemplateHtml}
	    ];
	    /* Add dynamic Columns */
	    for(var i=0;i<scope.vehicleTypes.length;i++){
	    	var sDn = scope.vehicleTypes[i].vehicleType;
	    	if(scope.vehicleTypes[i].id == '2'){
	    		sDn = 'Verito';
	    	} else if(scope.vehicleTypes[i].id == '4'){
	    		sDn = 'Innova';
	    	}
	    	$scope.availableVehicleGridColumnHeads.push({
	    		field : 'vehicleType' + scope.vehicleTypes[i].id,
	    		displayName : sDn,
	    		width: '*',
	    		cellTemplate: sCellTemplateHtml
	    	});
	    }
	    /* EOF dynamic Columns */

	    scope.vehicleAvailabilityData = [{
	    	'type' : 'Vehicle Available',
	    	'vehicleType1' : '10',
	    	'vehicleType2' : '7',
	    	'vehicleType3' : '78',
	    	'vehicleType4' : '89'
	    }, {
	    	'type' : 'While Driving',
	    	'vehicleType1' : '29',
	    	'vehicleType2' : '54',
	    	'vehicleType3' : '87',
	    	'vehicleType4' : '22'
	    }, {
	    	'type' : 'Total',
	    	'vehicleType1' : '39',
	    	'vehicleType2' : '61',
	    	'vehicleType3' : '165',
	    	'vehicleType4' : '111'
	    }, {
	    	'type' : 'Bookings',
	    	'vehicleType1' : '39',
	    	'vehicleType2' : '61',
	    	'vehicleType3' : '165',
	    	'vehicleType4' : '111'
	    }, {
	    	'type' : 'Color Code',
	    	'vehicleType1' : '#ff0',
	    	'vehicleType2' : '#CCC',
	    	'vehicleType3' : '#F00',
	    	'vehicleType4' : '#0AF5FF'
	    }];

		scope.gridStatisticsData = {
			data: 'vehicleAvailabilityData',
			rowHeight: 25,			
			multiSelect: false,
			columnDefs: 'availableVehicleGridColumnHeads'
		};

});