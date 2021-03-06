/*
Name: VehiclesService
Description: Service which handles REST Calls for Vehicles
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('VehiclesService', function($http, URLService, $rootScope) {
        var oUser = null;

        return {

            fnGetAllVehiclesData: function() {
                return $http({
                    method: 'GET',
                    url: URLService.service('getAllVehicles'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetAvailabeVehicles: function() {
                return $http({
                    method: 'GET',
                    url: URLService.service('getAvailableVehicles'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetVehiclesDD: function() {
                return $http({
                    method: 'GET',
                    url: URLService.service('getAllVehicles'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetVehicleDataById: function(oDataParams) {
                console.log('dataParams',oDataParams);
                return $http({
                    method: 'POST',
                    url: URLService.service('getVehicleDetails'),
                    data :{
                        url  : 'vehicle/details',
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnAddVehicleData: function(oDataParams) {
                return $http({
                    url: URLService.service('addVehicle'),
                    method: 'POST',
                    data: {
                        url: "vehicle/save",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });

            },
            fnUpdateVehicleData: function(oDataParams) {
                return $http({
                    url: URLService.service('updateVehicle'),
                    method: 'POST',
                    data : {
                        url: 'vehicle/save',
                        data: JSON.stringify(oDataParams)   
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetVehicleOwnersList: function() {
                return $http({
                    method: 'GET', 
                    url: URLService.service('customerList'), 
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    } 
                });
            },
            fnGetAvailableVehicles: function(oDataParams) {
                return $http({
                    url: URLService.service('RestApiDefaultEmpty'),
                    method: 'POST',
                    data : {
                        url: 'vehicle/getAvailability',
                        data: JSON.stringify(oDataParams)   
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetOverAllStatistics: function(oDataParams) {
                return $http({
                    url: URLService.service('RestApiDefaultEmpty'),
                    method: 'POST',
                    data : {
                        url: 'vehicle/getOverallStatistics',
                        data: JSON.stringify(oDataParams)   
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
        }
    });
