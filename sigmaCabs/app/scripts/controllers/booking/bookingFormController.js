/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingFormController', function($scope, $rootScope, URLService,PrerequisiteService, BookingService, VehiclesService, $dialog, modalWindow) {
		var scope = $scope;

		$scope.gPlace;
		
		// add dropdwon fields
		scope.vehicleTypes = PrerequisiteService.vehicleTypeOptions;
		scope.luggageTypes = PrerequisiteService.luggageTypes;



		scope.bShowCancel = true;
		scope.bShowSaveAndClose = true;
		scope.bShowCustomerFeedbackBtn = true;


		scope.altPhoneBgContainerShow = false;

		 /*
            Setup sub-Tabs for Snapshot Tab
        */
        scope.bookingSnapshotSubTab = 1; // Set the first tab as the default tab.

        /*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
        scope.fnIsActiveBookingSnapshotSubTab = function(iTab) {
            return scope.bookingSnapshotSubTab == iTab;
        };
        scope.fnSetActiveBookingSnapshotSubTab = function(iTab) {
            scope.bookingSnapshotSubTab = iTab;
        };

        /*
        	function to make a API call to get the vehicle Availability
        */
        scope.fnGetVehicleAvailability = function(){
        	if(!scope.bookingDetails.journeyDate || !scope.bookingDetails.pickupTime) {
        		return;
        	}
        	var aJnDt = scope.bookingDetails.journeyDate.split('-'),
				aJnTm = scope.bookingDetails.pickupTime.split(':'),
				oCurrentDt = new Date(),
				oJourneyDateTime = new Date(aJnDt[0],(aJnDt[1]-1),aJnDt[2],aJnTm[0], aJnTm[1]);
				scope.softAlertError = "";
				scope.spotBookingIntimationMsg = "";
				scope.vehicleAvailabilityCheckMsg = "";
				if(oJourneyDateTime.getTime() <oCurrentDt.getTime()){
					scope.softAlertError = "Please enter a future journey date.";
					return;
				}

				scope.iHoursGap = parseFloat((oJourneyDateTime.getTime() - oCurrentDt.getTime()) / (1000 * 60 * 60)).toFixed(2);

				if(scope.iHoursGap <= 6){
					scope.spotBookingIntimationMsg = 'This is a spot booking(Hours remaining for journey is ' + (scope.iHoursGap) + '). Dispatcher intimation will be sent. Please follow-up before committing to the customer.';
				}
				if(scope.iHoursGap <= 1) {
					scope.vehicleAvailabilityCheckMsg = 'This is a spot booking(Hours remaining for journey is ' + (scope.iHoursGap) + '). Please check the vehicle availablity before committing to the customer.';
				}
			
        }

        scope.bookingSnapshotPackageDurationDetails = URLService.view('bookingSnapshotPackageDuration');
        scope.bookingSnapshotTarrifDetails = URLService.view('bookingSnapshotTarrifDetails');
        scope.bookingSnapshotRouteMapDetails = URLService.view('bookingSnapshotRouteMapDetails');
        /*
            EOF : Setup sub-Tabs for snapshot
        */


		scope.bShowAvailableVehicles = false;


		scope.fnShowAvailableVehicles = function() {
			scope.bShowAvailableVehicles = true;
		}

		scope.fnGetBookingTariffs = function() {

			if((scope.bookingDetails.journeyDate && scope.bookingDetails.pickupTime)){
				BookingService.fnGetBookingTariffs(scope.bookingDetails)
				.success(function(data, status, headers, config){
					console.log('Success fnGetBookingTariffs: ',data);
					scope.tariffDetails = data;
				})
				.error(function(data, status, headers, config){
					console.log('error fnGetBookingTariffs: ',data);
				});
			}
		}

		scope.fnGetAvailabeVehicles = function() {

			if((scope.bookingDetails.journeyDate && scope.bookingDetails.pickupTime)){
				VehiclesService.fnGetAvailabeVehicles(scope.bookingDetails)
				.success(function(data, status, headers, config){
					console.log('Success fnGetAvailabeVehicles: ',data);
					scope.availableVehicles = data;
				})
				.error(function(data, status, headers, config){
					console.log('error fnGetAvailabeVehicles: ',data);
				});
			}
		}

		scope.fnValidatePassengerCount = function() {
			scope.softAlertError = "";
			if(isNaN(scope.bookingDetails.passengerCount)) {
				scope.softAlertError = "Please enter a valid passenger count.";
				return;
			}
			var iTmpPsgrCnt = 0;
			for(var i=0;i<scope.bookingDetails.vehicleTypes.length;i++) {
				switch(parseInt(scope.bookingDetails.vehicleTypes[i])){
					case 1:
						iTmpPsgrCnt += 5;
					break;
					case 2:
						iTmpPsgrCnt += 5;
					break;
					case 3:
						iTmpPsgrCnt += 7;
					break;
					case 4:
						iTmpPsgrCnt += 11;
					break;
				}
			}

			if(iTmpPsgrCnt < scope.bookingDetails.passengerCount ) {
				scope.softAlertError = "Passenger count is more than vehicle seats.";
			}
		}


		// watch for vehicle Count
		scope.$watch('bookingDetails.vehicleCount', function(newVal, oldVal) {
			scope.fnValidatePassengerCount();

			scope.fnGetBookingTariffs();
			scope.fnGetAvailabeVehicles();
		},true);


		// watch for journey date and time change
		scope.$watch('bookingDetails.journeyDate', function(newVal, oldVal) {				
			scope.fnGetVehicleAvailability();

			scope.fnGetBookingTariffs();
			scope.fnGetAvailabeVehicles();
		},true);
		scope.$watch('bookingDetails.pickupTime', function(newVal, oldVal) {
			scope.fnGetVehicleAvailability();

			scope.fnGetBookingTariffs();
			scope.fnGetAvailabeVehicles();
		},true);

		// watch for passenger Count		
		scope.$watch('bookingDetails.passengerCount', function(newVal, oldVal) {
			scope.fnValidatePassengerCount();

			scope.fnGetBookingTariffs();
			scope.fnGetAvailabeVehicles();

		},true);

		// watch for change of vehicleTypes
		scope.$watch('bookingDetails.vehicleTypes', function(newVal, oldVal) {
			scope.fnValidatePassengerCount();

			scope.fnGetBookingTariffs();
			scope.fnGetAvailabeVehicles();
		},true);


		// scope.availableVehicles = [{
		// 	vehicleCode : 'SC999',
		// 	vehicleType: 'Small'
		// }];

		// available Vehicle Grid config
		scope.availableVehicleGrid = {
			data: 'availableVehicles',
			columnDefs: [{
				field: 'vehicleCode',
				displayName: 'Vehicle Code'
			},{
				field: 'vehicleType',
				displayName: 'Type'
			}]
		};

		scope.checkVehicleAvilabilty = function(){
			$scope.opts = {
				templateUrl: URLService.view('vehicleAvailabilityCheck'),
				controller: 'chkVehicleAvailabilityController',
				dialogClass: 'modalClass',
				resolve: {}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.fnOpenCancelBooking = function(){
			$scope.opts = {
				templateUrl: URLService.view('cancelBookingMain'),
				controller: 'cancelBooking',
				dialogClass: 'modalClass cancel-booking-container',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						return scope.bookingDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.checkMultiVehicle = function(){
			$scope.opts = {
				templateUrl: 'views/bookings/checkMultiVehicle.html',
				controller: 'chkMultiVehicleController',
				dialogClass: 'modalClass multi-vehicle-container-modal',
				resolve: {}
			};
			modalWindow.addDataToModal($scope.opts);
		}

		scope.checkTariff = function(){
			$scope.opts = {
				templateUrl: URLService.view('singleTariff'),
				controller: 'chkTariffController',
				dialogClass: 'modalClass multi-vehicle-container-modal' ,
				resolve: {}
			};
			modalWindow.addDataToModal($scope.opts);
		}


		// check for bShowSaveAndClose and bShowCancel
		// existing customer is selected from the customer List grid
        $rootScope.$on('eventClosedBookingSelectFromGrid', function(ev, oData) {
        	console.log('in on eventClosedBookingSelectFromGrid');
            scope.bShowCancel = oData.bShowCancel;
            scope.bShowSaveAndClose = oData.bShowSaveAndClose;
            scope.bShowCustomerFeedbackBtn = oData.bShowCustomerFeedbackBtn;
        });


	});