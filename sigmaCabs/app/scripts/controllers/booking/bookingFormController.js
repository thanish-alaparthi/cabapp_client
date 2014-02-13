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

		console.log('bookingFormController: ', scope.bookingDetails);

		if(scope.bookingDetails.vehicleType){
			scope.tmpDetails.tmpVehicleType = scope.bookingDetails.vehicleType;
		}
		if(scope.bookingDetails.vehicleName){
			scope.tmpDetails.tmpVehicleName = scope.bookingDetails.vehicleName;
		}

		// fn to change the time dd
		scope.fnChangeTimePerDate = function(){
			if(  scope.bookingDetails.bookingStatus == ""
				|| (scope.bookingDetails.bookingStatus != PreConfigService.WHILE_DRIVING
			    	&& scope.bookingDetails.bookingStatus != PreConfigService.BOOKING_COMPLETED_N_CLOSED
			    	&& scope.bookingDetails.bookingStatus != PreConfigService.BOOKING_CANCELLED)
			) {
				// show future time if date is selected date is todays date.
				var aHr = PrerequisiteService.hours;
				var sBkdt = PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate);
				if(PrerequisiteService.currentDate == sBkdt){
					console.log('pickupDate is currentDate');
					var oDt = new Date();
					console.log(oDt.getHours(), oDt.getMinutes());
					var aSelHr = {},
						iLimitHour = oDt.getHours()
					for(var sHr in aHr){
						if(sHr >= iLimitHour){
							aSelHr[sHr] = sHr;
						}
					}
					console.log(scope.hours);
					scope.hours = aSelHr;
					console.log(scope.hours);
					scope.$apply();
				} else {
					scope.hours = PrerequisiteService.hours;
					scope.$apply();
				}
			}
		};

		// function to change sub-Journey Types
		scope.fnPopSubJourneyTypes = function() {
			scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.tmpDetails.tmpJourneyType);
			for(var i=0;i<scope.subJourneyTypes.length;i++){
				if(scope.subJourneyTypes[i].parentId == scope.tmpDetails.tmpJourneyType){
					scope.bookingDetails.subJourneyType = scope.subJourneyTypes[i].id;
					break;
				}
			}
			
		};
		// function to change VehicleNames
		scope.fnPopVehicleNames = function() {
			// clear the tariff selection
			scope.bookingDetails.tariffId = null;
			scope.tariffGridData = null;
			scope.$emit('eventVehicleTypeChanged');

			scope.tmpSelectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(scope.tmpDetails.tmpVehicleType);
			scope.tmpDetails.tmpVehicleName = "";
			scope.bookingDetails.vehicleType = scope.tmpSelectedVehicleType.id;
			if(scope.vehicleNames){
				for(var i=0;i<scope.vehicleNames.length;i++){
					if(scope.vehicleNames[i].id == ""){
						scope.vehicleNames.splice(i,1);
					}
				}
				scope.vehicleNames.push({
	                vehicleType : '1',	// any-vehicle default to small
	                id: '',
	                vehicleName : 'Any-Vehicle',
	                status : '1'
	            });
			}
		};
		// function to change VehicleNames
		scope.fnPopVehicleTypes = function() {
			if(scope.tmpDetails.tmpVehicleName == "") {
				scope.tmpDetails.tmpVehicleType = '1';
				scope.bookingDetails.vehicleName = "";
				return;
			}
			scope.tmpSelectedVehicleName = PrerequisiteService.fnGetVehicleNameById(scope.tmpDetails.tmpVehicleName);
			scope.tmpDetails.tmpVehicleType = scope.tmpSelectedVehicleName.vehicleType;

			scope.bookingDetails.vehicleName = scope.tmpSelectedVehicleName.id;
		};

		// function to show/Hide booking related buttons
		scope.fnShowHideBookingButtons = function(){
			//show booking status name if exists
			if(scope.bookingDetails.bookingStatus){
				scope.bookingStatusName = PrerequisiteService.fnGetBookingStatusName(scope.bookingDetails.bookingStatus);
			} else {
				scope.bookingStatusName = "New Booking";
			}

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
			var oJt = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(scope.bookingDetails.subJourneyType);
			scope.tmpDetails.tmpJourneyType = oJt.parentId;
		} else {
			scope.tmpDetails.tmpJourneyType = "1";
		}	

		// If booking is opened in edit Mode... than we have to set vehicleName and vehicleType
		scope.tmpDetails.tmpVehicleType = '1';	// by default show Small


		// show all the subJourneyTypes based on selected journeyType.
		scope.fnPopSubJourneyTypes();
		scope.fnPopVehicleNames();

		scope.checkVehicleAvilabilty = function(){
			if(!scope.waCustomerDetails.id) {
				alert('Please save the customer details first.');
				return;
			}
			$scope.opts = {
				templateUrl: URLService.view('vehicleAvailabilityCheck'),
				controller: 'chkVehicleAvailabilityController',
				dialogClass: 'modalClass vehicle-availability',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						return scope.bookingDetails
					},
					oCustomer : function(){
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.fnOpenCancelBooking = function(){
			if(!scope.bookingDetails.id) {
				alert('Please save the booking details first.');
				return;
			}
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
					},
					oCustomer : function(){
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};

		scope.fnOpenDisposition = function(){
			if(!scope.waCustomerDetails.id) {
				alert('Please save the customer details first.');
				return;
			}

			$scope.opts = {
				templateUrl: URLService.view('dispositionForm'),
				controller: 'dispositionBooking',
				dialogClass: 'modalClass disposition-booking-container',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						// send readyToSave booking details
						return {
							id : "", 	// always save booking as new in disposition.
							pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
							pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
							pickupPlace : scope.bookingDetails.pickupPlace, 
							dropPlace : scope.bookingDetails.dropPlace, 
							primaryPassanger : '',
							primaryMobile : '',
							extraMobile : '',
							landmark1 : scope.bookingDetails.landmark1, 
							landmark2 : scope.bookingDetails.landmark2, 
							vehicleName : scope.bookingDetails.vehicleName, 
							vehicleType : scope.bookingDetails.vehicleType, 
							subJourneyType : scope.bookingDetails.subJourneyType, 
							bookingStatus : null,	// reset the booking status in disposition.
							customerId : scope.waCustomerDetails.id
						}
					},
					oCustomer : function(){
						return scope.waCustomerDetails
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
			if(!scope.waCustomerDetails.id) {
				alert('Please save the customer details first.');
				return;
			}
			$scope.opts = {
				templateUrl: URLService.view('singleTariff'),
				controller: 'singleTariffController',
				dialogClass: 'modalClass' ,
				resolve: {
					oBooking : function(){
						// send readyToSave booking details
						return {
							id : scope.bookingDetails.id,
							pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
							pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
							pickupPlace : scope.bookingDetails.pickupPlace, 
							dropPlace : scope.bookingDetails.dropPlace, 
							primaryPassanger : '',
							primaryMobile : '',
							extraMobile : '',
							landmark1 : scope.bookingDetails.landmark1, 
							landmark2 : scope.bookingDetails.landmark2, 
							vehicleName : scope.bookingDetails.vehicleName, 
							vehicleType : scope.bookingDetails.vehicleType, 
							subJourneyType : scope.bookingDetails.subJourneyType, 
							bookingStatus : null,	// reset the booking status in disposition.
							customerId : scope.waCustomerDetails.id
						}
					},
					oCustomer : function(){
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		}

		scope.fnShowHideBookingButtons();

		scope.$watch('bookingDetails.bookingStatus', function(newVal,oldVal){
			scope.fnShowHideBookingButtons();
		},true);

		scope.$watch('bookingDetails.subJourneyType', function(newVal,oldVal){
		},true);


		scope.$watch('tmpDetails', function(newVal,oldVal){
			if(newVal.tmpJourneyType != oldVal.tmpJourneyType){
				scope.fnPopSubJourneyTypes();
			}
		},true);

	});