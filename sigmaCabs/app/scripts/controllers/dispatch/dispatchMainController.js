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
    .controller('dispatchMainController', function($scope, $rootScope, URLService, BookingService, $routeParams, PrerequisiteService, $dialog, modalWindow) {
        var scope = $scope;

        scope.vehicleDetails = {
            "vehicleId": "15",
            "driverId": "28"
        };

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
                displayName: '#',
                width: 30
            }, {
                field: 'tripDate',
                displayName: 'Trip Date'
            }, {
                field: 'bookingCode',
                displayName: 'Booking#'
            }, {
                field: 'customerName',
                displayName: 'Passenger Name'
            }, {
                field: 'startTime',
                displayName: 'Start Time',
                width: 85
            }, {
                field: 'pickup',
                displayName: 'Pickup'
            }, {
                field: 'drop',
                displayName: 'Drop'
            }, {
                field: 'vehicle',
                displayName: 'Vehicle',
                width: 80
            }, {
                field: 'package',
                displayName: 'Package'
            }, {
                field: 'status',
                displayName: 'Status',
                width: 70
            }, {
                field: 'bookingId',
                displayName: 'Status',
                width: 70,
                visible: false
            }, {
                displayName: 'Action',
                width: 110,
                cellTemplate: '<div style="text-align: center;"><button ng-show="row.getProperty(\'status\') == \'Pending\' ? true : false" style="margin-top: 4px;" class="btnCompact btn-success" ng-click="fnOpenPendingForEdit(row)">Edit/View</button><button ng-click="fnOpenClosedAsBookAgain(row);"  ng-show="row.getProperty(\'status\') == \'Closed\' ? true : false" style="margin-top: 4px;" class="btnCompact btn-success">Book Again</button></div>'
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