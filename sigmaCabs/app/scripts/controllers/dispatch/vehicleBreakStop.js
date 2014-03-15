/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('vehicleBreakStop', function(oVehicleData, DispatchService, $scope, $rootScope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils, serverService) {

		var scope = $scope,
			currentTimeStamp = new Date(),
			currentTimeMsec = currentTimeStamp.getTime(),
			currentTimeStampHrs = currentTimeStamp.getHours(),
			currentTimeStampMins = currentTimeStamp.getMinutes(),
			requestedTime = 0,
			breakStartTime = 0,
			breakStartDate, breakStartTimeStamp, totalBreakTimeInMins = 0,
			breakTimeDiff = 0;
		console.log('inside vehicleBreakStop', oVehicleData);
		//prefix 0 for hours & minutes 
		currentTimeStampHrs = (currentTimeStampHrs < 10) ? '0' + currentTimeStampHrs : currentTimeStampHrs;
		currentTimeStampMins = (currentTimeStampMins < 10) ? '0' + currentTimeStampMins : currentTimeStampMins;

		scope.vehicleDetails = oVehicleData;
		requestedTime = Math.abs(scope.vehicleDetails.vehicleMainDetails.details.requestedTime);
		breakStartTime = scope.vehicleDetails.vehicleMainDetails.details.breakTime;
		scope.breakStop = {};
		breakStartDate = PrerequisiteService.fnFormatDate(breakStartTime.split(' ')[0]);
		scope.breakStop.currentTimeDisplay = currentTimeStamp.getDate() + '/' + currentTimeStamp.getMonth() + '/' + currentTimeStamp.getFullYear() + ' ' + currentTimeStampHrs + ':' + currentTimeStampMins;
		scope.breakStop.requestedTimeText = PrerequisiteService.fnFormatMinutesToHoursAndMinutes(requestedTime);
		scope.breakStop.breakStartTimeDisplay = breakStartDate + ' ' + breakStartTime.split(' ')[1].substring(0, 5);
		breakStartTimeStamp = new Date(breakStartTime.split(' ')[0] + ' ' + breakStartTime.split(' ')[1]).getTime();
		totalBreakTimeInMins = Math.floor((currentTimeMsec - breakStartTimeStamp) / 1000 / 60); // Break time in Minutes
		console.log('breakStartTimeStamp: ' + breakStartTimeStamp);
		console.log('currentTimeStamp: ' + currentTimeMsec);
		console.log('totalBreakTime: ' + totalBreakTimeInMins);
		scope.breakStop.totalBreakTimeDisplay = PrerequisiteService.fnDiffInTwoDatesForDisplay(breakStartTimeStamp, currentTimeMsec);
		scope.breakStop.newLocation = scope.vehicleDetails.vehicleMainDetails.location;
		breakTimeDiff = totalBreakTimeInMins - requestedTime;
		console.log('breakTimeDiff: ' + breakTimeDiff);
		// Color code representation
		if (breakTimeDiff < 0) {
			scope.breakStop.breakColorCode = "green";
		} else if (breakTimeDiff <= 5) {
			scope.breakStop.breakColorCode = "orange";
		} else {
			scope.breakStop.breakColorCode = "red";
		}

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndClose = function() {
			var oData = {
				/*"driverId": scope.vehicleDetails.vehicleMainDetails.selectedDriver,*/
				"vehicleId": scope.vehicleDetails.vehicleMainDetails.id,
				"id": scope.vehicleDetails.vehicleMainDetails.details.breakId || '', // break start id, if already in break start
				"breakUsedTime": totalBreakTimeInMins,
				"location": scope.breakStop.newLocation,
				"lattitude": "12345.564",
				"longitude": "988756.345",
				"currentKms": scope.breakStop.currentKms
			};

			console.log(oData);
			// validations
			if (isNaN(oData.currentKms) || oData.location === '') {
				alert('Please enter valid information.');
				return false;
			}

			serverService.sendData('P',
				'vehicle/breakend',
				oData, scope.fnVehicleBreakStopSuccess, scope.fnVehicleBreakStopError);
		}

		scope.fnVehicleBreakStopSuccess = function(data, status, headers, config) {
			console.log('Success: ', data);
			scope.close();
			//alert(data.result[0].message);
			$rootScope.$emit('eventGetVehicleStatus', null);
		};
		scope.fnVehicleBreakStopError = function(data, status, headers, config) {
			console.log('Error: ', data);
		};
	});