/*
Name: blockCustomer
Description: blockCustomer
Date: 14Jan2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('blockCustomer', function(oCustomer, $scope, $dialog, dialog, wizardHandler, $http, PrerequisiteService, URLService, CustomerService, appUtils) {

		var scope = $scope;
		console.log('inside blockCustomer', oCustomer);

		scope.comments = "";

		scope.customerName = oCustomer.name;
		scope.customerPhone = oCustomer.mobile;

		scope.priorityId = '1';
		scope.reasonId = '1';
		scope.priorities = PrerequisiteService.priorities;
		scope.reason = PrerequisiteService.fnGetReasonsById(1);

		scope.close = function() {
			dialog.close();
		}
		scope.fnSaveAndCloseBlockCaller = function() {
			
			if(!oCustomer.id 
				|| !scope.reasonId
				|| !scope.priorityId
				|| scope.comments.replace(/ /g, "") == "") {

				alert('All fields are mandatory.');
				return false;
			}


			CustomerService.fnBlockCustomer({
				customerId : oCustomer.id,
				reasonId : scope.reasonId,
				priority : scope.priorityId,
				comments : scope.comments
			})
			.error(function(data, status, headers, config){
				console.log("error fnSaveCustomerRequest",data);
			})
			.success(function(data, status, headers, config){
				console.log("success fnSaveCustomerRequest", data);
				scope.close();
			});
			scope.close();
		}

	});