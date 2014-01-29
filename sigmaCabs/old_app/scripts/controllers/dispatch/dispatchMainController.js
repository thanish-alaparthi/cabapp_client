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
	.controller('dispatchMainController', function($scope, $rootScope, URLService, $dialog, modalWindow, dispatchService, $location) {

		var scope = $scope;
		$scope.dispatchersList = URLService.view('dispatchersList');
		$scope.dispVehicleList = URLService.view('dispVehicleList');
		$scope.splitView = false;
		$scope.dispatchObj  = {
			'bookingId' : ''
		};

		$scope.vehicleLogin = function(){
			$scope.opts = {
				templateUrl: URLService.view('vehicleLogin'),
				controller: 'vehicleLoginController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};

		scope.vehicleLogout = function(){
			$scope.opts = {
				templateUrl: URLService.view('vehicleLogin'),
				controller: 'vehicleLogoutController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};

		$scope.breakStart = function(){
			$scope.opts = {
				templateUrl: URLService.view('breakDetails'),
				controller: 'breakStartController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};


		$scope.breakEnd = function(){
			$scope.opts = {
				templateUrl: URLService.view('breakDetails'),
				controller: 'breakEndController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};

		$scope.startReport = function(){
			$scope.opts = {
				templateUrl: URLService.view('reportDetails'),
				controller: 'vehicleLoginController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};

		$scope.closeReport = function(){
			$scope.opts = {
				templateUrl: URLService.view('vehicleLogin'),
				controller: 'vehicleLoginController',
				dialogClass: 'smallModalClass'
			};
			modalWindow.addDataToModal($scope.opts);

		};

		

		$rootScope.$on('showVehicleGrid', function(){
			$scope.showVehicleDetView = true;
			$scope.splitView = true;
			//$scope.vehicleGridOptions.$gridScope.columns[0].toggleVisible();
		});

		

		scope.getDisptachDetails = function(){
			$rootScope.$broadcast('getDispatchDetails');

		};

		$scope.$on('selectedBookingDet', function(event, data) {
			console.log(data);
			$scope.dispatchObj['bookingId'] = data[0].id;
		});
		$scope.$on('selectedVehicleDet', function(event, data) {
			console.log(data);
			$scope.dispatchObj['vehicleId'] = data;			
		});




		$scope.dispatchVechile = function() {
			//var data = {"vehicleId":["6"],"bookingId":"5"}
			$scope.getDisptachDetails();
			console.log($scope.dispatchObj);
			dispatchService.fnAddDispatchData($scope.dispatchObj)
			.success(function(data, status, headers, config){
				$location.path('/dispatch');				
			})
			.error(function(data, status, headers, config){
				console.log('Error: ', data)
			});

		};

		$scope.close = function(){
			dialog.close();
		};



	});