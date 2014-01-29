/*
Name: CustomerService
Description: Service which handles REST Calls for Customer
Date: 12Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.factory('CustomerService', function($http, URLService, $rootScope) {
		var oUser = null;

		return {
			fnUpdateCustomerDetails: function(oDataParams) {
				return $http({
					url: URLService.service('updateCustomerDetails'),
					method: 'POST',
					data: {
						  url : "customer/update"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			}
		}
	});