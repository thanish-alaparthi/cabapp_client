

'use strict';

angular.module('sigmaCabsApp')
	.controller('chkVehicleAvailabilityController', function(oBooking, oCustomer, $scope, PrerequisiteService, PreConfigService, VehiclesService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside chkVehicleAvailabilityController', oBooking);

		scope.bReservation = false;
		scope.sState = "";

		scope.resVehicleId = null;

		scope.customerDetails = oCustomer;

		scope.selectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(oBooking.vehicleType);
        scope.selectedVehicleName = PrerequisiteService.fnGetVehicleNameById(oBooking.vehicleName);
        
		scope.fnFormatVehiclesDataForReserve = function(oData){
			var aRtn = [],
				oVt = PrerequisiteService.fnGetVehicleTypes(),
				iVtCount = oVt.length,
				iMaxCount = 0;
			// check which vehicleType has the highest length in info, so we hav to iterate only dat many times.
			for(var i=0;i<iVtCount;i++){
				var iC = oData[i].info.length;
				if(iC > iMaxCount){
					iMaxCount = iC;
				}
			}
			console.log('Max',iMaxCount);
			for(var i=0;i<iMaxCount;i++) {
				var oRow = {};				
				for(var j=0;j<iVtCount;j++){
					if(oData[j].info[i]){
						oRow['vehicleType_'+ oData[j].type] = oData[j].info[i].vehicleCode;
						oRow['vehicleObj_vehicleType_'+ oData[j].type] = oData[j].info[i];
						oRow['vehicleType_' + oData[j].type + '_color'] = '#D6D6D6';
					} else {
						oRow['vehicleType_'+ oData[j].type] = '-'
					}
				}
				aRtn.push(oRow);
			}
			console.log('reserve Data', aRtn);
			return aRtn;
		};


		// get the vehicleAvailablity
		VehiclesService.fnGetAvailableVehicles({
			requestTime : PrerequisiteService.formatToServerDate(oBooking.pickupDate) + ' ' + oBooking.pickupHours + ':' + oBooking.pickupMinutes + ':00',
			vehicleType : oBooking.vehicleType,
			vehicleName : oBooking.vehicleName,
			subJourneyType : oBooking.subJourneyType			
		})
		.success(function(data, status,fnHeaders, oXhr, config){
			console.log('success fnGetAvailableVehicles: ', data);
			if(data.status == 200){
				if(!data.result.length && !data.result.summary ){
					alert('There are no vehicles for this booking timings.');
					return;
				}


				var oD = PrerequisiteService.fnFormatVehicleAvailabilityData(data.result.summary, oBooking.vehicleType);
				scope.vehicleAvailabilityData = oD['summary'];
				scope.sColor = {background: oD['color']};
				switch(oD['color']){
					case PreConfigService.VEHICLE_AVAILABLE_COLOR :
						scope.sState = "Available";
					break;
					case PreConfigService.VEHICLE_PROBABLILY_AVAILABLE_COLOR :
						scope.sState = "Probably-Available"
					break;
					case PreConfigService.VEHICLE_NOT_AVAILABLE_COLOR :
						scope.sState = "Not-Available";
					break;
					default:
						scope.sState = "";
					break;
				}

				if(data.result.reserve) {
					scope.tariffVehiclesList = scope.fnFormatVehiclesDataForReserve(data.result.details);
				} else {
					scope.tariffVehiclesList = [];
				}

				scope.bReservation = data.result.reserve;

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

        $scope.fnEditCell = function (row, cell, columnSelected, col, cellId){
			console.log('@@@@@@@@', cellId, columnSelected, row);
			var oV = row['vehicleObj_' + columnSelected];
			console.log('Selected Package: ', oV);

			if(!oV){
				alert('Please select a valid vehicle.');
				return;
			}

			// check if vehicleType match with tariffDetails and bookingDetails
			if(oV.vehicleType && oV.vehicleType != oBooking.vehicleType) {
				alert('Vehicle Type mis-match with that of booking details. \n\nPlease select '+ scope.selectedVehicleType.vehicleType + ' vehicle.');
				return;
			}

			// need to check for a better way of doing this.
			$('.myTariffSelected').removeClass('myTariffSelected');
			$('#' + cellId).addClass('myTariffSelected');


			scope.resVehicleId = oV.vehicleId;

	    };


        var sCellTemplateHtml = '<div class="ngCellText" style="{{ (row.entity[\'type\'] == \'Color Code\' ? \'background-color:\' + row.getProperty(col.field) : \'\') }}{{ (row.entity[\'type\'] == \'total\' ? \'font-weight: bold;\' : \'\') }}" ng-class="col.colIndex()">{{row.entity[\'type\'] == \'Color Code\' && col.field !=\'type\' ? \'\' :row.getProperty(col.field)}}</div>',
        	sCellTemplateHtmlForReserve = '<div id="{{col.field + \'_color\' + col.id + row.getProperty(col.field)}}"  class="ngCellText" ng-class="col.colIndex()" ng-style="{ \'background-color\': row.getProperty(col.field + \'_color\') }"  ng-click="fnEditCell(row.entity, row.getProperty(col.field), col.field, col,col.field + \'_color\' + col.id + row.getProperty(col.field));">{{row.getProperty(col.field)}}</div>';


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
	    		field : 'vehicleType_' + scope.vehicleTypes[i].id,
	    		displayName : scope.vehicleTypes[i].vehicleType,
	    		width: '*',
	    		cellTemplate: sCellTemplateHtmlForReserve
	    	});
	    }
	    /* EOF dynamic Columns */

		scope.vehicleAvailabilityGridOptions = {
			data: 'vehicleAvailabilityData',
			rowHeight: 25,			
			multiSelect: false,
	      	enableCellSelection : false,
	      	enableRowSelection: false,
	      	enableSorting: false,
			columnDefs: 'availableVehicleGridColumnHeads'
		};

		scope.tariffVehiclesList = [];

		scope.tariffVehiclesGridOptions = {
			data: 'tariffVehiclesList',
			rowHeight: 25,
			columnDefs: 'reserveGridColumnHeads',
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			enableSorting: false,
	      	enableCellSelection : false,
	      	enableRowSelection: false,
			totalServerItems: 'totalServerItems',
			afterSelectionChange: function(oRow) {
				// console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};

		scope.fnReserveAndClose = function() {
			if(!scope.resVehicleId) {
				alert('Please select a vehicle to reserve for the booking.');
				return;
			}

			$rootScope.$emit('eventVehicleReserved', {
				resVehicleId : scope.resVehicleId
			});


			scope.close();
		}
	});