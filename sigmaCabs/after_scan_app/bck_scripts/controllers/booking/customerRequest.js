/*
Name: customerRequest
Description: customerRequest
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('customerRequest', function(oBooking, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside customerRequest', oBooking);

		scope.bookingDetails = oBooking;

		scope.tab = 1;

		scope.fnIsActive = function(iTab){
			return scope.tab == iTab ? true : false;
		}

		scope.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			scope.close();
		}

	});