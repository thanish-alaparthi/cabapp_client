/*
Name: HeaderController
Description: Main controller to handle search Boxes.
Date: 23Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('HeaderController', function($scope, $rootScope, URLService, $dialog) {
		$scope.displayName = 'loading user info...';

		/*
			watch the event where session has returned proper userInfo.
		*/
		$scope.$on('userInfoFromSession', function(ev, oData) {
			$scope.displayName = oData.displayName;

		});

	});