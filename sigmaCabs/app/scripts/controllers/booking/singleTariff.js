
/*
Name: ChatController
Description: Adds first time customer
Date: 26Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('singleTariffController', function($scope,oBooking, oCustomer, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

        var scope = $scope;


		console.log('in singleTariffController oBooking,oCustomer',oBooking,oCustomer);

        scope.customerDetails = oCustomer;

        scope.selectedJourneyType = PrerequisiteService.fnGetMainJourneyTypeObjectBySubJourneyTypeId(oBooking.subJourneyType);
        scope.selectedSubJourneyType = PrerequisiteService.fnGetJourneyObjectById(oBooking.subJourneyType);

        scope.selectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(oBooking.vehicleType);
        scope.selectedVehicleName = PrerequisiteService.fnGetVehicleNameById(oBooking.vehicleName);
        console.log('scope.selectedVehicleName', scope.selectedVehicleName);

        scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();

        scope.roData = {};

        scope.roData.vehicleType = scope.selectedVehicleType.vehicleType;
        scope.roData.vehicleName = scope.selectedVehicleName ? scope.selectedVehicleName.vehicleName : 'Any-Vehicle';
        scope.roData.journeyTypeName = scope.selectedJourneyType.journeyType;
        scope.roData.subJourneyTypeName = scope.selectedSubJourneyType.journeyType;
        scope.roData.pickupPlace = oBooking.pickupPlace;
        scope.roData.dropPlace = oBooking.dropPlace;
        scope.roData.pickupDate = PrerequisiteService.fnFormatDate(oBooking.pickuDate);
        scope.roData.pickupTime = oBooking.pickupTime;

        scope.roData.duration = '';
        scope.roData.km = '';
        scope.roData.amount = '';
        scope.roData.extraKmCharge = '';
        scope.roData.graceTime = '';
        scope.roData.extraCharges = '';
        scope.roData.extraHourCharge = '';
        scope.roData.comments = '';
        
        scope.roData.discount = '';        
        scope.roData.customerGrade = '';
        scope.roData.customerCategory = '';

        scope.close = function() {
			dialog.close();
		};

		scope.selctedTariffType = {};


		$scope.fnEditCell = function (row, cell, columnSelected, col){

			var tariffObj = row['tariffObj_' + columnSelected];
			console.log('Selected Package: ', tariffObj);


			// check if vehicleType match with tariffDetails and bookingDetails
			if(tariffObj.vehicleType != oBooking.vehicleType) {
				alert('Tariff vehicle Type mis-match with that of booking details. \n\nPlease select '+ scope.selectedVehicleType.vehicleType + ' tariff plan.');
				return;
			}

			angular.copy(tariffObj, scope.selctedTariffType);

			//set the readonly Fields
			scope.roData.duration = tariffObj.duration;
	        scope.roData.km = tariffObj.kms;
	        scope.roData.amount = tariffObj.price;
	        scope.roData.extraKmCharge = tariffObj.extraKmPrice;
	        scope.roData.graceTime = tariffObj.graceTime;
	        scope.roData.extraCharges = tariffObj.extraCharge;
	        scope.roData.extraHourCharge = tariffObj.extraHrPrice;
	        scope.roData.comments = tariffObj.comments;
	    };
	    
	    $scope.updateCell = function(){
	        $scope.selectedRow[$scope.selectedColumn] = $scope.selectedCell;
	    };
	    
	    $scope.selectedCell;
	    $scope.selectedRow;
	    $scope.selectedColumn;
	    
	    var basicCellTemplate = '<div class="ngCellText" ng-class="col.colIndex();" ng-click="fnEditCell(row.entity, row.getProperty(col.field), col.field, col);"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	    
	    scope.tariffData = PrerequisiteService.fnGetTariffByVehicleType(scope.selectedJourneyType.id);

	    console.log('tariffData: >>>>',scope.tariffData);

	    var fieldName, keyValue, cellObj, objName = 'Obj';
	    scope.oDataForTariffGrid = [];

	    var sTmpDuration = '',
	    	sTmpKms = '';

	    $scope.colDefs = [
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'kms', displayName:'Kms', width: '*'}
	    ];
	    /* Add dynamic Columns */
	    for(var i=0;i<scope.vehicleTypes.length;i++){
	    	$scope.colDefs.push({
	    		field : 'vehicleType' + scope.vehicleTypes[i].id,
	    		displayName : scope.vehicleTypes[i].vehicleType,
	    		width: '*',
	    		cellTemplate: basicCellTemplate
	    	});
	    }
	    /* EOF dynamic Columns */

	    scope.fnConfirmTariffAndExit = function(){
	    	var oT = {
    			vehicleType : scope.selectedVehicleType.vehicleType,
    			vehicleName : scope.selectedVehicleName ? scope.selectedVehicleName.vehicleName : 'Any-Vehicle',
    			duration : scope.selctedTariffType.duration,
    			distance : scope.selctedTariffType.kms,
    			amount : scope.selctedTariffType.price,
    			extraKm : scope.selctedTariffType.extraKmPrice,
    			graceTime : scope.selctedTariffType.graceTime,
    			extraHour : scope.selctedTariffType.extraHrPrice,
    			extraCharges : scope.selctedTariffType.extraCharges,
    			comments : scope.selctedTariffType.comments,
    			id: scope.selctedTariffType.id
    		};
	    	$rootScope.$emit('eventSingleTariffSelected', {
	    		tariffId : oT.id,
	    		tariffDetails: oT
	    	});

	    	scope.close();
	    };


	    
	    $scope.gridCityPkgOptions = { 
	      data: 'tariffData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	      enableCellSelection : true
	    };

    });