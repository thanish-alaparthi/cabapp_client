'use strict';

angular.module('sigmaCabsApp')
	.controller('chkMultiVehicleController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.close = function(){
			dialog.close();
		}

	});