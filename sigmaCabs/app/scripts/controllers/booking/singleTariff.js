
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

        scope.tariffTypes = PrerequisiteService.fnGetTariffTypes();

        scope.selectedJourneyType = PrerequisiteService.fnGetMainJourneyTypeObjectBySubJourneyTypeId(oBooking.subJourneyType);
        scope.selectedSubJourneyType = PrerequisiteService.fnGetJourneyObjectById(oBooking.subJourneyType);

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
	    
	    var tariffData = PrerequisiteService.fnGetTariffData()[1];
	    var tariffRow = {
	    	'duration': '',
	    	'kms': ''
	    };

	    var fieldName, keyValue, cellObj, objName = 'Obj';

	    for(var pkgType in tariffData){
	    	var catType = tariffData[pkgType];
	    	var cellObj = catType;
	    	for(var keyName in catType){
	    		if(tariffRow[keyName] != undefined){
	    			tariffRow[keyName] = catType[keyName];
	    		}
	    		if(keyName == 'tariffType'){
	    			fieldName = keyName + catType[keyName] ;
	    			tariffRow[fieldName] = '';
	    			tariffRow[fieldName + objName] = cellObj;

	    		}

	    		if(keyName == 'price'){
	    			tariffRow[fieldName] = catType[keyName];
	    		}
	    	}	    	
	    }

	    $scope.colDefs = [
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'kms', displayName:'Kms', width: '*'}
	    ];
	    /* Add dynamic Columns */
	    for(var i=0;i<scope.tariffTypes.length;i++){
	    	$scope.colDefs.push({
	    		field : 'tariffType' + scope.tariffTypes[i].id,
	    		displayName : scope.tariffTypes[i].tariffType,
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


	    
	    $scope.myData = [tariffRow];
	    $scope.gridCityPkgOptions = { 
	      data: 'myData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	      enableCellSelection : true
	    };

    });