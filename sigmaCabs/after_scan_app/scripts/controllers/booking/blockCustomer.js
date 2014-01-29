/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('blockCustomer', function(oBooking, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside blockCustomer', oBooking);

		scope.bookingDetails = oBooking;

		scope.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.close();
		}

	});