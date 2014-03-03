/*
Name: easyBookingApp
Description: Main Application module controller for login Page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.run(function(AuthenticationService, $window, URLService) {

		// check for userSession.. and redirect to dashboard if session exists.
		AuthenticationService.getSession()
			.success(function(data) {
				if (data.status == 200) {
					// $window.location = URLService.page('dashboard');

				}
			});
	})
	.controller('LoginController', function($scope, $rootScope, $window, $http, URLService) { //, serverService
		console.log('login controller');
		var scope = $scope;

		//Making it true will show the upper navigation bar 
		scope.canShowNav = false;
		/*
		name : fnLogin
		descriptoin: redirects to dashboard.html after validation.
		*/
		scope.fnLogin = function() {
			console.log(scope.loginUserName);
			console.log(scope.loginPassword);
			if(scope.loginUserName == '' || scope.loginPassword == '') {
				alert('Plese enter valid username and password');
				return false;
			}
			var oData = {
				'userName': scope.loginUserName,//'lajpathrai',
				'password': scope.loginPassword //'test@123'
			}
			//serverService.sendData('P','user/login', oData, scope.loginSucess, scope.loginFailure);
			$http({
				'method': 'POST',
				'url': URLService.serviceRoot,
				'data': {
					'url': 'user/login',
					'data': JSON.stringify(oData)
				},
				'headers': {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
				.success(function(data, status, headers, config) {
					if (status == 200) {
						//check for the valid format of the data, else through into the error callback
						var isValidData = (data && data.status) || false;
						if ((isValidData) && (data.status == 200)) {
							var data = data.result;
							scope.loginSucess(data);
						} else {
							scope.loginFailure(data);
						}
					} else {
						scope.loginFailure(data);
					}
				})
				.error(function(data, status, headers, config) {
					/* May be we need to ask for header 401 from server, if login session expires.
		  				So that we can force logout the client. */
					if (status == 401) {
						$rootScope.$broadcast('forceLogout');
					}
					scope.loginFailure(data);
				})
		};

		scope.loginSucess = function(data) {
			$rootScope.$broadcast('userInfoFromSession', {
				"displayName": data[0].name || '',
				"role": data[0].userType,
				"id": data[0].id
			});
			$window.location = URLService.page('dashboard');
		}

		scope.loginFailure = function(data) {
			alert('Error in login');
		}

	});