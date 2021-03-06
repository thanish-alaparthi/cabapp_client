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
	.controller('vehicleMainController', function($scope, $rootScope, URLService, $dialog, modalWindow) {

		var scope = $scope
		

		scope.close = function() {
			dialog.close();
		}
		$scope.vehicleList = URLService.view('vehicleList');

		// fn: fnAddVehicle
		// opens add vechicle modal window
		scope.fnAddVehicle = function() {
			$scope.opts = {
				templateUrl: 'views/vehicles/vehicleModal.html',
				controller: 'vehicleAddUpdateController',
				dialogClass: 'modalClass',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oVehicle : function(){
						return {"vehicleId" : null}
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};
		// fn: fnEditVehicle
		// opens Edit vechicle modal window
		scope.fnEditVehicle = function() {
			if(!scope.selectedVehicleDetails) {
				alert('Please select a vehicle from the list to edit.');
				return;
			}
			// scope.selectedVehicleDetails.vehicleId = scope.selectedVehicleDetails.id;
			$scope.opts = {
				templateUrl: 'views/vehicles/vehicleModal.html',
				controller: 'vehicleAddUpdateController',
				dialogClass: 'modalClass',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oVehicle : function(){
						return scope.selectedVehicleDetails
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};



		scope.$on('eventVehicleSelectedFromList', function(ev, oData) {
			scope.selectedVehicleDetails = oData;
		});


		scope.close = function() {
			dialog.close();
		}
	});