/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.run(function(AuthenticationService, $window, URLService, $rootScope) {

		// check for userSession.. and redirect to login screen if session dznt exists.
		AuthenticationService.getSession()
			.success(function(oData) {
				$rootScope.$broadcast('userInfoFromSession', {
					"displayName": "Mario Ray",
					"role": 1,
					"id": 234565434
				});
				return;
				if (oData.status != 200) {
					$window.location = URLService.page('logout');

				} else {
					// trigger the event to show all the userName
					$rootScope.$broadcast('userInfoFromSession', oData.result.userInfo);

				}
			})
	})
	.controller('dispatchFeedback', function($scope, $rootScope, $dialog, dialog, URLService, modalWindow, DispatchService) { //$dialog,
		console.log('dispatchFeedback');

		var scope = $scope;

		scope.close = function() {
			dialog.close();
		};
	});