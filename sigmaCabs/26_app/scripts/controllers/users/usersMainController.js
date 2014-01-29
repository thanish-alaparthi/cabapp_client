/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.run(function(AuthenticationService, $window, URLService,UsersService,  $rootScope) {
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
	.controller('usersMainController', function($scope, $rootScope, URLService, UsersService, $dialog, modalWindow) {

		var scope = $scope
		$scope.customerList = URLService.view('usersList');

		scope.close = function() {
			dialog.close();
		};

		scope.fnAddUser = function() {
			console.log('add fnAddUser');
			$scope.opts = {
				templateUrl: 'views/users/usersModal.html',
				controller: 'usersAddUpdateController',
				dialogClass: 'modalClass',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oUser : function(){
						return {"userId" : null}
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};
		scope.fnEditUser = function() {
			console.log('fnEditUser...');
			console.log('scope.selectedUser', scope.selectedUser);
			if(!scope.selectedUser){
				alert('Please select a user from the list to edit.');
				return;
			}
			$scope.opts = {
				templateUrl: 'views/users/usersModal.html',
				controller: 'usersAddUpdateController',
				dialogClass: 'modalClass',
				resolve: {
					editMode: [
						function() {
							return false;
						}
					],
					oUser : function(){
						return {"userId" : scope.selectedUser.id}
					}
				}
			};
			modalWindow.addDataToModal($scope.opts);
		};
		scope.fnDeleteUser = function() {
			console.log('scope.selectedUser', scope.selectedUser);
			if(!scope.selectedUser){
				alert('Please select a user from the list to delete.');
				return;
			}
			if(confirm("Are you sure you want to delete the selected user?")){
				UsersService.fnDeleteUser({
					id: scope.selectedUser.id
				})
				.success(function(data, status, headers, config){
					console.log('success fnDeleteUser: ',data);					
					scope.selectedUser = null;

					if(data && data.message && data.message.user){
						alert(data.message.user);
					}
					$rootScope.$broadcast('eventUserDeleted', true);
				})
				.error(function(data, status, headers, config){
					console.log('Error fnDeleteUser: ',data)
				});
			}
		};

		scope.$on('eventUserSelectedFromList', function(ev, oData) {
			scope.selectedUser = oData;
		});
	});