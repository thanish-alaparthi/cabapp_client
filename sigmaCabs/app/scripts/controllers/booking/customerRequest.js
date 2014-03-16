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

		// set current Date for pickup date
		scope.dpCurrentDate = PrerequisiteService.fnFormatDate();
		scope.hours = PrerequisiteService.hours;
		scope.minutes = PrerequisiteService.minutes;

		scope.customerName = oCustomer.name;
		scope.customerMobile = oCustomer.mobile || oCustomer.mobile2 ;

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
		scope.travelTypes = PrerequisiteService.fnGetTravelTypes();
		scope.dateDetails = {
			multiDates : []
		};

		scope.fnRestApiError = function(data, status, headers, config){
			console.log("error fnSaveCustomerRequest",data);
		};
		scope.fnRestApiSuccess = function(data, status, headers, config){
			console.log("success fnSaveCustomerRequest", data);
			scope.close();
		};


		scope.close = function() {
			dialog.close();
		};
		scope.fnSaveAndCloseRequest = function() {
			var oSave = {};
			
			oSave.customerId = oCustomer.id;
			oSave.name  = oCustomer.name;
			oSave.mobile  = oCustomer.mobile;
			oSave.priority = scope.iPriority;

			switch(scope.tab){
				case 1: 	// Regular Save
					oSave.datesRequired = scope.dateDetails.multiDates;

					oSave.pickupTime = scope.regularRequestDetails.pickupHours + ':' + scope.regularRequestDetails.pickupMinutes + ':00';
					oSave.pickupPlace = scope.regularRequestDetails.pickupPlace;
					oSave.dropPlace = scope.regularRequestDetails.dropPlace
					oSave.totalDays = scope.regularRequestDetails.totalDays;
					oSave.comments = scope.regularRequestDetails.comments;
					if(!oSave.datesRequired.length){
						alert('Please add dates.');
						return;
					}

					if(!oSave.comments){
						alert('Please add a comment');
						return;
					}

					if(!oSave.pickupPlace){
						alert('Please add a pickup place.');
						return;
					}
					if(!oSave.dropPlace){
						alert('Please add a drop place.');
						return;
					}

					CustomerService.fnSaveRegularRequest(oSave)
					.success(scope.fnRestApiSuccess)
					.error(scope.fnRestApiError);
				break;
				case 2: 	// corporate Save
					oSave.companyName = scope.corporateRequestDetails.companyName;
					oSave.email = scope.corporateRequestDetails.email;
					oSave.website = scope.corporateRequestDetails.website;
					oSave.authorizedPerson = scope.corporateRequestDetails.contactPerson;
					oSave.mobile1 = scope.corporateRequestDetails.contact1;
					oSave.mobile2 = scope.corporateRequestDetails.contact2;
					oSave.address = scope.corporateRequestDetails.companyAddress;
					oSave.comments = scope.corporateRequestDetails.comments;

					CustomerService.fnSaveCorporateRequest(oSave)
					.success(scope.fnRestApiSuccess)
					.error(scope.fnRestApiError);
				break;
				case 3: 	// Special Save
					oSave.travelType = scope.specialRequestDetails.travelType;
					oSave.authorizedPerson = scope.specialRequestDetails.contactPerson;
					oSave.mobile1 = scope.specialRequestDetails.contact1;
					oSave.mobile2 = scope.specialRequestDetails.contact2;
					oSave.address = scope.specialRequestDetails.address;
					oSave.comments = scope.specialRequestDetails.comments;
					
					CustomerService.fnSaveSpecialRequest(oSave)
					.success(scope.fnRestApiSuccess)
					.error(scope.fnRestApiError);
				break;
				case 4: 	// Others Save
					oSave = scope.otherRequestDetails;
				break;
			};

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

	});