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
	.controller('LoginController', function($scope, $rootScope, $window, $http, URLService, serverService) {
		console.log('login controller');
		var scope = $scope;

		//Making it true will show the upper navigation bar 
		scope.canShowNav = false;
		/*
		name : fnLogin
		descriptoin: redirects to dashboard.html after validation.
		*/
		/*
			Temporary - till the time we get registration and logout of new users
		*/
		scope.loginUserName = 'lajpathrai';
		scope.loginPassword = 'test@123';

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
			serverService.sendData('P','user/login', oData, scope.loginSucess, scope.loginFailure);
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