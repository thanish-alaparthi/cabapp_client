'use strict';

angular.module('sigmaCabsApp')
	.controller('chkMultiVehicleController', function($scope, PrerequisiteService, BookingService, CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.showVechicleContianer = true;

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

		scope.getTariff = function(){
			scope.showVechicleContianer = false;
			scope.showTariffContainer = true;
		};

		scope.cityTariffData = [
			{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			},{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			}
		];

		scope.airportTariffData = [
			{
				"Type" : "City to Airport to City",
				"Indica/Vista" : "Rs 550/ @40 km",
				"Verito/Indigo" : "Rs 550/ @40 km",
				"Tavera/Xylo" : "Rs 550/ @40 km",
				"Innova" : "Rs 550/ @40 km"
			}
		];
		

	});