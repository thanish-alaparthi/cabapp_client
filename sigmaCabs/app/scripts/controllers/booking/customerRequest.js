/*
Name: customerRequest
Description: customerRequest
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('customerRequest', function(oBooking,oCustomer, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, UsersService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside customerRequest', oBooking, oCustomer);





		scope.saveText = 'Save Regular Booking';	//default text for save button.

		scope.customerName = oCustomer.name;
		scope.customerMobile = oCustomer.mobile1;

		// set default values for request form
		scope.regularRequestDetails = {};
		scope.corporateRequestDetails = {};
		scope.specialRequestDetails = {};
		scope.otherRequestDetails = {};

		scope.tmpMultiDates = PrerequisiteService.fnFormatDate();

		scope.tab = 1;

		scope.fnIsActive = function(iTab){
			return scope.tab == iTab ? true : false;
		};

		scope.iPriority = '1';
		scope.priorities = PrerequisiteService.priorities;
		scope.multiDates = [];

		scope.close = function() {
			dialog.close();
		};
		scope.fnSaveAndClose = function() {
			var oSave = {};
			switch(scope.tab){
				case 1:
					oSave = scope.regularRequestDetails;
					oSave.datesRequired = scope.multiDates;
				break;
				case 2:
					oSave = scope.corporateRequestDetails;
				break;
				case 3:
					oSave = scope.specialRequestDetails;
				break;
				case 4:
					oSave = scope.otherRequestDetails;
				break;
			};

			oSave.customerId = oCustomer.id;
			oSave.name  = oCustomer.name;
			oSave.mobile  = oCustomer.mobile;
			oSave.priority = scope.iPriority;

			CustomerService.fnSaveCustomerRequest(oSave)
			.success(function(data, status, headers, config){
				console.log("success fnSaveCustomerRequest");
			})
			.error(function(data, status, headers, config){
				console.log("error fnSaveCustomerRequest");
			});


			scope.close();
		};

		scope.fnChangeSaveText = function(){
			switch(scope.tab){
				case 1:
					scope.saveText = 'Save Regular Booking'
				break;
				case 2:
					scope.saveText = 'Save Corporate Enquiry'
				break;
				case 3:
					scope.saveText = 'Save Special Request'
				break;
				case 4:
					scope.saveText = 'Save Other Request'
				break;
			}
		};

		scope.$watch('multiDates',function(oldVal, newVal){
          console.log('MyDates::', scope.multiDates);
        });

        scope.fnDateAdded = function(sMultiDateName,oNewDate ){
        	console.log('>>>>>>>>>>>>>>>>>>>>>>>',scope.multiDates.getDate());
        	scope[sMultiDateName].push(oNewDate);
          	scope.tmpDates = scope.multiDates.join();          	
        }

	});