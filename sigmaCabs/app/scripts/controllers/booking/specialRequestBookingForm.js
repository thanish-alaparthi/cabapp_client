/*
Name: specialRequestBookingForm
Description: canceling a booking
Date: 27March2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('specialRequestBookingForm', function(oBooking,$rootScope, oCustomer, $scope, $dialog, dialog, wizardHandler, $http,BookingService, PrerequisiteService, PreConfigService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside specialRequestBookingForm', oBooking, oCustomer);

		scope.customerDetails = oCustomer;
		scope.bookingDetails = oBooking;

		scope.specialRequest = PrerequisiteService.fnGetSpecialRequestTypes();
		console.log('>>>>>>>>>>>>>>sp req',scope.specialRequest);

		scope.specialRequest.specialRequestComments  = oBooking.specialRequestComments;
		scope.specialRequest.specialRequestId  = oBooking.specialRequestId;

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveSpecialRequestAndExit = function(){
			$rootScope.$emit('eventSpecialRequestBookingIsSaved', scope.specialRequest);
			scope.close();
		}
	});