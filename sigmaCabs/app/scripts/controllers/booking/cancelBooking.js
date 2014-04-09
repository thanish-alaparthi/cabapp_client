/*
Name: cancelBooking
Description: canceling a booking
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('cancelBooking', function(oBooking, oCustomer, $scope,$rootScope, $dialog, dialog, wizardHandler, $http,BookingService, PrerequisiteService, URLService, UsersService,VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside cancelBooking', oBooking);

		scope.bookingDetails = oBooking;
		scope.customerDetails = oCustomer;

		scope.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;		
		scope.reason = PrerequisiteService.fnGetReasonsById(13);
		scope.cancelCategories = PrerequisiteService.fnGetCancelBookingCategory();

		scope.close = function() {
			dialog.close();
		}

		scope.fnSaveAndExit = function(){
			var oData = {
				bookingId : scope.bookingDetails.id,
				vehicleId : scope.bookingDetails.vehicleId,
				reasonId : scope.reasonId || '',
				priorityId : scope.priorityId || '',
				cancelCategory : scope.categoryId || '',
				comments : scope.comments || ''
			};

			// validations
			if (oData.comments === '' || oData.cancelCategory === '' || oData.reasonId === '') {
                alert('Please enter valid information.');
                return false;
            }

			BookingService.fnCancelBooking(oData)
			.success(function(data, status, headers, config){
				console.log('success fnCancelBooking',data);
				if(data.status == 200){
					alert("Booking successfully cancelled.");

					// refresh the bookingHistory Grid
					$rootScope.$emit('eventRefreshBookingHistory', {});
					scope.close();
				}
			})
			.error(function(data, status, headers, config){
				console.log('error fnCancelBooking',data);
				alert('Error in saving.');
			});
		}

	});