/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 10Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('bookingFormController', function($scope, $rootScope, URLService,PrerequisiteService, BookingService, VehiclesService, $dialog, modalWindow, PreConfigService, $timeout, serverService) {
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

		scope.allLocations = PrerequisiteService.fnGetAllLocations();

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

		scope.fnSelectTariffBySubJourneyType = function(){
			var oTariff = angular.copy(PrerequisiteService.fnGetTariffByVtypeAndSubJtype(scope.tmpDetails.tmpVehicleType, scope.bookingDetails.subJourneyType));
			console.log('oTariff',oTariff);
			
			$rootScope.$emit('eventSingleTariffSelected', {
				tariffDetails : {
					amount: oTariff.price,
					comments: oTariff.comments,
					distance: oTariff.distance,
					duration: oTariff.duration / 60,
					extraCharges1: oTariff.extraCharges1,
					extraHour: oTariff.extraHrPrice,
					driverBatha : oTariff.driverBatha,
					extraKm: oTariff.extraKmPrice,
					graceTime: oTariff.grace,
					id: oTariff.id,
					vehicleName: PrerequisiteService.fnGetVehicleNameById(scope.bookingDetails.vehicleName)['vehicleName'],
					vehicleType: PrerequisiteService.fnGetVehicleTypeById(oTariff.vehicleType)['vehicleType']
				},
				tariffId : oTariff.id
			});
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

			$timeout(scope.fnSelectTariffBySubJourneyType, 0);
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

			$timeout(scope.fnSelectTariffBySubJourneyType, 0);
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

			$timeout(scope.fnSelectTariffBySubJourneyType, 0);
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
					   || scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_CANCELLED
					   || scope.bookingDetails.bookingStatus == PreConfigService.BOOKING_CANCELLED_ON_CALL)
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
			scope.tmpDetails.tmpJourneyType = oJt.id;
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
			if(!scope.bookingDetails.pickupPlace){
				alert('Please enter a pickup place.');
				return;
			}
			if(!scope.bookingDetails.dropPlace){
				alert('Please enter a drop place.');
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

		scope.fnOpenSpecialRequest = function(){
			if(!scope.waCustomerDetails.id) {
				alert('Please save the customer details first.');
				return;
			}

			$scope.opts = {
				templateUrl: URLService.view('specialRequestForm'),
				controller: 'specialRequestBookingForm',
				dialogClass: 'modalClass disposition-booking-container',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oBooking : function(){
						// send readyToSave booking details
						return scope.bookingDetails
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
			if(!scope.bookingDetails.vehicleName) {
				alert('Please select a vehicle Name properly.');
				return;
			}
			if(!scope.bookingDetails.vehicleType) {
				alert('Please select a vehicle Type properly.');
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
							tariffId : scope.bookingDetails.tariffId, 
							//Nortan - Changed to fix the issue pointed out by Aswin
							vehicleType : scope.tmpDetails.tmpVehicleType, // scope.bookingDetails.vehicleType, 
							subJourneyType : (scope.bookingDetails.subJourneyType  || '1'), 
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

		scope.fnCheckDistance = function() {
			if(!scope.bookingDetails.pickupPlace || !scope.bookingDetails.dropPlace) {
				alert('Please select drop place and pickup place properly.');
				return;
			}

			var aLocations = PrerequisiteService.fnGetLocationsByNames([scope.bookingDetails.pickupPlace,scope.bookingDetails.dropPlace]);
			console.log(aLocations);
			serverService.sendData('P',
						'booking/getDistance',
						{
							sourceId : aLocations[0].id,
							destinationId : aLocations[1].id
						}, scope.fnRestApiCheckDistanceSuccess, scope.fnRestApiCheckDistanceError);

		};
		scope.fnRestApiCheckDistanceSuccess = function(oData){
			console.log('fnRestApiCheckDistanceSuccess :', oData);
			alert('Distance between ' + scope.bookingDetails.pickupPlace + ' and ' + scope.bookingDetails.dropPlace + ' is \n approximately ' + oData[0].distance + ' K.M.');
		};
		scope.fnRestApiCheckDistanceError = function(oData){
			console.log('fnRestApiCheckDistanceError : ', oData)
		};

		scope.fnShowHideBookingButtons();

		scope.$watch('bookingDetails.id', function(newVal,oldVal){
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
						sPkDt = PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate),
						sPkTm = scope.bookingDetails.pickupHours + ':' + scope.bookingDetails.pickupMinutes + ':00',
						sHr = oDt.getHours() <=9 ? '0' + oDt.getHours() : oDt.getHours();
						
					if(!PrerequisiteService.fnValidateBookingTime(sPkDt, sPkTm)){
						var oDtNw = new Date();
						oDtNw.setMinutes(oDtNw.getMinutes() + 20);	// as per ticker:0000088

						var	sHr = oDtNw.getHours() <=9 ? '0' + oDtNw.getHours() : oDtNw.getHours();

						alert('Pickup time should be atleast 20 minutes ahead of the current time.');

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


		$timeout(scope.fnSelectTariffBySubJourneyType, 0);
	});