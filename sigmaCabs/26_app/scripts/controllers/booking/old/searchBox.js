/*
Name: SearchBoxController
Description: Main controller to handle search Boxes.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('SearchBoxController', function($scope, $rootScope, URLService, $dialog) {

		// by Default make the searchBoxes empty.
		$scope.sMobile = "";
		$scope.sName = "";

		/*
			Name: fnSearchCustomer,
			Description: submit function for search form.
		*/
		$scope.fnSearchCustomer = function() {
			console.log($scope.sMobile, arguments);
		}

		/*
			Name: fnClearSearchBox,
			Description: Clears the searchBoxes.
		*/
		$scope.fnClearSearchBox = function() {
			$scope.sMobile = "",
			$scope.sName = "";

			$scope.fnLoadCustomerList({
				sType: 'mobile',
				query: ''
			});
		}

		/*
			Name: fnMobileEntered,
			Description: Loads the customer list when mobile number is entered.
		*/
		$scope.fnMobileEntered = function(ev) {
			$scope.sName = ""; // make name field empty if mobile number is entered.

			$scope.fnLoadCustomerList({
				sType: 'mobile',
				query: $(ev.target).val(),
				showAddNewCustomerList: (($(ev.target).val() == '123456') ? true : false) // tempHack to show addNewCustomer screen.
			});
		}

		/*
			Name: fnNameEntered,
			Description: Loads the customer list when customer name is entered.
		*/
		$scope.fnNameEntered = function(ev) {
			$scope.sMobile = ""; // make mobile search field empty if name is entered.

			$scope.fnLoadCustomerList({
				sType: 'name',
				query: $(ev.target).val()
			});
		}

		/*
			Name: fnLoadCustomerList,
			Description: broadcasts loadCustomerList event to load the customer list.
		*/
		$scope.fnLoadCustomerList = function(oData) {
			$rootScope.$broadcast('loadCustomerList', oData);
		}

	});