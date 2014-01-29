/*
Name: customerBookingTabs
Description: Main Controller for the booking tabs. Handles tabHead clicks and 
	sets Default tab when new customer search is made or selected from the customerList grid.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('CustomerBookingTabs', function($scope, $rootScope, URLService, $dialog) {

		
		// Set the first tab as the default tab.
		$scope.tab = 1;

		/*
			Name: fnIsActive,
			Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
				Whenever a tab head is clicked, this function is called.
		*/
		$scope.fnIsActive = function(iTab) {
			return $scope.tab == iTab;
		};


		/*
			Watch whether newCustomer is slected or searched.
		*/
		$scope.$on('setDefaultBookingTab', function(ev, oData) {
			$scope.tab = 1;
		});
		

	});