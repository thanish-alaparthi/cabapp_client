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
			fnSaveRegularRequest: function(oDataParams) {
				return $http({
					url: URLService.service('RestApiRegularRequest'),
					method: 'POST',
					data: {
						  url : "booking/saveRegularEnquiryInfo"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnSaveCorporateRequest: function(oDataParams) {
				return $http({
					url: URLService.service('RestApiSaveCorporateRequest'),
					method: 'POST',
					data: {
						  url : "booking/saveCorporateEnquiryInfo"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnSaveSpecialRequest: function(oDataParams) {
				return $http({
					url: URLService.service('RestApiSaveSpecialRequest'),
					method: 'POST',
					data: {
						  url : "booking/saveSpecialEnquiryInfo"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			}
		}
	});