/*
Name: easyBookingApp
Description: Main Application module controller for dashboard page.
Date: 29Jan2013
Author: Nortan::uipassionrocks.sigma@gmail.com
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

        // Get the preRequisiteData
        PrerequisiteService.fnGetPrerequisites();

        scope.fnInit = function() {
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
            scope.searchDetails = {};
            scope.vehicleDetails = {};

            scope.vLoginView = false;
            scope.vVacantView = false;
            scope.vAllotView = false;

            // add dropdwon fields
            scope.hours = PrerequisiteService.hours;
            scope.minutes = PrerequisiteService.minutes;
            scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
            scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
            scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();
            scope.subJourneyTypes = PrerequisiteService.fnGetAllJourneyTypes();
            scope.vehicleConditionTypes = PrerequisiteService.fnGetVehicleConditionTypes();
            scope.vehicleStatusTypes = PrerequisiteService.fnGetStatusTypes();

            // show rush or normal hours in statistcs
            var oDt = new Date();
            if ((oDt.getHours() >= 6 && oDt.getHours() <= 11) || (oDt.getHours() >= 16 && oDt.getHours() <= 22)) {
                scope.sHourType = "Rush Hours";
            } else {
                scope.sHourType = "Normal Hours";
            }

            scope.fnVehicleSearch = function(mobileNo) {
                DispatchService.fnFindVehicleByMobile({
                    mobile: mobileNo
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
            };

            // since mobile is passed, hit server to get vehicleDetails Based on the server
            if (scope.callerPhone) { // mobile passed
                // make a call to server to get the user details...
                scope.fnVehicleSearch(scope.callerPhone);
            } else {
                // scope.fnLoadDispactherView();
            }

            scope.currentMonthGridDetails = [{
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }, {
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }, {
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }, {
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }, {
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }, {
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }];

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

            /*var headerCellTemplateWithTitle = '<div ng-click="col.sort()" ng-class="{ ngSorted: !noSortVisible }">'+
                               '<span class="ngHeaderText" title="{{col.headerTitle}}">{{col.displayName}}</span>'+
                               '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
                               '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
                             '</div>'+
                             '<div ng-show="col.allowResize" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';*/
            scope.gridCurrentMonthData = {
                data: 'currentMonthGridDetails',
                rowHeight: 25,
                columnDefs: [{
                    field: 'bookingNo',
                    displayName: 'B.No',
                    headerTitle: 'Booking No.'
                }, {
                    field: 'vacantTime',
                    displayName: 'V.T',
                    headerTitle: 'Vacant Time'
                }, {
                    field: 'deadMileage',
                    displayName: 'D.ML',
                    headerTitle: 'Dead Mileage'
                    /* headerCellTemplate: headerCellTemplateWithTitle */
                }, {
                    field: 'startTime',
                    displayName: 'S.T',
                    headerTitle: 'Start Time'
                }, {
                    field: 'dropTime',
                    displayName: 'D.T',
                    headerTitle: 'Drop Time'
                }, {
                    field: 'totalKms',
                    displayName: 'T.kms',
                    headerTitle: 'Total Kms.'
                }, {
                    field: 'amount',
                    displayName: 'Amount',
                    headerTitle: 'Amount'
                }],
                enablePaging: false,
                showFooter: false,
                multiSelect: false,
                totalServerItems: 'totalServerItems',
                afterSelectionChange: function(oRow) {
                    // console.log(oRow.selectionProvider.selectedItems[0]);
                }
            };
            scope.fnCurrentDayData = function(vId) {
                console.log('vehicle Id: ' + vId);
                var oData = {
                    "vehicleId": vId
                };

                DispatchService.fnLoadCurrentDayData(oData)
                    .success(function(data, status, headers, config) {
                        console.log('Success: ', data);

                        if (data.status === 200) {
                            scope.currentMonthGridDetails = data.result;
                        }

                    })
                    .error(function(data, status, headers, config) {
                        console.log('Error: ', data)
                    });
            };

            scope.fnSetVehicleDetails = function(oData) {
                console.log('in fnSetVehicleDetails ');
                console.log(oData.result);
                scope.vehicleMainDetials = oData.result;
                scope.vLoginView = false;
                scope.vVacantView = false;
                scope.vAllotView = false;

                // select first driver by default
                if (scope.vehicleMainDetials.driver.length) {
                    scope.vehicleMainDetials.selectedDriver = scope.vehicleMainDetials.driver[0].id;
                }

                switch (scope.vehicleMainDetials.vehicleState) {
                    case "1": // Not Logged In
                        scope.vehicleDetails.vName = PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetials.vehicleName).vehicleName;
                        scope.vehicleDetails.vType = PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetials.vehicleType).vehicleType;
                        scope.vehicleDetails.loginLocation = scope.vehicleMainDetials.location;
                        scope.vehicleDetails.loginVehModel = scope.vehicleMainDetials.details.mfgMonth + ' - ' + scope.vehicleMainDetials.details.mfgYear;
                        //scope.vehicleDetails.loginPaymentStatus = PrerequisiteService.fnGetVehicleStatusTextById(scope.vehicleMainDetials.paymentStatus);
                        scope.vehicleDetails.vConditionText = PrerequisiteService.fnGetVehicleConditionTextById(scope.vehicleMainDetials.details.condition);
                        scope.vehicleDetails.vStatusText = PrerequisiteService.fnGetVehicleStatusTextById(scope.vehicleMainDetials.paymentStatus);

                        scope.vLoginView = true;
                        scope.vStateHeading = '';
                        break;
                    case "2": // Vacant
                    case "3": // In Break
                        scope.vStateHeading = (scope.vehicleMainDetials.vehicleState == "3") ? ' - In Break' : '';
                        scope.vVacantView = true;
                        break;
                    case "4": // Allot
                    case "5": // Attach
                    case "6": // While Driving
                        var oTmpJt = PrerequisiteService.fnGetJourneyTypeBySubJourneyTypeId(scope.vehicleMainDetials.details.subJourneyType);
                        scope.tmpDetails.tmpJourneyType = oTmpJt.parentId;
                        scope.vehicleDetails.vName = PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetials.vehicleName).vehicleName;
                        scope.vehicleDetails.vType = PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetials.vehicleType).vehicleType;
                        if(scope.vehicleMainDetials.vehicleState == "4") {
                            scope.vStateHeading = ' - Allot';
                        } else if(scope.vehicleMainDetials.vehicleState == "5") {
                            scope.vStateHeading = ' - Attached';
                        } else if(scope.vehicleMainDetials.vehicleState == "6") {
                            scope.vStateHeading = ' - In Driving';
                        }
                        scope.vAllotView = true;
                        break;
                }

                /*if (scope.vehicleMainDetials.details.vehicleType) {
                    scope.tmpDetails.tmpVehicleType = scope.vehicleMainDetials.details.vehicleType;
                }
                if (scope.vehicleMainDetials.details.vehicleName) {
                    scope.tmpDetails.tmpVehicleName = scope.vehicleMainDetials.details.vehicleName;
                }*/

                // load current Day data
                if (scope.vehicleMainDetials.id) {
                    scope.fnCurrentDayData(scope.vehicleMainDetials.id);
                }
            };
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
                            scope.fnSetVehicleDetails(data);
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
                var sSearch = scope.searchDetails.searchByVehicleId;
                if (!isNaN(sSearch)) { // mobile  && sSearch.length == 10
                    scope.fnSearchVehicle(sSearch);
                }
            };
            scope.fnVehicleSearchButton = function() {
                scope.fnMultipurposeSearch();
            };
        };

        // Main Controller Init Point
        // // waits until configuration/prerequisits data loads always
        $rootScope.$on('eventPrerequisitsLoaded', function() {
            console.log('in eventPrerequisitsLoaded');
            scope.fnInit();
        });

        // function to change sub-Journey Types
        scope.fnPopSubJourneyTypes = function() {
            scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.vehicleMainDetials.journeyType);
            for (var i = 0; i < scope.subJourneyTypes.length; i++) {
                if (scope.subJourneyTypes[i].parentId == scope.vehicleMainDetials.journeyType) {
                    scope.vehicleMainDetials.subJourneyType = scope.subJourneyTypes[i].id;
                    break;
                }
            }
        };
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

        scope.fnChangeVehiclePhone = function() {
            if (scope.vehicleMainDetials.selectedDriver && scope.vehicleMainDetials.selectedDriver !== "") {
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
                            var oData = {
                                vehicleMainDetials: scope.vehicleMainDetials
                            };
                            return oData;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnChangeVehicleStatus = function() {
            if (scope.vehicleMainDetials.selectedDriver && scope.vehicleMainDetials.selectedDriver !== "") {
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
                            var oData = {
                                vehicleStatusTypes: scope.vehicleStatusTypes,
                                vehicleMainDetials: scope.vehicleMainDetials
                            };
                            return oData;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnVehicleChangeLocation = function() {
            if (scope.vehicleMainDetials.selectedDriver && scope.vehicleMainDetials.selectedDriver !== "") {
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
                            var oData = {
                                vehicleMainDetials: scope.vehicleMainDetials
                            };
                            return oData;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnVehicleBreakStart = function() {
            if (scope.vehicleMainDetials.selectedDriver && scope.vehicleMainDetials.selectedDriver !== "") {
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
                            var oData = {
                                vehicleMainDetials: scope.vehicleMainDetials
                            };
                            return oData;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnVehicleBreakStop = function() {
            if (scope.vehicleMainDetials.selectedDriver && scope.vehicleMainDetials.selectedDriver !== "") {
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
                            var oData = {
                                vehicleMainDetials: scope.vehicleMainDetials
                            };
                            return oData;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnVehicleBreakdown = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBreakDown'),
                controller: 'vehicleBreakDown',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
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
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
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
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
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
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingTariff = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingTariff'),
                controller: 'vehicleBookingTariff',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnChangeVehicle = function() {
            $scope.opts = {
                templateUrl: URLService.view('changeVehicle'),
                controller: 'changeVehicle',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingCancel = function() {
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingCancel'),
                controller: 'vehicleBookingCancel',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnChangeVehPickupLocation = function() {
            $scope.opts = {
                templateUrl: URLService.view('changeVehPickupLocation'),
                controller: 'changeVehPickupLocation',
                dialogClass: 'modalClass cancel-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnOpenDispatcherAddRequest = function() {
            $scope.opts = {
                templateUrl: URLService.view('dispatchAddRequest'),
                controller: 'dispatchAddRequest',
                dialogClass: 'modalClass add-request',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnFeedback = function() {
            $scope.opts = {
                templateUrl: URLService.view('dispatchFeedback'),
                controller: 'dispatchFeedback',
                dialogClass: 'modalClass add-request',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleRejectBooking = function() {
            var bookingId = scope.vehicleMainDetials.details.bookingId || '';
            if (bookingId === '') {
                alert('Please enter Booking Id');
                return;
            }
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingRejected'),
                controller: 'vehicleBookingRejected',
                dialogClass: 'modalClass add-request',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetials: scope.vehicleMainDetials
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnOpenDisposition = function() {
            /*if(!scope.waCustomerDetails.id) {
                alert('Please save the customer details first.');
                return;
            }*/

            $scope.opts = {
                templateUrl: URLService.view('dispositionForm'),
                controller: 'dispositionBooking',
                dialogClass: 'modalClass disposition-booking-container',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oBooking: function() {
                        // send readyToSave booking details
                        return {
                            bookingStatus: null,
                            customerId: "2",
                            dropPlace: "Ameerpet, Hyderabad, Andhra Pradesh, India",
                            extraMobile: "",
                            id: "19",
                            discount: 0,
                            landmark1: "asdfffccffd",
                            landmark2: "sadf",
                            pickupDate: "2014-02-16",
                            pickupPlace: "Narayanaguda, Hyderabad",
                            pickupTime: "02:40:00",
                            primaryMobile: "",
                            primaryPassanger: "",
                            subJourneyType: "7",
                            vehicleName: null,
                            vehicleType: "2"


                            /*id : "",    // always save booking as new in disposition.
                            pickupDate : PrerequisiteService.formatToServerDate(scope.bookingDetails.pickupDate), 
                            pickupTime : scope.bookingDetails.pickupHours +':' + scope.bookingDetails.pickupMinutes + ':00', 
                            pickupPlace : scope.bookingDetails.pickupPlace, 
                            dropPlace : scope.bookingDetails.dropPlace, 
                            primaryPassanger : '',
                            primaryMobile : '',
                            extraMobile : '',
                            landmark1 : scope.bookingDetails.landmark1, 
                            landmark2 : scope.bookingDetails.landmark2, 
                            vehicleName : scope.bookingDetails.vehicleName, 
                            vehicleType : scope.bookingDetails.vehicleType, 
                            subJourneyType : scope.bookingDetails.subJourneyType, 
                            bookingStatus : null,   // reset the booking status in disposition.
                            customerId : scope.waCustomerDetails.id*/
                        }
                    },
                    oCustomer: function() {
                        return {
                            "id": "6",
                            "name": "Kumar",
                            "mobile": "9666096662",
                            "mobile2": "9703888888",
                            "email": null,
                            "bloodGroup": null,
                            "dob": null,
                            "occupation": null,
                            "grade": "1",
                            "customerCode": "459819",
                            "category": "2",
                            "tripCount": "0",
                            "status": "1",
                            "altMobile": "9703888888"
                        };
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        // handling custom events
        var oEventGetVehicleStatus = $rootScope.$on('eventGetVehicleStatus', function(oEvent, oData) {
            console.log('>>>>>scope.eventGetVehicleStatus changed', arguments);
            scope.fnVehicleSearch(scope.vehicleMainDetials.mobileNo);
        });


        scope.$on('$destroy', function() {
            console.log('destroying oEventGetVehicleStatus');
            oEventGetVehicleStatus();
        });
    });