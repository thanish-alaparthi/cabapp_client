/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingFormController', function($scope, $rootScope, URLService,PrerequisiteService, BookingService, VehiclesService, $dialog, modalWindow, PreConfigService) {
		var scope = $scope;

		console.log('bookingController: ', scope.bookingDetails);

		if(scope.bookingDetails.vehicleType){
			scope.tmpVehicleType = scope.bookingDetails.vehicleType;
		}
		if(scope.bookingDetails.vehicleName){
			scope.tmpVehicleName = scope.bookingDetails.vehicleName;
		}


		// function to change sub-Journey Types
		scope.fnPopSubJourneyTypes = function() {
			scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.tmpJourneyType);			
		};
		// function to change VehicleNames
		scope.fnPopVehicleNames = function() {
			scope.tmpSelectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(scope.tmpVehicleType);
			scope.tmpVehicleName = "";
			scope.bookingDetails.vehicleType = scope.tmpSelectedVehicleType.id;
			if(scope.vehicleNames){
				for(var i=0;i<scope.vehicleNames.length;i++){
					if(scope.vehicleNames[i].id == ""){
						scope.vehicleNames.splice(i,1);
					}
				}
				scope.vehicleNames.push({
	                vehicleType : scope.tmpSelectedVehicleType.id,
	                id: '',
	                vehicleName : 'Any-Vehicle',
	                status : '1'
	            });
			}
			
		};
		// function to change VehicleNames
		scope.fnPopVehicleTypes = function() {
			scope.tmpSelectedVehicleName = PrerequisiteService.fnGetVehicleNameById(scope.tmpVehicleName);
			scope.tmpVehicleType = scope.tmpSelectedVehicleName.vehicleType;

			scope.bookingDetails.vehicleName = scope.tmpSelectedVehicleName.id;
		};

		// function to show/Hide booking related buttons
		scope.fnShowHideBookingButtons = function(){
			if(!scope.bookingDetails.id){
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = false;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			}else if(scope.bookingDetails.id
					&& (   scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_ENQUIRY
						|| scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_FOLLOW_UP
						|| scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_REJECTED)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = false;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& (   scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_YET_TO_DISPATCH
						|| scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_VEHICLE_ASSIGNED)
			){	
				scope.bShowCancelBookingBtn = true;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& ( scope.bookingDetails.bookingStatus == PreConfigService.WHILE_DRIVING)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& (  scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_COMPLETED_N_CLOSED
					   || scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_CANCELLED)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = false;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			}
		};

		$scope.gPlace;
	
		// add dropdwon fields
		scope.hours = PrerequisiteService.hours;
		scope.minutes = PrerequisiteService.minutes;
		scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
		scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
		scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();
		scope.subJourneyTypes = PrerequisiteService.fnGetAllJourneyTypes();

		// If booking is opened in edit Mode... than we have to set JourneyType based on subJourneyType
		if(scope.bookingDetails.subJourneyType){
			scope.tmpJourneyType = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(scope.bookingDetails.subJourneyType);
		} else {
			scope.tmpJourneyType = 1;
		}	

		// If booking is opened in edit Mode... than we have to set vehicleName and vehicleType
		scope.tmpVehicleType = '';	// show All


		// show all the subJourneyTypes based on selected journeyType.
		scope.fnPopSubJourneyTypes();
		scope.fnPopVehicleNames();

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

		scope.fnShowHideBookingButtons();

		//show booking status name if exists
		if(scope.bookingDetails.bookingStatus){
			scope.bookingStatusName = PrerequisiteService.fnGetBookingStatusName(scope.bookingDetails.bookingStatus);
		} else {
			scope.bookingStatusName = "New Booking";
		}

		scope.$watch('bookingDetails.bookingStatus', function(newVal,oldVal){
			scope.fnShowHideBookingButtons();
		},true);

		

	});