/*
Name: breaksController
Description: breaksController
Date: 23March2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('breaksController', function($rootScope, $scope,$timeout, $http, BookingService, PrerequisiteService, PreConfigService, URLService, UsersService, VehiclesService, appUtils) {

		var scope = $scope;
		console.log('inside breaksController');

		scope.showBreakStartBtn = true;

		scope.breakTimings = '00:00:00';

		scope.oDate = new Date();

		scope.fnBreakStart = function(){
			scope.showBreakStartBtn = false;

			scope.breakTimingCounter = 0;

			scope.oDate.setHours(0);
			scope.oDate.setMinutes(0);
			scope.oDate.setSeconds(0);

			// scope.fnUpdateBreakTime();

			scope.interval = setInterval(scope.fnUpdateBreakTime,1000);
		};

		scope.fnBreakEnd = function(){
			scope.showBreakStartBtn = true;

			scope.breakTimingCounter = 0;

			clearInterval(scope.interval);
		};
		

		scope.fnUpdateBreakTime = function(){

			if(!scope.showBreakStartBtn) {
				
				scope.oDate.setSeconds(scope.oDate.getSeconds() + 1 );

				scope.breakTimingCounter += 1;

				var HH = scope.oDate.getHours(),
					MM = scope.oDate.getMinutes(),
					SS = scope.oDate.getSeconds();

				HH = HH <=9 ? '0'+ HH : HH;
				MM = MM <=9 ? '0'+ MM : MM;
				SS = SS <=9 ? '0'+ SS : SS;

				scope.breakTimings =  HH + ':' + MM + ':' + SS;
				
				$('#breakTimeDisplayID').html( HH + ':' + MM + ':' + SS);
			}
		}

	});