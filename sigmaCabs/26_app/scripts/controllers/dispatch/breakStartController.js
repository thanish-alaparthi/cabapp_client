/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
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
	.controller('breakStartController', function($scope, $rootScope, URLService, $dialog, modalWindow, dialog, dispatchService) {
		console.log('breakStartController');
		$scope.modalHeading = 'Duty Break Start';


		var activity = {
			"userType":"1"
		};

		dispatchService.fnGetAllDrivData(activity)
		.success(function(data, status, headers, config){
			console.log('Success: ', data);
			$scope.driversList = data;
		})
		.error(function(data, status, headers, config){
			console.log('Error: ', data)
		});

		//$scope.driversList = ["SAmeer", "Gandhar", "Thanish", "Driver1", "Driver2", "Driver3", "Driver4"];

		$scope.handleSave =  function(){
			$scope.VehicleLoginObj = {};
			$scope.VehicleLoginObj['driverId'] = $scope.chosenDriver;
			$scope.VehicleLoginObj['location'] = $scope.chosenPlace;
			$scope.VehicleLoginObj['comments'] = $scope.vehicleComments;
			$scope.VehicleLoginObj['activity'] = "2";
			
			dispatchService.fnSendLogDetails($scope.VehicleLoginObj)
			.success(function(data, status, headers, config){
				console.log('Success: ', data);
				$scope.close();
			})
			.error(function(data, status, headers, config){
				console.log('Error: ', data)
			});		
		};

		$scope.close = function(){
			dialog.close();
		};
	});