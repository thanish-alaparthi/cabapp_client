

'use strict';

angular.module('sigmaCabsApp')
	.controller('chkVehicleAvailabilityController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.close = function(){
			dialog.close();
		};

		scope.singleTariffData = [{
				'type': 'Expected Vehicles',
				'small': '4',
				'medium': '11',
				'large': '10',
			}, {
				'type':'While Driving',
				'small': '4',
				'medium': '11',
				'large': '10'
			}, {
				'type':'Bookings Existing',
				'small': '4',
				'medium': '11',
				'large': '10'
			},{
				'type':'Action',
				'small' : 'yes',
				'medium' : 'yes',
				'large' : 'yes',
			}
		];

		/*scope.singleTariffData = [{
			'Expected Vehicles' : {
				'small': '4',
				'medium': '11',
				'large': '10'
			},
			'While Driving' : {
				'small': '4',
				'medium': '11',
				'large': '10'
			}, 
			'Bookings Existing' : {
				'small': '4',
				'medium': '11',
				'large': '10'
			}, 
			'Action': {
				'small' : 'yes',
				'medium' : 'yes',
				'large' : 'yes',
			}
		}];*/

		scope.singleTariffData = scope.singleTariffData;
		for(var key in scope.singleTariffData ){
			scope.singleTariffData[key]['vehilce'] = key;
		}

		console.log(scope.singleTariffData)

		scope.singleTariffGridOptions = {
			data: 'singleTariffData',
			rowHeight: 25,
			columnDefs: [{
				field: 'type',
				displayName: 'Type'
			},{
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