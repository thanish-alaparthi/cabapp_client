/*
Name: UsersService
Description: Service which handles REST Calls for Users
Date: 05Jan2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('DispatchService', function($http, URLService, $rootScope) {
        var oUser = null;

        return {
            fnFindVehicleByMobile: function(oDataParams) {
                return $http({
                    url: URLService.service('RestApiDefaultEmpty'),
                    method: 'POST',
                    data: {
                        url: "vehicle/search",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnAddDispatchData: function(oDataParams) {
                return $http({
                    url: URLService.service('dispatchVehicle'),
                    method: 'POST',
                    data: {
                        url: "vehicledriverbooking/assign",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetDisBookingData: function() {
                return $http({
                    method: 'GET',
                    url: URLService.service('getAllAvailBookings'),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },
            fnGetDisVehiData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getAllAvailVehicles'),
                    data: {
                        url: "vehicle/available",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnGetAllDrivData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getAllAvailVehicles'),
                    data: {
                        url: "user/specific",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnSendLogDetails: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('getVehicleDetails'),
                    data: {
                        url: "vehicle/activity",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleLogin: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/login",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnChangeVehicleStatus: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/statechange",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnChangeVehiclePhone: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/mobilechange",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleChangeLocation: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/locationchange",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBreakStart: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/breakstart",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBreakStop: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/breakend",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleLogout: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/logout",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleConfirm: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/dispatch",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBookingStart: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/start",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBookingClose: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/close",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleComplaint: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/complaint",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleSuggestion: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/complaint", // should change to suggestion API
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBreakDown: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/saveBreakDownInfo",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleChangeTariff: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/saveTariffChangeInfo",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnChangeVehicle: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/saveVehicleChangeInfo",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleBookingCancel: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/cancel", // should change to suggestion API
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnUpdateVehPickupLocation: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "booking/savePickupChangeInfo",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnLoadCurrentDayData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/getCurrentDayStatistics",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnLoadCurrentMonthData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/getCurrentMonthStatistics",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnLoadLastMonthData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/getMonthStatistics",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnLoadVehicleData: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/getVehicleStandardInfo",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleAcceptBooking: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/acceptBooking",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnVehicleRejectBooking: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "vehicle/rejectBooking",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            },

            fnGetCustomerDetails: function(oDataParams) {
                return $http({
                    method: 'POST',
                    url: URLService.service('RestApiDefaultEmpty'),
                    data: {
                        url: "customer/getCustomerDetails",
                        data: JSON.stringify(oDataParams)
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
        }
    });