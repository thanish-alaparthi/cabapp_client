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
    .controller('dispatchMainController', function($scope, $rootScope, URLService, DispatchService, $routeParams, PrerequisiteService, $dialog, modalWindow) {
        var scope = $scope;

        scope.dispatcherMainView = URLService.view('dispatcherMainView');
        scope.vehicleInformationForm = URLService.view('vehicleInformationForm');
        scope.vehicleLoginForm = URLService.view('vehicleLoginForm');
        scope.vehicleVacantForm = URLService.view('vehicleVacantForm');
        scope.vehicleAllotForm = URLService.view('vehicleAllotForm');
        scope.currentMonthData = URLService.view('currentMonthData');
        scope.bookingStatistics = URLService.view('bookingStatistics');
        scope.lastMonthHistory = URLService.view('lastMonthHistory');
        scope.vehicleData = URLService.view('vehicleData');
        scope.vehiclePerformance = URLService.view('vehiclePerformance');
        scope.chatForm = URLService.view('chatForm');

        scope.callerPhone = $routeParams.mobile;
        scope.callerInfo = "";
        console.log(scope.callerPhone);

        scope.vehicleMainDetials = {};
        scope.tmpDetails = {};

        // add dropdwon fields
        scope.hours = PrerequisiteService.hours;
        scope.minutes = PrerequisiteService.minutes;
        scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
        scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
        scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();
        scope.subJourneyTypes = PrerequisiteService.fnGetAllJourneyTypes();

        scope.fnInit = function() {
            // since mobile is passed, hit server to get vehicleDetails Based on the server
            if (scope.callerPhone) { // mobile passed
                // make a call to server to get the user details...
                DispatchService.fnFindVehicleByMobile({
                    mobile: $routeParams.mobile
                })
                    .success(function(data, status, headers, config) {
                        console.log('Success fnFindVehicleByMobile: ', typeof data, data);

                        if (typeof data != 'object') { // misMatched data is sent from the server.
                            scope.fnLoadUnexpectedError(); // show a red error msg.
                            return;
                        }

                        if (data.status == 500) { // no data found of vehicle/booking 
                            console.log('500 fnFindVehicleByMobile', data);
                            scope.callerInfo = " (New Caller)";
                            // make callPhone as mobile 
                            //scope.customerDetails.mobile = scope.callerPhone;
                        } else if (data.status == 200 && data.result) {
                            scope.fnSetVehicleDetails(data);
                        } else { // error in data.result object.
                            console.log('Erro in result: fnFindVehicleByMobile', data);
                        }

                        // scope.fnLoadDispactherView();
                    })
                    .error(function(data, status, headers, config) {
                        console.log('error fnFindVehicleByMobile: ', data);
                        alert('There was some error while getting vehicle details. ');
                        // scope.fnLoadDispactherView();
                    });
            } else {
                // scope.fnLoadDispactherView();
            }
        };

        // Main Controller Init Point
        // // waits until configuration/prerequisits data loads always
        // $rootScope.$on('eventPrerequisitsLoaded', function(){
        scope.fnInit();
        // });
        scope.fnSearchVehicle = function(sSearch) {
            console.log(sSearch);
            console.log('Searching by vehicle Id');

            DispatchService.fnFindVehicleByMobile({
                vcode: sSearch
            })
                .success(function(data, status, headers, config) {
                    if (data.status == 500) { // no data found of customer/booking 
                        console.log('500 fnSearchVehicle', data);
                        // make callPhone as mobile 
                        scope.customerDetails.mobile = scope.callerPhone;
                    } else if (data.status == 200 && data.result) {
                        //scope.fnSetCustomerDetails(data);
                        console.log('vehicle search success');
                        console.log(data);
                    } else { // error in data.result object.
                        console.log('Erro in result: fnSearchVehicle', data);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log('error fnSearchVehicle: ', data);
                    alert('There was some error while getting vehicle details. ');
                });

        }
        scope.fnMultipurposeSearch = function() {
            if (!isNaN(sSearch)) { // mobile  && sSearch.length == 10
                scope.fnSearchVehicle(scope.searchDetails.searchString);
            }
        };

        scope.fnSetVehicleDetails = function(oData) {
            console.log('in fnSetVehicleDetails ');
            console.log(oData.result);
            scope.vehicleMainDetials = oData.result;

            if (scope.vehicleMainDetials.details.vehicleType) {
                scope.tmpDetails.tmpVehicleType = scope.vehicleMainDetials.details.vehicleType;
            }
            if (scope.vehicleMainDetials.details.vehicleName) {
                scope.tmpDetails.tmpVehicleName = scope.vehicleMainDetials.details.vehicleName;
            }
        };

        // function to change sub-Journey Types
        /*scope.fnPopSubJourneyTypes = function() {
            scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.tmpDetails.tmpJourneyType);
            for (var i = 0; i < scope.subJourneyTypes.length; i++) {
                if (scope.subJourneyTypes[i].parentId == scope.tmpDetails.tmpJourneyType) {
                    scope.vehicleMainDetials.subJourneyType = scope.subJourneyTypes[i].id;
                    break;
                }
            }

        };*/
        // function to change VehicleNames
        scope.fnPopVehicleNames = function() {
            scope.tmpSelectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(scope.tmpDetails.tmpVehicleType);
            scope.tmpDetails.tmpVehicleName = "";
            scope.vehicleMainDetials.vehicleType = scope.tmpSelectedVehicleType.id;
            if (scope.vehicleNames) {
                for (var i = 0; i < scope.vehicleNames.length; i++) {
                    if (scope.vehicleNames[i].id == "") {
                        scope.vehicleNames.splice(i, 1);
                    }
                }
                scope.vehicleNames.push({
                    vehicleType: '1', // any-vehicle default to small
                    id: '',
                    vehicleName: 'Any-Vehicle',
                    status: '1'
                });
            }

        };
        // function to change VehicleNames
        scope.fnPopVehicleTypes = function() {
            if (scope.tmpDetails.tmpVehicleName == "") {
                scope.tmpDetails.tmpVehicleType = '1';
                scope.vehicleMainDetials.vehicleName = "";
                return;
            }
            scope.tmpSelectedVehicleName = PrerequisiteService.fnGetVehicleNameById(scope.tmpDetails.tmpVehicleName);
            scope.tmpDetails.tmpVehicleType = scope.tmpSelectedVehicleName.vehicleType;

            scope.vehicleMainDetials.vehicleName = scope.tmpSelectedVehicleName.id;
        };

        scope.fnLoadDispactherView = function() {
            // scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');
        };
        scope.fnLoadUnexpectedError = function() {
            // scope.existingCustomerAddBooking = URLService.view('errorResponseFormatMisMatch');
            alert('in fnLoadUnexpectedError');
        };

        scope.vehicleDetails = {
            "vehicleId": "15",
            "driverId": "28"
        };

        scope.currentMonthGridDetails = [{
            'bookingId': '1',
            'srno': '1',
            'tripDate': '25/03/2014',
            'bookingCode': 'SCB099900001',
            'customerName': 'Aswin kumar Chowdary',
            'startTime': '11:20 PM',
            'pickup': 'Santosh Nagar',
            'drop': 'Airport',
            'vehicle': 'Indica',
            'package': '400KM 500rs',
            'status': 'Pending',
            'action': 'Button Here',
        }, {
            'bookingId': '2',
            'srno': '2',
            'tripDate': '25/03/2014',
            'bookingCode': 'SCB099900001',
            'customerName': 'Aswin kumar Chowdary',
            'startTime': '11:20 PM',
            'pickup': 'Santosh Nagar',
            'drop': 'Airport',
            'vehicle': 'Indica',
            'package': '400KM 500rs',
            'status': 'Closed',
            'action': 'Button Here',
        }, {
            'bookingId': '3',
            'srno': '3',
            'tripDate': '25/03/2014',
            'bookingCode': 'SCB099900001',
            'customerName': 'Aswin kumar Chowdary',
            'startTime': '11:20 PM',
            'pickup': 'Santosh Nagar',
            'drop': 'Airport',
            'vehicle': 'Indica',
            'package': '400KM 500rs',
            'status': 'Closed',
            'action': 'Button Here',
        }, {
            'bookingId': '4',
            'srno': '4',
            'tripDate': '25/03/2014',
            'bookingCode': 'SCB099900001',
            'customerName': 'Aswin kumar Chowdary',
            'startTime': '11:20 PM',
            'pickup': 'Santosh Nagar',
            'drop': 'Airport',
            'vehicle': 'Indica',
            'package': '400KM 500rs',
            'status': 'Pending',
            'action': 'Button Here',
        }, {
            'bookingId': '5',
            'srno': '5',
            'tripDate': '25/03/2014',
            'bookingCode': 'SCB099900001',
            'customerName': 'Aswin kumar Chowdary',
            'startTime': '11:20 PM',
            'pickup': 'Santosh Nagar',
            'drop': 'Airport',
            'vehicle': 'Indica',
            'package': '400KM 500rs',
            'status': 'Pending',
            'action': 'Button Here',
        }];


        scope.fnFeedback = function() {
            $scope.opts = {
                templateUrl: URLService.view('dispatchFeedback'),
                controller: 'dispatchFeedback',
                dialogClass: 'modalClass add-request',
                resolve: {}
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnChangeVehiclePhone = function() {
            $scope.opts = {
                templateUrl: URLService.view('changeVehiclePhone'),
                controller: 'changeVehiclePhone',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };
        scope.fnChangeVehicleStatus = function() {
            $scope.opts = {
                templateUrl: URLService.view('changeVehicleStatus'),
                controller: 'changeVehicleStatus',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };
        scope.fnVehicleChangeLocation = function() {
            $scope.opts = {
                templateUrl: URLService.view('changeVehicleLocation'),
                controller: 'changeVehicleLocation',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };
        scope.fnVehicleBreakStart = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBreakStart'),
                controller: 'vehicleBreakStart',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };
        scope.fnVehicleBreakStop = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBreakStop'),
                controller: 'vehicleBreakStop',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };
        scope.fnVehicleLogout = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleLogout'),
                controller: 'vehicleLogout',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingStart = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingStart'),
                controller: 'vehicleBookingStart',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingClose = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingClose'),
                controller: 'vehicleBookingClose',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingComplaint = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingComplaint'),
                controller: 'vehicleBookingComplaint',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        return scope.vehicleDetails
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.assetStateChartData = {
            "title": {
                "text": ''
            },
            "series": [{
                "data": [{
                    "name": "Login",
                    "y": 4,
                    "color": "#20B0A0"
                }, {
                    "name": "Collection",
                    "y": 18,
                    "color": "#2F7FD8"
                }]
            }]
        };

        scope.gridCurrentMonthData = {
            data: 'currentMonthGridDetails',
            rowHeight: 25,
            columnDefs: [{
                field: 'srno',
                displayName: 'B.No'
            }, {
                field: 'tripDate',
                displayName: 'V.T'
            }, {
                field: 'bookingCode',
                displayName: 'S.T'
            }, {
                field: 'customerName',
                displayName: 'D.T'
            }, {
                field: 'startTime',
                displayName: 'T.kms'
            }, {
                field: 'pickup',
                displayName: 'Amount'
            }, {
                field: 'drop',
                displayName: 'D.ML'
            }],
            enablePaging: false,
            showFooter: false,
            multiSelect: false,
            totalServerItems: 'totalServerItems',
            afterSelectionChange: function(oRow) {
                // console.log(oRow.selectionProvider.selectedItems[0]);
            }
        };
        scope.gridStatisticsData = {
            data: 'statisticsGridData',
            rowHeight: 25,
            /*columnDefs: [{
                field: 'rowInfo',
                displayName: 'Vehicle'
            }, {
                field: 'smallInfo1',
                displayName: 'Indica'
            }, {
                field: 'smallInfo2',
                displayName: 'Vista'
            }, {
                field: 'mediumInfo',
                displayName: 'Verito'
            }, {
                field: 'bigInfo1',
                displayName: 'Xylo'
            }, {
                field: 'bigInfo2',
                displayName: 'Innova'
            }, {
                field: 'bigInfo3',
                displayName: 'Tavera'
            }],*/
            columnDefs: [{
                field: 'rowInfo',
                displayName: 'Vehicle'
            }, {
                field: 'available',
                displayName: 'Available'
            }, {
                field: 'in_booking',
                displayName: 'in booking'
            }, {
                field: 'just_alloted',
                displayName: 'just alloted'
            }],
            enablePaging: false,
            showFooter: false,
            multiSelect: false,
            totalServerItems: 'totalServerItems',
            afterSelectionChange: function(oRow) {
                // console.log(oRow.selectionProvider.selectedItems[0]);
            }
        };
    });