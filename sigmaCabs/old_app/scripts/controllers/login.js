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
	.controller('LoginController', function($scope, $window, URLService) {
		console.log('login controller');
		/*
		name : fnLogin
		descriptoin: redirects to dashboard.html after validation.
		*/
		$scope.fnLogin = function() {
			// alert('submitted');
			$window.location = URLService.page('dashboard');
		}

	});