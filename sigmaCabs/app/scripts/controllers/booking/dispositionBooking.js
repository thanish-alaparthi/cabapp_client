/*
Name: dispositionBooking
Description: canceling a booking
Date: 03Feb2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('dispositionBooking', function(oBooking,$rootScope, oCustomer, $scope, $dialog, dialog, wizardHandler, $http,BookingService, PrerequisiteService, PreConfigService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside dispositionBooking', oBooking, oCustomer);

		scope.customerDetails = oCustomer;
		scope.bookingDetails = oBooking;

		// set default type of disposition to enquiry
		scope.dispositionDetails = {
			type : PreConfigService.BOOKING_ENQUIRY,
			followupDate: PrerequisiteService.fnFormatDate()
		};
		scope.followUpFields = false;


		scope.dispositions = PrerequisiteService.getDispositionTypes();		
	    scope.minutes = PrerequisiteService.minutes;
	    scope.hours = PrerequisiteService.hours;

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveDispositionAndExit = function(){
			var oSave = oBooking;
			oSave.bookingStatus = scope.dispositionDetails.type;
			oSave.comments = scope.dispositionDetails.comments;

			if(scope.dispositionDetails.type == PreConfigService.BOOKING_FOLLOW_UP){
				oSave.followupDate = PrerequisiteService.formatToServerDate(scope.dispositionDetails.followupDate);
				oSave.followupTime = scope.dispositionDetails.followUpHours +':' + scope.dispositionDetails.followUpMinutes + ':00';
			}

			console.log('Disposition Obj:', oSave);
			BookingService.fnSaveDisposition(oSave)
			.success(function(data, status, headers, config){
				console.log('success fnSaveDisposition',data);
				if(data.status == 200){
					$rootScope.$emit('eventRefreshBookingHistory', {});
					scope.close();
				}
			})
			.error(function(data, status, headers, config){
				console.log('error fnSaveDisposition',data);
			});
		}


		// function which gets called when dispostion type DD is changed
		scope.fnToggleFields = function() {
			if(scope.dispositionDetails.type == PreConfigService.BOOKING_FOLLOW_UP){
				scope.followUpFields = false;
			} else {
				scope.followUpFields = true;
			}
		};
		scope.fnToggleFields();

	});