/*
Name: UsersService
Description: Service which handles REST Calls for Users
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.factory('UsersService', function($http, URLService, $rootScope) {
		var oUser = null;

		return {
			fnAddUserData: function(oDataParams) {
				return $http({
					url: URLService.service('addUser'),
					method: 'POST',
					data: {
						  url : "user/save"
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});
			},
			fnGetAllUsersData : function(){
				return $http({
					method: 'GET', 
					url: URLService.service('customerList'), 
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				});
			},
			fnDeleteUser : function(oDataParams){
				return $http({
					method: 'POST', 
					url: URLService.service('userDelete'), 
					data: {
						url: 'user/delete'
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				});
			},
			fnGetUserById : function(oDataParams){
				return $http({
					method: 'POST', 
					url: URLService.service('getUserDetails'), 
					data: {
						url: 'user/details'
						, data : JSON.stringify(oDataParams)
					},
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					} 
				});
			}
		}
	});