/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingFormController', function($scope, $rootScope, URLService,PrerequisiteService, BookingService, VehiclesService, $dialog, modalWindow, PreConfigService, $timeout) {
		var scope = $scope;

		//attach safeApply
	      $scope.safeApply = function(fn) {
	        var phase = this.$root.$$phase;
	        if(phase == '$apply' || phase == '$digest') {
	          if(fn && (typeof(fn) === 'function')) {
	            fn();
	          }
	        } else {
	          this.$apply(fn);
	        }
	      };

		console.log('bookingFormController: ', scope.bookingDetails);

		// set current Date for pickup date
		scope.dpCurrentDate = PrerequisiteService.fnFormatDate();
		scope.dpCurrentPlusSevenDate = PrerequisiteService.fnGetAdvancedDate(7);	// set date restriction.

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
					oDt.setMinutes(oDt.getMinutes() + 20);

					var	sHr = oDt.getHours() <=9 ? '0' + oDt.getHours() : oDt.getHours();


					scope.bookingDetails.pickupHours = sHr.toString();
					// alert(scope.bookingDetails.pickupHours);
					scope.$apply();
				} else {
					scope.hours = PrerequisiteService.hours;
					scope.$apply();
				}
			}

			scope.fnValidatePickupTime();
		};

		// scope.fnEmptyPlaces = function(){			
		// 	scope.bookingDetails.pickupPlace =  "";
		// 	scope.bookingDetails.dropPlace =  "";
		// 	scope.fnPopSubJourneyTypes();
		// };

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
			var oVn = PrerequisiteService.fnGetDefaultVehicleName(scope.tmpSelectedVehicleType.id);
			scope.bookingDetails.vehicleType = scope.tmpSelectedVehicleType.id;
			scope.bookingDetails.vehicleName = oVn.id;
			scope.tmpDetails.tmpVehicleName = oVn.id;

			// if(scope.vehicleNames){
			// 	for(var i=0;i<scope.vehicleNames.length;i++){
			// 		if(scope.vehicleNames[i].id == ""){
			// 			scope.vehicleNames.splice(i,1);
			// 		}
			// 	}
			// 	scope.vehicleNames.push({
	  //               vehicleType : '1',	// any-vehicle default to small
	  //               id: '',
	  //               vehicleName : 'Any-Vehicle',
	  //               status : '1'
	  //           });
			// }
		};
		// function to change VehicleNames
		scope.fnPopVehicleTypes = function() {
			// clear the tariff selection
			scope.bookingDetails.tariffId = null;
			scope.tariffGridData = null;

			scope.$emit('eventVehicleNameChanged');

			if(scope.tmpDetails.tmpVehicleName == "") {
				scope.tmpDetails.tmpVehicleType = '1';
				scope.bookingDetails.vehicleName = "";
				scope.safeApply();
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
				scope.bShowReconfirmBookingBtn = false;
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = false;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			}else if(scope.bookingDetails.id
					&& (   scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_ENQUIRY
						|| scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_FOLLOW_UP)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = false;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
				scope.bShowReconfirmBookingBtn = false;
			}else if(scope.bookingDetails.id
					&& (scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_REJECTED)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = false;
				scope.bShowReconfirmBookingBtn = true;
				scope.bShowSaveAsNewBookingBtn = false;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& (   scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_YET_TO_DISPATCH
						|| scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_VEHICLE_ASSIGNED)
			){	
				scope.bShowCancelBookingBtn = true;
				scope.bShowSaveBookingBtn = true;
				scope.bShowReconfirmBookingBtn = false;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& ( scope.bookingDetails.bookingStatus == PreConfigService.WHILE_DRIVING)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = true;
				scope.bShowReconfirmBookingBtn = false;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			} else if(scope.bookingDetails.id
					&& (  scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_COMPLETED_N_CLOSED
					   || scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_CANCELLED)
			){	
				scope.bShowCancelBookingBtn = false;
				scope.bShowSaveBookingBtn = false;
				scope.bShowReconfirmBookingBtn = false;
				scope.bShowSaveAsNewBookingBtn = true;
				scope.bShowDispositionBtn = true;			
				scope.bShowCustFeedbackBtn = true;
			}
		};

		$scope.gPlace;
	
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
			if(!scope.bookingDetails.pickupPlace) {
				alert('Please enter a pickup place.');
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
							primaryPassenger : '',
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
			alert("Coming very soon.\n Sorry for the inconvenience.");

			return;
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

			if(!scope.bookingDetails.pickupPlace) {
				alert('Please enter a pickup place.');
				return;
			}
			if(!scope.bookingDetails.dropPlace) {
				alert('Please enter a drop place.');
				return;
			}

			$scope.opts = {
				templateUrl: URLService.view('singleTariff'),
				controller: 'singleTariffController',
				dialogClass: 'modalClass',
				resolve: {
					oBooking : function(){
						// send readyToSave booking details
						return {
							id : scope.bookingDetails.id,
							pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
							pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
							pickupPlace : scope.bookingDetails.pickupPlace, 
							dropPlace : scope.bookingDetails.dropPlace, 
							primaryPassenger : '',
							primaryMobile : '',
							extraMobile : '',
							landmark1 : scope.bookingDetails.landmark1, 
							landmark2 : scope.bookingDetails.landmark2, 
							vehicleName : scope.bookingDetails.vehicleName, 
							//Nortan - Changed to fix the issue pointed out by Aswin
							vehicleType : scope.tmpDetails.tmpVehicleType, // scope.bookingDetails.vehicleType, 
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
			console.log('CCCCCCCCCCCCC in watch bookingDetails.subJourneyType');
			scope.makePickupReadOnly = false;
			scope.makeDropReadOnly = false;
			
			if(PreConfigService.aAirportJourneyIds.indexOf(scope.bookingDetails.subJourneyType) != -1) {
				if(    scope.bookingDetails.subJourneyType == PreConfigService.START_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AND_END_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AIRPORT_PACKAGE_ID
				) {
					scope.bookingDetails.pickupPlace = PreConfigService.DEFAULT_ADDR_FOR_AIRPORT;
					scope.makePickupReadOnly = true;
				}
				if(    scope.bookingDetails.subJourneyType == PreConfigService.END_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.MID_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AND_END_IS_AIRPORT_ID
				) {
					scope.bookingDetails.dropPlace = PreConfigService.DEFAULT_ADDR_FOR_AIRPORT;
					scope.makeDropReadOnly = true;
				}
			}		
		},true);

		scope.fnSubJourneyTypeChanged = function() {
			console.log('CCCCCCCCCCCCC in watch bookingDetails.subJourneyType');
			scope.makePickupReadOnly = false;
			scope.makeDropReadOnly = false;

			if(PreConfigService.aAirportJourneyIds.indexOf(scope.bookingDetails.subJourneyType) != -1) {
				scope.bookingDetails.pickupPlace =  "";
				scope.bookingDetails.dropPlace =  "";
				if(    scope.bookingDetails.subJourneyType == PreConfigService.START_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AND_END_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AIRPORT_PACKAGE_ID
				) {
					scope.bookingDetails.pickupPlace = PreConfigService.DEFAULT_ADDR_FOR_AIRPORT;
					scope.makePickupReadOnly = true;
				}
				if(    scope.bookingDetails.subJourneyType == PreConfigService.END_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.MID_IS_AIRPORT_ID
					|| scope.bookingDetails.subJourneyType == PreConfigService.START_AND_END_IS_AIRPORT_ID
				) {
					scope.bookingDetails.dropPlace = PreConfigService.DEFAULT_ADDR_FOR_AIRPORT;
					scope.makeDropReadOnly = true;
				}
			}
		};


		scope.$watch('tmpDetails', function(newVal,oldVal){
			if(newVal.tmpJourneyType != oldVal.tmpJourneyType){
				scope.fnPopSubJourneyTypes();
			}
		},true);

		scope.fnSetBookingTypeInHeader = function(){
			var oPkDt = new Date(PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate) + ' ' + scope.bookingDetails.pickupHours + ':' + scope.bookingDetails.pickupMinutes + ':00'),
				oCurDt = new Date(),
				sTmDif = (oPkDt.getTime() - oCurDt.getTime()),
				sHrMil = (60 * 60 * 1000),
				s30MinMil = (30 * 60 * 1000),
				s3HrMil = (3 * sHrMil),
				s6HrMil = (6 * sHrMil),
				s24HrMil = (24 * sHrMil);

				

				var sHeadBookingType = "";

				if(sTmDif <= s30MinMil){
					sHeadBookingType = "Urgent";
				} else if(sTmDif > s30MinMil && sTmDif <= sHrMil){					
					sHeadBookingType = "Immediate";
				} else if(sTmDif > sHrMil && sTmDif <= s3HrMil){					
					sHeadBookingType = "Regular";
				} else if(sTmDif > s3HrMil && sTmDif <= s6HrMil){					
					sHeadBookingType = "Sufficient";
				} else if(sTmDif > s6HrMil && sTmDif <= s24HrMil){					
					sHeadBookingType = "Advance-Current";
				} else if(sTmDif > s24HrMil){					
					sHeadBookingType = "Advance";
				}

				console.log('TmDif',sTmDif/ (60 * 1000), sHeadBookingType);
				scope.$emit('eventHeadBookingType',{
					type : sHeadBookingType
				});
		};

		scope.fnValidatePickupTime = function(){
			console.log('Validate pickupTime');
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
					var oDt = new Date(),
						oPkDt = new Date(PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate) + ' ' + scope.bookingDetails.pickupHours + ':' + scope.bookingDetails.pickupMinutes + ':00'),
						sHr = oDt.getHours() <=9 ? '0' + oDt.getHours() : oDt.getHours(),
						isPkDtLessThan30Minutes = false;

					if(((oDt.getTime() + (30 * 60 * 1000)) >= oPkDt.getTime() )){
						isPkDtLessThan30Minutes = true;
					}

					if(		oPkDt.getTime() < oDt.getTime()  // pickup time should not be lessThan current time
						|| isPkDtLessThan30Minutes ){
						var oDtNw = new Date();
						oDtNw.setMinutes(oDtNw.getMinutes() + 30);

						var	sHr = oDtNw.getHours() <=9 ? '0' + oDtNw.getHours() : oDtNw.getHours();

						alert('Pickup time should be atleast 30 minutes ahead of the current time.');

						var sMn = (oDtNw.getMinutes() + (10 - (oDtNw.getMinutes()%10)));
						sMn = sMn <=9 ? '0'+sMn : sMn;
						if(parseInt(sMn) >= 60){
							sHr++;
							sMn = '00';							
						}
						if(parseInt(sHr) >23){
							sHr = 23;
							sMn = 50;
						}
						scope.bookingDetails.pickupHours = sHr.toString();
						scope.bookingDetails.pickupMinutes = sMn.toString();
						console.log(sHr,sMn);
					}
				}
			}

			$timeout(scope.fnSetBookingTypeInHeader, 0);
			
			$rootScope.$emit('eventRefreshStats');

		};

		scope.fnSelectTariffBySubJourneyType = function(){
			// var oTariff = PrerequisiteService.fnGetTariffByVtypeAndSubJtype(scope.bookingDetails.vehicleType, scope.bookingDetails.subJourneyType);
			// console.log('oTariff',oTariff);
		};

		scope.fnOpenCustFeedback = function() {
			$scope.opts = {
				templateUrl: URLService.view('customerFeedback'),
				controller: 'customerFeedback',
				dialogClass: 'modalClass add-request',
				resolve: {
					editMode: [

						function() {
							return false;
						}
					],
					oBooking: function() {
						// send readyToSave booking details
						return {
							id: "", // always save booking as new in disposition.
							pickupDate: PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate),
							pickupTime: scope.bookingDetails.pickupHours + ':' + scope.bookingDetails.pickupMinutes + ':00',
							pickupPlace: scope.bookingDetails.pickupPlace,
							dropPlace: scope.bookingDetails.dropPlace,
							primaryPassenger: '',
							primaryMobile: '',
							extraMobile: '',
							landmark1: scope.bookingDetails.landmark1,
							landmark2: scope.bookingDetails.landmark2,
							vehicleName: scope.bookingDetails.vehicleName,
							vehicleType: scope.bookingDetails.vehicleType,
							subJourneyType: scope.bookingDetails.subJourneyType,
							bookingStatus: null, // reset the booking status in disposition.
							customerId: scope.waCustomerDetails.id
						}
					},
					oCustomer: function() {
						return scope.waCustomerDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};
	});