
/*
Name: ChatController
Description: Adds first time customer
Date: 26Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('singleTariffController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

        var scope = $scope;

        scope.close = function() {
			dialog.close();
		};

		$scope.editCell = function (row, cell, column){
	      var cellObj = column + 'Obj';
	      //console.log(column);
	      //console.log(row);
	      //console.log(cellObj);
	      scope.comments = row[cellObj].comments;
	      scope.duration = row[cellObj].duration;
	      scope.extHrPrice = row[cellObj].extraHrPrice;
	      scope.extKmPrice = row[cellObj].extraKmPrice;
	      scope.kms = row[cellObj].kms;
	      scope.price = row[cellObj].price;

	      console.log(row[cellObj]);
	      $scope.selectedCell = cell;
	      $scope.selectedRow = row;
	      $scope.selectedColumn = column;
	      var seletedTariffData = row[cellObj];

	      //scope.$emit('sendBookingGrid', seletedTariffData);
	    };
	    
	    $scope.updateCell = function(){
	        $scope.selectedRow[$scope.selectedColumn] = $scope.selectedCell;
	    };
	    
	    $scope.selectedCell;
	    $scope.selectedRow;
	    $scope.selectedColumn;
	    
	    var basicCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()" ng-click="editCell(row.entity, row.getProperty(col.field), col.field)"><span class="ui-disableSelection hover">{{row.getProperty(col.field)}}</span></div>';
	    
	    var tariffData = PrerequisiteService.fnGetTariffData()[1];
	    //var tariffData = [{"tariffid":"1","vehicleName":null,"vehicleType":"1","duration":"1","kms":"60","price":"15","extraKmPrice":"250","extraHrPrice":"12","comments":"10"},{"tariffid":"4","vehicleName":null,"vehicleType":"2","duration":"3","kms":"60","price":"25","extraKmPrice":"400","extraHrPrice":"15","comments":"10"},{"tariffid":"5","vehicleName":null,"vehicleType":"3","duration":"5","kms":"60","price":"12","extraKmPrice":"650","extraHrPrice":"20","comments":"10"}]
	    //console.log(tariffData);
	    var tariffRow = {
	    	'duration': '',
	    	'kms': ''
	    };

	    var fieldName, keyValue, cellObj, objName = 'Obj';

	    for(var pkgType in tariffData){
	    	//console.log(tariffData[pkgType].duration);
	    	var catType = tariffData[pkgType];
	    	//console.log(catType);
	    	var cellObj = catType;
	    	for(var keyName in catType){
	    		//console.log(keyName);
	    		//console.log(tariffRow[keyName]);
	    		if(tariffRow[keyName] != undefined){
	    			tariffRow[keyName] = catType[keyName];
	    		}
	    		//console.log(keyName);
	    		if(keyName == 'tariffType'){
	    			fieldName = keyName + catType[keyName] ;
	    			//console.log(fieldName);
	    			tariffRow[fieldName] = '';
	    			tariffRow[fieldName + objName] = cellObj;

	    		}

	    		if(keyName == 'price'){
	    			//console.log(catType[keyName]);
	    			tariffRow[fieldName] = catType[keyName]
	    		}


	    		//tariffRow[fieldName] = catType[keyName];

	    		//console.log(catType[keyName]);
	    	}
	    	
	    }

	    //console.log(tariffRow);

	    
	    $scope.colDefs = [
	        {field:'duration', displayName:'Duration', width: '*'},
	        {field:'kms', displayName:'Kms', width: '*'},
	        {field:'tariffType1', displayName:'Indica/Vista', width: '*', cellTemplate: basicCellTemplate},
	        {field:'tariffType3', displayName:'Verito/Indigo', width: '*', cellTemplate: basicCellTemplate},
	        {field:'tariffType5', displayName:'Tavera', width: '*', cellTemplate: basicCellTemplate},
	    ];


	    
	    //$scope.myData = [{duration: "60", kms: 15, cat1Price:600, cat2Price:900, cat3Price:900, cat1PriceObj : {comments: "extra charge",duration: "60",extraHrPrice: "50",extraKmPrice: "12",kms: "15",price: "250",tariffid: "1",vehicleName: "1", vehicleType: "1"}, cat2PriceObj : {comments: "extra charge",duration: "60",extraHrPrice: "50",extraKmPrice: "12",kms: "15",price: "250",tariffid: "2",vehicleName: "1", vehicleType: "1"},cat3PriceObj : {comments: "extra charge",duration: "60",extraHrPrice: "50",extraKmPrice: "12",kms: "15",price: "250",tariffid: "3",vehicleName: "1", vehicleType: "1"}},]
	    $scope.myData = [tariffRow];
	    $scope.gridCityPkgOptions = { 
	      data: 'myData',
	      multiSelect: false,
	      columnDefs: 'colDefs',
	    };

    });