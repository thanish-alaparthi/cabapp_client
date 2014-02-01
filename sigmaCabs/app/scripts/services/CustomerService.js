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
					url: URLService.service('RestApiSaveCustomerDetails'),
					method: 'POST',
					data: {
						  url : "customer/save"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnBlockCustomer: function(oDataParams) {
				return $http({
					url: URLService.service('RestApiBlockCustomer'),
					method: 'POST',
					data: {
						  url : "blockcaller/save"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnSaveCustomerRequest: function(oDataParams) {
				return $http({
					url: URLService.service('RestApiSaveCustomerRequest'),
					method: 'POST',
					data: {
						  url : "customerrequest/save"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			}
		}
	});