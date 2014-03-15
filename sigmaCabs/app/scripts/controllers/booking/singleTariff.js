
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
        scope.selectedSubJourneyType = PrerequisiteService.fnGetSubJourneyObjectById(oBooking.subJourneyType);

        scope.selectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(oBooking.vehicleType);
        scope.selectedVehicleName = PrerequisiteService.fnGetVehicleNameById(oBooking.vehicleName);
        console.log('scope.selectedVehicleName', scope.selectedVehicleName);

        scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();

        scope.roData = {};

        scope.roData.vehicleType = scope.selectedVehicleType.vehicleType;
        scope.roData.vehicleName = scope.selectedVehicleName ? scope.selectedVehicleName.vehicleName : '';
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
        
        scope.roData.discount = oCustomer.discount || 0;        
        scope.roData.customerGrade = oCustomer.grade ?  PrerequisiteService.fnGetGradeById(oCustomer.grade)['grade'] : "" ;
        scope.roData.customerCategory = oCustomer.category ? PrerequisiteService.fnGetCustomerCategoryById(oCustomer.category)['categoryName'] : "";

        scope.close = function() {
			dialog.close();
		};

		scope.selctedTariffType = {};


		$scope.fnEditCell = function (row, cell, columnSelected, col, cellId, t){
			console.log('@@@@@@@@', cellId, $('#' + cellId), t);
			var tariffObj = row['tariffObj_' + columnSelected];
			console.log('Selected Package: ', tariffObj);


			// check if vehicleType match with tariffDetails and bookingDetails
			if(tariffObj.vehicleType != oBooking.vehicleType) {
				alert('Tariff vehicle Type mis-match with that of booking details. \n\nPlease select '+ scope.selectedVehicleType.vehicleType + ' tariff plan.');
				return;
			}

			// need to check for a better way of doing this.
			$('.myTariffSelected').removeClass('myTariffSelected');
			$('#' + cellId).addClass('myTariffSelected');
			

			angular.copy(tariffObj, scope.selctedTariffType);

			//set the readonly Fields
			scope.roData.duration = tariffObj.duration / 60;
	        scope.roData.km = tariffObj.kms || 0;
	        scope.roData.amount = tariffObj.price || 0;
	        scope.roData.extraKmCharge = tariffObj.extraKmPrice || 0;
	        scope.roData.graceTime = tariffObj.grace || 0;
	        scope.roData.extraCharges = tariffObj.extraCharges || 0;
	        scope.roData.extraHourCharge = tariffObj.extraHrPrice || 0;
	        scope.roData.comments = tariffObj.comments || '-';
	    };
	    
	    $scope.updateCell = function(){
	        $scope.selectedRow[$scope.selectedColumn] = $scope.selectedCell;
	    };
	    
	    $scope.selectedCell;
	    $scope.selectedRow;
	    $scope.selectedColumn;
	    
	    var basicCellTemplate = '<div id="{{row.getProperty(\'vt_\' + col.field)}}"  class="ngCellText col3 colt3" ng-style="{ \'background-color\': row.getProperty(col.field + \'_color\') }"  ng-class="{myHoverClass: row.getProperty(col.field + \'_colorClass\')}" ng-click="fnEditCell(row.entity, row.getProperty(col.field), col.field, col,row.getProperty(\'vt_\' + col.field), col );"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	    

        scope.fnColorRows = function(oData){
            for(var i=0;i<oData.length;i++){
                oData[i]['vehicleType' + oBooking.vehicleType + '_color'] = '#D6D6D6';
                oData[i]['vehicleType' + oBooking.vehicleType + '_colorClass'] = 'true';
            }
            return oData;
        }

        var oX = [];
        angular.copy(PrerequisiteService.fnGetTariffByVehicleType(scope.selectedJourneyType.id), oX);
	    scope.tariffData = scope.fnColorRows(oX);

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
    			vehicleName : scope.selectedVehicleName ? scope.selectedVehicleName.vehicleName : '',
    			duration : (scope.selctedTariffType.duration / 60),
    			distance : scope.selctedTariffType.kms,
    			amount : scope.selctedTariffType.price,
    			extraKm : scope.selctedTariffType.extraKmPrice,
    			graceTime : scope.selctedTariffType.grace,
    			extraHour : scope.selctedTariffType.extraHrPrice,
    			extraCharges : scope.selctedTariffType.extraCharges,
    			comments : scope.selctedTariffType.comments,
    			id: scope.selctedTariffType.id
    		};
	    	$rootScope.$emit('eventSingleTariffSelected', {
	    		tariffId : oT.id,
	    		tariffDetails: oT
	    	});
	    	$rootScope.$emit('eventChangeSubJourneyType', {
	    		subJourneyType : scope.selctedTariffType.subJourneyType
	    	});

	    	scope.close();
	    };


	    
	    $scope.gridCityPkgOptions = { 
	      data: 'tariffData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	      enableCellSelection : false,
	      enableRowSelection: false,
			afterSelectionChange: function () {
		      console.log('grid>>>>>>>>>>>>>>>', arguments);
		    }
	    };

    });