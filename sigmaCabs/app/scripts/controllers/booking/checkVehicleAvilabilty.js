

'use strict';

angular.module('sigmaCabsApp')
	.controller('chkVehicleAvailabilityController', function(oBooking, oCustomer, $scope, PrerequisiteService, VehiclesService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside chkVehicleAvailabilityController', oBooking);

		scope.bReservation = false;

		// get the vehicleAvailablity
		VehiclesService.fnGetAvailableVehicles({
			requestTime : PrerequisiteService.formatToServerDate(oBooking.pickupDate) + ' ' + oBooking.pickupHours + ':' + oBooking.pickupMinutes + ':00',
			vehicleType : oBooking.vehicleType,
			vehicleName : oBooking.vehicleName,
			subJourneyType : oBooking.subJourneyType,
			
		})
		.success(function(data, status,fnHeaders, oXhr, config){
			console.log('success fnGetAvailableVehicles: ', data);
			if(data.status == 200){
				scope.bReservation = data.result[0].reserve;
			} else {
				alert('There was some error in getting vehicle availablility.');
			}
			// scope.bReservation = true;
		})
		.error(function(data, status,fnHeaders, oXhr, config){
			console.log('error fnGetAvailableVehicles: ', data);
		});

		scope.close = function(){
			dialog.close();
		};

        scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();


        var sCellTemplateHtml = '<div class="ngCellText" style="{{ (row.entity[\'type\'] == \'Color Code\' ? \'background-color:\' + row.getProperty(col.field) : \'\') }}{{ (row.entity[\'type\'] == \'Total\' ? \'font-weight: bold;\' : \'\') }}" ng-class="col.colIndex()">{{row.entity[\'type\'] == \'Color Code\' && col.field !=\'type\' ? \'\' :row.getProperty(col.field)}}</div>';


		// build column heads
		$scope.availableVehicleGridColumnHeads = [
	        {field:'type', displayName:'Type', width: '*', cellTemplate: sCellTemplateHtml}
	    ];
	    /* Add dynamic Columns */
	    for(var i=0;i<scope.vehicleTypes.length;i++){
	    	$scope.availableVehicleGridColumnHeads.push({
	    		field : 'vehicleType' + scope.vehicleTypes[i].id,
	    		displayName : scope.vehicleTypes[i].vehicleType,
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

		scope.vehicleAvailabilityGridOptions = {
			data: 'vehicleAvailabilityData',
			rowHeight: 25,			
			multiSelect: false,
			columnDefs: 'availableVehicleGridColumnHeads'
		};

		scope.tariffVehiclesList = [{
				'small': 'SC-111',
				'medium': 'SC-111',
				'large': 'SC-111',
			}, {
				'small': 'SC-111',
				'medium': 'SC-111',
				'large': 'SC-111'
			}, {
				'small': 'SC-111',
				'medium': 'SC-111',
				'large': 'SC-111'
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			},{
				'small' : 'SC-111',
				'medium' : 'SC-111',
				'large' : 'SC-111',
			}
		];


		scope.tariffVehiclesGridOptions = {
			data: 'tariffVehiclesList',
			rowHeight: 25,
			columnDefs: [{
				field: 'small',
				displayName: 'Small'
			}, {
				field: 'medium',
				displayName: 'Medium'
			}, {
				field: 'large',
				displayName: 'Large'
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