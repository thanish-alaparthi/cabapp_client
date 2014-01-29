'use strict';

angular.module('sigmaCabsApp')
	.controller('chkMultiVehicleController', function($scope, PrerequisiteService, BookingService, CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.vehicleCounts = {
			small: 0,
			medium: 0,
			tavera: 0,
			xyloAndInnova: 0
		};

		scope.close = function() {
			dialog.close();
		}


		scope.$on('eventVehicleCountMoreThanLimit', function(){
			alert(1);
		});


		// validate vehicle count
		scope.$watch('vehicleCounts.small', function(newVal, oldVal) {
			if (scope.vehicleCounts.small == 0) {
				return;
			}
			var iSubTotal = parseInt(scope.vehicleCounts.medium + scope.vehicleCounts.tavera + scope.vehicleCounts.xyloAndInnova);
			if (iSubTotal < 5 ) {
				if(scope.vehicleCounts.small > (5 - iSubTotal) ){
					scope.vehicleCounts.small = (5 - iSubTotal);
				}
			} else {
				scope.vehicleCounts.small = 0;
			}
		}, true);
		scope.$watch('vehicleCounts.medium', function(newVal, oldVal) {
			if (scope.vehicleCounts.medium == 0) {
				return;
			}
			var iSubTotal = parseInt(scope.vehicleCounts.small + scope.vehicleCounts.tavera + scope.vehicleCounts.xyloAndInnova);
			if (iSubTotal < 5 ) {
				if(scope.vehicleCounts.medium > (5 - iSubTotal) ){
					scope.vehicleCounts.medium = (5 - iSubTotal);
				}
			} else {
				scope.vehicleCounts.medium = 0;
			}
		}, true);
		scope.$watch('vehicleCounts.tavera', function(newVal, oldVal) {
			if (scope.vehicleCounts.tavera == 0) {
				return;
			}
			var iSubTotal = parseInt(scope.vehicleCounts.small + scope.vehicleCounts.medium + scope.vehicleCounts.xyloAndInnova);
			if (iSubTotal < 5 ) {
				if(scope.vehicleCounts.tavera > (5 - iSubTotal) ){
					scope.vehicleCounts.tavera = (5 - iSubTotal);
				}
			} else {
				scope.vehicleCounts.tavera = 0;
			}
		}, true);
		scope.$watch('vehicleCounts.xyloAndInnova', function(newVal, oldVal) {
			if (scope.vehicleCounts.xyloAndInnova == 0) {
				return;
			}
			var iSubTotal = parseInt(scope.vehicleCounts.small + scope.vehicleCounts.medium + scope.vehicleCounts.tavera);
			if (iSubTotal < 5 ) {
				if(scope.vehicleCounts.xyloAndInnova > (5 - iSubTotal) ){
					scope.vehicleCounts.xyloAndInnova = (5 - iSubTotal);
				}
			} else {
				scope.vehicleCounts.xyloAndInnova = 0;
			}
		}, true);

	});