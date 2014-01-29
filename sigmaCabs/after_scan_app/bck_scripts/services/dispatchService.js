/*
Name: UsersService
Description: Service which handles REST Calls for Users
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.factory('dispatchService', function($http, URLService, $rootScope) {
		var oUser = null;

		return {
			fnAddDispatchData: function(oDataParams) {
				return $http({
					url: URLService.service('dispatchVehicle'),
					method: 'POST',
					data: {
						  url : "vehicledriverbooking/assign"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnGetDisBookingData: function() {
                return $http({
                    method: 'GET',
                    url: URLService.service('getAllAvailBookings'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
			fnGetDisVehiData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getAllAvailVehicles'),
                    data: {
                    	 url : "vehicle/available"
						, data : JSON.stringify(oDataParams)
					},
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnGetAllDrivData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getAllAvailVehicles'),
                    data: {
                    	 url : "user/specific"
						, data : JSON.stringify(oDataParams)
					},
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnSendLogDetails: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getVehicleDetails'),
                    data: {
                    	 url : "vehicle/activity"
						, data : JSON.stringify(oDataParams)
					},
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },


		}
	});