

'use strict';

angular.module('sigmaCabsApp')
	.controller('chkVehicleAvailabilityController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.close = function(){
			dialog.close();
		}

	});