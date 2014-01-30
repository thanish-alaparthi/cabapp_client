/*
Name: BookingHistory
Description: Adds first time customer
Date: 12Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingTariffGrid', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog) {

		console.log('bookingTariffGrid');
		var scope = $scope;
		scope.customerBookingGridDetails = [{
			'vehicleName' : 'Indica',
			'vehicleType' : 'Small',
			'duration' : '1 hr',
			'distance' : '15',
			'amount' : '240',
			'extraKms' : '12',
			'graceTime' : 'Grace Time',
			'discount' : 15,
			'grade':'A',
			'comments' : 'Driver Batta Rs 200 & Permit, Toll & Parking charges are applicable. Minimum 250 Kms/day.'
		},{
			'vehicleName' : 'Indica',
			'vehicleType' : 'Small',
			'duration' : '1 day',
			'distance' : '300',
			'amount' : '2500',
			'extraKms' : '12',
			'graceTime' : 'Grace Time',
			'comments' : 'This will be te comments section'
		},{
			'vehicleName' : 'Indica',
			'vehicleType' : 'Small',
			'duration' : '90 min',
			'distance' : '40',
			'amount' : '600',
			'extraKms' : '12',
			'graceTime' : '1 hr',
			'comments' : 'This will be te comments section'
		},{
			'vehicleName' : 'Indica',
			'vehicleType' : 'Small',
			'duration' : '1 hr',
			'distance' : '15',
			'amount' : '240',
			'extraKms' : 'Extra Kms',
			'graceTime' : 'Grace Time',
			'comments' : 'This will be te comments section'
		},{
			'vehicleName' : 'Indica',
			'vehicleType' : 'Small',
			'duration' : '1 hr',
			'distance' : '15',
			'amount' : '240',
			'extraKms' : 'Extra Kms',
			'graceTime' : 'Grace Time',
			'comments' : 'This will be te comments section'
		}];

		$scope.gridBookingTariffOptions = {
			data: 'customerBookingGridDetails',
			rowHeight: 25,
			columnDefs: [
			{
				field: 'vehicleType',
				displayName: 'Vh Type',
				width: '*'
			}, {
				field: 'vehicleName',
				displayName: 'Vh Name',
				width: '*'
			}, {
				field: 'duration',
				displayName: 'Duration',
				width: '*'
			}, {
				field: 'distance',
				displayName: 'Kms',
				width: '*'
			}, {
				field: 'amount',
				displayName: 'Amount',
				width: '*'
			}, {
				field: 'extraKms',
				displayName: 'Extra Kms',
				width: '*'
			},{
				field: 'extraHrs',
				displayName: 'Extra Hrs',
				width: '*'
			}, {
				field: 'graceTime',
				displayName: 'Grace Time',
				width: '*'
			},{
				field: 'customerGrade',
				displayName: 'Grade',
				width: '*'
			}, {
				field: 'discount',
				displayName: 'Discount',
				width: '*'
			}, {
				field: 'comments',
				displayName: 'Comments',
				width: 650
			}],
			enablePaging: false,
			showFooter: false,
			multiSelect: false,
			totalServerItems: 'totalServerItems',
			afterSelectionChange: function(oRow) {
				console.log(oRow.selectionProvider.selectedItems[0]);
			}
		};

	});