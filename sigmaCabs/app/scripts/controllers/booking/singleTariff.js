
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

        scope.customerDetails = oCustomer;
        scope.selectedTariffTypeName = '';


        scope.selectedJourneyType = PrerequisiteService.fnGetMainJourneyTypeObjectBySubJourneyTypeId(oBooking.subJourneyType);
        scope.selectedSubJourneyType = PrerequisiteService.fnGetJourneyObjectById(oBooking.subJourneyType);


        scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();

        scope.close = function() {
			dialog.close();
		};

		console.log('in singleTariffController oBooking,oCustomer',oBooking,oCustomer);

		$scope.editCell = function (row, cell, column, col){
			console.log('ColIndex::: ',col.colIndex());
	      var cellObj = column + 'Obj';
	      scope.comments = row[cellObj].comments;
	      scope.duration = row[cellObj].duration;
	      scope.extHrPrice = row[cellObj].extraHrPrice;
	      scope.extKmPrice = row[cellObj].extraKmPrice;
	      scope.kms = row[cellObj].kms;
	      scope.price = row[cellObj].price;

	      console.log(column, cellObj, row[cellObj], row);

	      $scope.selectedCell = cell;
	      $scope.selectedRow = row;
	      $scope.selectedColumn = column;
	      var seletedTariffData = row[cellObj];

	      console.log('TariffType  ID: ',row[cellObj].tariffType);
	      scope.selectedTariffTypeId = row[cellObj].tariffType;
	      scope.selectedTariffType = PrerequisiteService.fnGetTariffTypeById(row[cellObj].tariffType);
	      if(scope.selectedTariffType){
	      	scope.selectedTariffTypeName = ' of ' + scope.selectedTariffType.tariffType + '.';
	      }
	    };
	    
	    $scope.updateCell = function(){
	        $scope.selectedRow[$scope.selectedColumn] = $scope.selectedCell;
	    };
	    
	    $scope.selectedCell;
	    $scope.selectedRow;
	    $scope.selectedColumn;
	    
	    var basicCellTemplate = '<div class="ngCellText" ng-class="col.colIndex();" ng-click="editCell(row.entity, row.getProperty(col.field), col.field, col);"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	    
	    scope.tariffData = PrerequisiteService.fnGetTariffByVehicleType(scope.selectedJourneyType.id);

	    var tariffRow = {
	    	'duration': '',
	    	'kms': ''
	    };

	    console.log('SelectedJourneyTypes: ',scope.selectedJourneyType);
	    console.log('tariffData: >>>>',PrerequisiteService.fnGetTariffData());
	    console.log('tariffData: >>>>',scope.tariffData);

	    var fieldName, keyValue, cellObj, objName = 'Obj';
	    scope.oDataForTariffGrid = [];

	    var sTmpDuration = '',
	    	sTmpKms = '';

	    // for(var i=0;i<tariffData.length;i++) {
	    // 	var tariffRow = {
	    // 		'duration': tariffData[i].duration,
	    // 		'kms' : tariffData[i].kms
	    // 	}
	    // 	tariffRow['vehicleType' + tariffData[i].vehicleType] = tariffData[i].price;
	    // 	for(var j=i;j<tariffData.length;j++){
	    // 		if(    tariffData[i].duration == tariffData[j].duration
	    // 			&& tariffData[i].kms == tariffData[j].kms
	    // 		){
	    // 			tariffRow['vehicleType' + tariffData[j].vehicleType] = tariffData[j].price;
	    // 		}
	    // 	}
	    // 	if(sTmpDuration != tariffData[i].duration && sTmpKms != tariffData[i].kms) {
	    // 		scope.oDataForTariffGrid.push(tariffRow);
	    // 		sTmpDuration = tariffData[i].duration;
	    // 		sTmpKms = tariffData[i].kms;
	    // 	}
	    // }

	    // for(var pkgType in tariffData){
	    // 	var catType = tariffData[pkgType];
	    // 	var cellObj = catType;
	    // 	for(var keyName in catType){
	    // 		if(tariffRow[keyName] != undefined){
	    // 			tariffRow[keyName] = catType[keyName];
	    // 		}
	    // 		if(keyName == 'tariffType'){
	    // 			fieldName = keyName + catType[keyName] ;
	    // 			tariffRow[fieldName] = '';
	    // 			tariffRow[fieldName + objName] = cellObj;

	    // 		}

	    // 		if(keyName == 'price'){
	    // 			tariffRow[fieldName] = catType[keyName];
	    // 		}
	    // 	}	    	
	    // }
	    

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
	    	$rootScope.$emit('eventSingleTariffSelected', {
	    		tariffId : scope.selectedTariffTypeId
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