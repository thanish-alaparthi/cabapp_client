/*
Name: AddFirstTimeCustomer
Description: Adds first time customer
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('AddFirstTimeCustomer', function($scope, PrerequisiteService, $rootScope, URLService, $dialog) {

		var scope = $scope;
			
		scope.firstTimeCustomer = {};

		scope.bookingDetailsForm = URLService.view('bookingForm');

		scope.fnAddFirstTimeCustomer = function() {
			// Add the first-time customer
			console.log(scope.firstTimeCustomer);
		}

	});