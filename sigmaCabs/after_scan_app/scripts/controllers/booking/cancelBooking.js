/*
Name: cancelBooking
Description: canceling a booking
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('cancelBooking', function(oBooking, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside cancelBooking', oBooking);

		scope.bookingDetails = oBooking;

		scope.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;

		scope.close = function() {
			dialog.close();
		}

	});