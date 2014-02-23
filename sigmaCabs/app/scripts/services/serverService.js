//Data model to communicate with server
angular.module('sigmaCabsApp')
.factory('serverService', function($rootScope, $http, stubService){
	var baseUrl = "http://localhost/proxy.php";
	var serverService = function(data){
		angular.extend(this, data);
	}
	serverService.sendData = function(method, url, data, sucessCallback, errorCallback){
		var methods = {'P':'POST','G':'GET'};
		$http({
				method: methods[method] || 'POST', 
				url: baseUrl, 
				data: {'url':url,'data':data},
				headers : {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(function(data, status, headers, config) {
				if(status == 200){
					//check for the valid format of the data, else through into the error callback
					/*var isValidData = (data && data.response && data.response.stat) || false;
						if((isValidData) && (data.response.stat == 'SUCCESS')  ){*/
							sucessCallback(data);
						/*} else{
							errorCallback(data);
						}*/
				}else{
					errorCallback(data);
				}
		  })
		  .error(function(data, status, headers, config) {
		  	/*
		  		May be we need to ask for header 401 from server, if login session expires.
		  		So that we can force logout the client.
		  	*/
				if(status == 401){
					$rootScope.$broadcast('forceLogout');
				}
		  	errorCallback(data);
		  })
	};
	serverService.stubData = function(configData, sucessCallback, errorCallback){
		var data = stubService.getStubData(configData);
		sucessCallback(data);
	};
	serverService.showGlobalError = function(){
		/*
			show some global error via some global application error showing mechanism 
			(may be a toaster can be used)
		*/
	}
	return serverService;
});