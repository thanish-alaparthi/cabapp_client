'use strict';

angular.module('sigmaCabsApp')
	.controller('chkTariffController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService) {

		var scope = $scope;
		console.log('inside chkTariffController');

		scope.close = function(){
			//dialog.close();
		};
		scope.checkTariff = URLService.view('checkTariff');
		scope.showTariffContainer = true;

		console.log(PrerequisiteService.fnGetTariffData());


		scope.cityTariffData = [
			{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			}
		];

		scope.airportTariffData = scope.airportTariffData = [
			{
				"duration" : "1 hr",
				"tariffKms" : "15 km ",
				"Indica/Vista" : "240",
				"Verito/Indigo" : "290",
				"Tavera/Xylo" : "390",
				"Innova" : "390"
			}
		];

	});