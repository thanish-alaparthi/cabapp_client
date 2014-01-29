/*
Name: usersOpsController
Description: Main controller to handle users tab.
Date: 03/12/1987
Author: chot2::dev.chot2@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('usersAddUpdateController', function(oUser, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, UsersService,VehiclesService, appUtils) {
		var scope = $scope,
			oDate = new Date(),
			yyyy = oDate.getFullYear().toString(),
			mm = (oDate.getMonth() + 1).toString(),
			dd = oDate.getDate().toString(),
			currentDate = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),
			nextYearDate = (parseInt(yyyy) + 1) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);

		scope.userDetObj = {};
		scope.fromSaveAndExit = false;

		scope.user = {};

		console.log('PassedUserDetails: ', oUser);

		scope.vehicleList = [];

		// get the list of vehicles 
		VehiclesService.fnGetVehiclesDD()
		.success(function(data, status, headers, config) {
			console.log('Success fnGetVehiclesDD: ', data);
			for(var i=0;i<data.length;i++){
				scope.vehicleList.push({
					id: data[i].id,
					code: data[i].id
				});
			}
		})
		.error(function(data, status, headers, config) {
			console.log('Error fnGetVehiclesDD: ', data);
		});


		/*
		Function to set the default user data
		*/
		scope.fnSetDefaultUserData = function() {
			scope.user.userType = '6'; // Call-Taker
			scope.user.basicDetails = {
				dob: currentDate,
				jobCategory: '1', // Permanant
				addresses: [{
					type: '1' // Permanant Address
				}, {
					type: '2' // Present Address
				}]
			};
			scope.user.professionalDetails = { // Professional Details
				educationDetails: [],
				pastExperience: []
			};
			scope.user.driverDetails = { // Driver Details
				liscenseDetails: {
					issuedDate: currentDate
				},
				badgeDetails: {
					expiryDate: currentDate
				},
				currentVehicleAttached: {
					issueDate: currentDate,
					expiryDate: nextYearDate,
					assignedOnDate: currentDate
				}
			};
		}
		/*
		EOF : Function to set the default user data
		*/

		// Check for edit or add mode
		if (oUser.userId) { // edit Mode
			UsersService.fnGetUserById({
				"id" : oUser.userId
			})
			.success(function(data, status, headers, config) {
				console.log('Success fnGetUserById: ', data);
				data.userType = data.userType.toString();
				scope.user = data;
			})
			.error(function(data, status, headers, config) {
				console.log('Error fnGetUserById: ', data);
			});

		} else { // AddNew Mode
			scope.fnSetDefaultUserData();
		}

		scope.close = function() {
			dialog.close();
		};


		/*
            Setup for basic details 
        */
		scope.userTypes = PrerequisiteService.userTypes;
		scope.userJobCategories = PrerequisiteService.userJobCategories;
		/*
            EOF : Setup for basic details 
        */


		scope.tabs = [{
			"label": 'Personal Details',
			"tooltip": 'Personal Details',
			"id": 0,
			"selected": true,
			"showTab": true,
			"template": URLService.view('userPersonalDetailsTab')
		}, {
			"label": 'Professional Details',
			"tooltip": 'Professional Details',
			"id": 1,
			"selected": false,
			"showTab": false,
			"template": URLService.view('professionalDetailsTab')
		}, {
			"label": 'Driver Details',
			"tooltip": 'Driver Details',
			"id": 2,
			"showTab": false,
			"selected": false,
			"template": URLService.view('driverDetailsTab')
		}];

		var tabCounter = 0;
		wizardHandler.setSteps(scope.tabs);
		// Show the first tab by default
		wizardHandler.setStep(0);
		scope.tabs[0].selected = true;
		wizardHandler.showCurrentTab();
		scope.previousSelectedTab = null;
		scope.currentSelectedTab = scope.tabs[0].id;
		scope.currentlyClickedTab = null;
		scope.wizardHandler = wizardHandler;

		scope.handleTabClick = function(clickedid) {
			if (scope.currentSelectedTab == clickedid) {
				return;
			}
			//scope.hideErrorMsg();
			scope.setTabSelection(clickedid);
		};

		/*
		    Method description: Set the tab selection
		    PARAMS: Currently selected tab
		*/
		scope.setTabSelection = function(id) {
			scope.currentlyClickedTab = id;
			scope.isNext = true;
			$scope.$broadcast('getTabData');
			scope.changeTab(id);
		};

		/*
	    Method description: Change the tab selection 
	    PARAMS: No params
	  */
		scope.changeTab = function(id) {
			tabCounter = 0;
			scope.tabs[scope.currentSelectedTab].selected = false;
			scope.tabs[id].selected = true;
			scope.previousSelectedTab = scope.currentSelectedTab;
			scope.currentSelectedTab = id;
			wizardHandler.setStep(id);
			wizardHandler.showCurrentTab();
			scope.wizardHandler = wizardHandler;
		};

		scope.handleNext = function() {
			$scope.$broadcast('getTabData');
		};

		scope.handleSaveAndExit = function(user) {
			scope.fromSaveAndExit = true;
			scope.handleNext();

			console.log('Final User Data', scope.user);

			UsersService.fnAddUserData(scope.user)
				.success(function(data, status, headers, config) {
					console.log('Success: ', arguments);
					if (data && data.message && data.message.length) {
						for (var i = 0; i < data.message.length; i++) {
							var msg = data.message[i]['user'] || data.message[i]['address'] || data.message[i]['education'] || data.message[i]['employment'] || data.message[i]['driver']
							alert(msg);
						}
					}

				})
				.error(function(data, status, headers, config) {
					console.log('Error: ', arguments);
				})
		};

		scope.$on('sendTabData', function(event, data) {
			scope.userDetObj = appUtils.mergeObj(scope.userDetObj, data.detObj);
			console.log(scope.userDetObj);
		});

		scope.$on('showNext', function() {
			scope.showNext = true;
		});


	});