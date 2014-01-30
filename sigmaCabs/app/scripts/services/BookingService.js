/*
Name: BookingService
Description: Service which handles REST Calls for Bookings
Date: 12Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.factory('BookingService', function($http, URLService, $rootScope) {
		var oUser = null;

		return {
			fnFindCustomerByMobile: function(oDataParams) {
				return $http({
					url: URLService.service('searchCustomerByMobile'),
					method: 'POST',
					data: {
						  url : "customer/search"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnSaveBooking : function(oDataParams){
				return $http({
					url: URLService.service('saveBooking'), 
					method: 'POST',
					data: {
						  url : "booking/save"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				});
			},
			fnGetBookingTariffs : function(oDataParams){
				return $http({
					url: URLService.service('bookingTariffs'), 
					method: 'POST',
					data: {
						  url : "booking/tariff"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				});
			}
		}
	});