

'use strict';

angular.module('sigmaCabsApp')
	.controller('chkVehicleAvailabilityController', function($scope, PrerequisiteService, BookingService,CustomerService, $rootScope, URLService, $dialog, dialog) {

		var scope = $scope;
		console.log('inside checkVehicleAvilabilty');

		scope.close = function(){
			dialog.close();
		}

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
			},{
				"Type" : "Airport Up & Down",
				"Indica/Vista" : "Rs 550/ @40 km",
				"Verito/Indigo" : "Rs 550/ @40 km",
				"Tavera/Xylo" : "Rs 550/ @40 km",
				"Innova" : "Rs 550/ @40 km"
			},{
				"Type" : "Airport Up & Down",
				"Indica/Vista" : "Rs 550/ @40 km",
				"Verito/Indigo" : "Rs 550/ @40 km",
				"Tavera/Xylo" : "Rs 550/ @40 km",
				"Innova" : "Rs 550/ @40 km"
			}
		];

	});