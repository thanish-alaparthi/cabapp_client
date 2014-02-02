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
	console.log('in bookingStatisticsController');
	scope.bookingStatistics = URLService.view('bookingStatistics');



	scope.statisticsGridData = [
		/*{
        'rowInfo': 'Vehicle',
        'smallInfo1': 'Indica',
        'smallInfo2': 'Vista',
        'mediumInfo': 'Verito',
        'bigInfo1': 'Xylo',
        'bigInfo2': 'Innova',
        'bigInfo3': 'Tavera'
    }, */
		/*{
            'rowInfo': 'Avlble',
            'smallInfo1': 55,
            'smallInfo2': 555,
            'mediumInfo': 555,
            'bigInfo1': 555,
            'bigInfo2': 555,
            'bigInfo3': 555
        }, {
            'rowInfo': 'Bkings',
            'smallInfo1': 55,
            'smallInfo2': 555,
            'mediumInfo': 555,
            'bigInfo1': 555,
            'bigInfo2': 555,
            'bigInfo3': 555
        }, {
            'rowInfo': 'Exptd',
            'smallInfo1': 55,
            'smallInfo2': 555,
            'mediumInfo': 555,
            'bigInfo1': 555,
            'bigInfo2': 555,
            'bigInfo3': 555
        }*/
		{
			'rowInfo': 'Indica',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}, {
			'rowInfo': 'Vista',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}, {
			'rowInfo': 'Verito',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}, {
			'rowInfo': 'Xylo',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}, {
			'rowInfo': 'Innova',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}, {
			'rowInfo': 'Tavera',
			'available': 55,
			'in_booking': 555,
			'just_alloted': 555
		}
	];
	scope.gridStatisticsData = {
		data: 'statisticsGridData',
		rowHeight: 25,
		/*columnDefs: [{
            field: 'rowInfo',
            displayName: 'Vehicle'
        }, {
            field: 'smallInfo1',
            displayName: 'Indica'
        }, {
            field: 'smallInfo2',
            displayName: 'Vista'
        }, {
            field: 'mediumInfo',
            displayName: 'Verito'
        }, {
            field: 'bigInfo1',
            displayName: 'Xylo'
        }, {
            field: 'bigInfo2',
            displayName: 'Innova'
        }, {
            field: 'bigInfo3',
            displayName: 'Tavera'
        }],*/
		columnDefs: [{
			field: 'rowInfo',
			displayName: 'Vehicle'
		}, {
			field: 'available',
			displayName: 'Available'
		}, {
			field: 'in_booking',
			displayName: 'in booking'
		}, {
			field: 'just_alloted',
			displayName: 'just alloted'
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