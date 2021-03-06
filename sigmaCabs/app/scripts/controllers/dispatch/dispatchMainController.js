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
    .controller('dispatchMainController', function($scope, $rootScope, URLService, DispatchService, $routeParams, PrerequisiteService, $dialog, modalWindow, serverService) {
        var scope = $scope;

        // Get the preRequisiteData
        PrerequisiteService.fnGetPrerequisites();
        scope.dispatcherMainView = URLService.view('dispatcherMainView');

        scope.fnInit = function() {
            var errorMesg = 'Vehicle Details not found..';
            scope.vehicleErrorMessage = errorMesg;
            scope.vehicleInformationForm = URLService.view('vehicleInformationForm');
            scope.vehicleLoginForm = URLService.view('vehicleLoginForm');
            scope.vehicleVacantForm = URLService.view('vehicleVacantForm');
            scope.vehicleAllotForm = URLService.view('vehicleAllotForm');
            scope.vehicleDefaultForm = URLService.view('vehicleDefaultForm');
            scope.currentMonthData = URLService.view('currentMonthData');
            scope.bookingStatistics = URLService.view('bookingStatistics');
            scope.lastMonthHistory = URLService.view('lastMonthHistory');
            scope.vehicleData = URLService.view('vehicleData');
            scope.vehiclePerformance = URLService.view('vehiclePerformance');
            scope.chatForm = URLService.view('chatForm');
            scope.previousRequestVehId = 0;

            scope.callerPhone = PrerequisiteService.fnCheckValidMobile($routeParams.mobile);
            scope.callerInfo = "";
            console.log(scope.callerPhone);

            scope.vehicleMainDetails = {};
            scope.tmpDetails = {};
            scope.searchDetails = {};
            scope.vehicleDetails = {};

            scope.showDispatchView = true;
            scope.vLoginView = false;
            scope.vVacantView = false;
            scope.vAllotView = false;
            scope.vDefaultView = false;
            scope.vInfoButtonsDisable = false;

            // add dropdwon fields
            scope.hours = PrerequisiteService.hours;
            scope.loginHours = PrerequisiteService.loginHours;
            scope.minutes = PrerequisiteService.minutes;
            scope.vehicleTypes = PrerequisiteService.fnGetVehicleTypes();
            scope.vehicleNames = PrerequisiteService.fnGetVehicleNames();
            scope.journeyTypes = PrerequisiteService.fnGetJourneyTypes();
            scope.subJourneyTypes = PrerequisiteService.fnGetAllJourneyTypes();
            scope.vehicleConditionTypes = PrerequisiteService.fnGetVehicleConditionTypes();
            scope.vehicleStatusTypes = PrerequisiteService.fnGetStatusTypes();
            scope.allLocations = PrerequisiteService.fnGetAllLocations();

            // show rush or normal hours in statistics
            var oDt = new Date();
            if ((oDt.getHours() >= 6 && oDt.getHours() <= 11) || (oDt.getHours() >= 16 && oDt.getHours() <= 22)) {
                scope.sHourType = "Rush Hours";
            } else {
                scope.sHourType = "Normal Hours";
            }

            scope.fnVehicleSearch = function(mobileNo) {
                mobileNo = mobileNo || scope.callerPhone;
                mobileNo = PrerequisiteService.fnCheckValidMobile(mobileNo);
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
                            scope.vehicleErrorMessage = data.result[0].errorMessage || errorMesg;
                            scope.vDefaultView = true;
                            scope.vInfoButtonsDisable = true;

                            scope.fnClearVehicleInfo();

                            // make callPhone as mobile 
                            //scope.customerDetails.mobile = scope.callerPhone;
                        } else if (data.status == 200 && data.result) {
                            scope.fnSetVehicleDetails(data);
                        } else { // error in data.result object.
                            console.log('Error in result: fnFindVehicleByMobile', data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log('Error fnFindVehicleByMobile: ', data);
                        scope.vehicleErrorMessage = "Error in fetching vehicle details..";
                        scope.vDefaultView = true;
                        scope.vInfoButtonsDisable = true;
                    });
            };

            // since mobile is passed, hit server to get vehicleDetails Based on the server
            if (scope.callerPhone) { // mobile passed
                // make a call to server to get the user details...
                scope.fnVehicleSearch(scope.callerPhone);
            } else {
                scope.showDispatchView = true;
                scope.vDefaultView = true;
                scope.vInfoButtonsDisable = true;
            }

            scope.currentMonthGridDetails = [];
            /*
				[{
                'bookingId': '1',
                'bookingNo': '1',
                'vacantTime': '20',
                'startTime': '11:20 PM',
                'dropTime': '12:20 PM',
                'totalKms': '1120',
                'amount': '1500',
                'deadMileage': '5'
            }]
			*/
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
                rowHeight: 20,
                columnDefs: [{
                    field: 'bookingCode',
                    displayName: 'B.No',
                    headerTitle: 'Booking No.'
                }, {
                    field: 'vacantTime',
                    displayName: 'V.T',
                    headerTitle: 'Vacant Time'
                }, {
                    field: 'deadMileage',
                    displayName: 'D.ML',
                    headerTitle: 'Dead Mileage',
                    cellFilter: 'number'
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
                    headerTitle: 'Total Kms.',
                    cellFilter: 'number'
                }, {
                    field: 'amount',
                    displayName: 'Amount',
                    headerTitle: 'Amount',
                    cellFilter: 'number'
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

                serverService.sendData('P',
                    'vehicle/getCurrentDayStatistics',
                    oData, scope.fnLoadCurrentDayDataSuccess, scope.fnLoadCurrentDayDataError);
            };

            scope.fnLoadCurrentDayDataSuccess = function(data, status, headers, config) {
                console.log('fnLoadCurrentDayDataSuccess Success: ', data);

                var oStatistics = data.statistics,
                    aExpLogout = (oStatistics.expLogout) ? oStatistics.expLogout.split(' ') : [],
                    logoutDt = (aExpLogout.length) ? aExpLogout[0].split('-')[2] : '',
                    aLoginTime = (oStatistics.loginTime) ? oStatistics.loginTime.split(' ') : [],
                    loginDt = (aLoginTime.length) ? aLoginTime[0].split('-')[2] : '';
                scope.currentDayStatistics = oStatistics;
                // update the vehicle state
                scope.currentDayStatistics.loginTime = (oStatistics.loginTime) ? (loginDt + ' -> ' + aLoginTime[1].substring(0, 5)) : '';
                scope.currentDayStatistics.expectedLogoutTime = (oStatistics.expLogout) ? (logoutDt + ' -> ' + aExpLogout[1].substring(0, 5)) : '';
                scope.currentDayStatistics.status = (oStatistics.status) ? PrerequisiteService.fnGetVehicleStatusById(oStatistics.status) : '';
                scope.currentDayStatistics.totalLoginTime = (parseInt(oStatistics.totalLoginTime) > 0) ? PrerequisiteService.fnFormatMinutesToHoursAndMinutes(oStatistics.totalLoginTime) : 0;
                scope.currentDayStatistics.totalBreakTime = (parseInt(oStatistics.totalBreakTime) > 0) ? PrerequisiteService.fnFormatMinutesToHoursAndMinutes(oStatistics.totalBreakTime) : 0;
                scope.currentDayStatistics.totalWorkingTime = (parseInt(oStatistics.totalWorkingTime) > 0) ? PrerequisiteService.fnFormatMinutesToHoursAndMinutes(oStatistics.totalWorkingTime) : 0;
                scope.currentMonthGridDetails = ((data.bookings) ? data.bookings : []);
            };
            scope.fnLoadCurrentDayDataError = function(data, status, headers, config) {
                console.log('Error: ', data);
            };

            scope.fnCurrentMonthData = function(vId) {
                console.log('vehicle Id: ' + vId);
                var oData = {
                    "vehicleId": vId
                };

                serverService.sendData('P',
                    'vehicle/getCurrentMonthStatistics',
                    oData, scope.fnLoadCurrentMonthDataSuccess, scope.fnLoadCurrentMonthDataError);
            };

            scope.fnLoadCurrentMonthDataSuccess = function(data, status, headers, config) {
                console.log('fnLoadCurrentMonthDataSuccess Success: ', data);

                scope.currentMonthStatistics = data;
                scope.currentMonthStatistics.driver.avgLoginHoursText = PrerequisiteService.fnFormatMinutesToHoursAndMinutes(data.driver.avgLoginHours);
                scope.currentMonthStatistics.vehicle.aRating = PrerequisiteService.fnFormatRatingAndReturnClassArray(data.vehicle.vehicleRating);
                scope.currentMonthStatistics.driver.aRating = PrerequisiteService.fnFormatRatingAndReturnClassArray(data.driver.driverRating);
            };
            scope.fnLoadCurrentMonthDataError = function(data, status, headers, config) {
                console.log('Error: ', data);
            };

            scope.fnLastMonthData = function(vId) {
                console.log('vehicle Id: ' + vId);
                var oData = {
                    "vehicleId": vId
                };

                serverService.sendData('P',
                    'vehicle/getMonthStatistics',
                    oData, scope.fnLoadLastMonthDataSuccess, scope.fnLoadLastMonthDataError);
            };

            scope.fnLoadLastMonthDataSuccess = function(data, status, headers, config) {
                console.log('fnLoadLastMonthDataSuccess Success: ', data);

                scope.lastMonthStatistics = data;
                scope.lastMonthStatistics.driver.avgLoginHoursText = PrerequisiteService.fnFormatMinutesToHoursAndMinutes(data.driver.avgLoginHours);
                scope.lastMonthStatistics.vehicle.aRating = PrerequisiteService.fnFormatRatingAndReturnClassArray(data.vehicle.vehicleRating);
                scope.lastMonthStatistics.driver.aRating = PrerequisiteService.fnFormatRatingAndReturnClassArray(data.driver.driverRating);
            };
            scope.fnLoadLastMonthDataError = function(data, status, headers, config) {
                console.log('Error: ', data);
            };

            scope.fnVehicleData = function(vId) {
                console.log('vehicle Id: ' + vId);
                var oData = {
                    "vehicleId": vId
                };

                serverService.sendData('P',
                    'vehicle/getVehicleStandardInfo',
                    oData, scope.fnLoadVehicleDataSuccess, scope.fnLoadVehicleDataError);
            };

            scope.fnLoadVehicleDataSuccess = function(data, status, headers, config) {
                console.log('fnLoadVehicleDataSuccess Success: ', data);

                scope.vehicleStatistics = data;
                scope.vehicleStatistics.optedPackageText = '-';
                scope.vehicleStatistics.vehicle.projLoginHours = PrerequisiteService.fnFormatMinutesToHoursAndMinutes(data.vehicle.projLoginHours);
                scope.vehicleStatistics.vehicle.facilitiesText = data.vehicle.facilities.join(', ');
                scope.vehicleStatistics.vehicle.invalidDocsText = data.vehicle.invalidDocs.join(', ');
            };
            scope.fnLoadVehicleDataError = function(data, status, headers, config) {
                console.log('Error: ', data);
            };

            scope.fnSetVehicleDetails = function(oData) {
                console.log('in fnSetVehicleDetails ');
                console.log(oData.result);
                scope.vehicleMainDetails = oData.result;
                scope.vLoginView = false;
                scope.vVacantView = false;
                scope.vAllotView = false;
                scope.vDefaultView = false;
                scope.vInfoButtonsDisable = false;

                // select first driver by default
                if (scope.vehicleMainDetails.driver.length) {
                    scope.vehicleMainDetails.selectedDriver = scope.vehicleMainDetails.driver[0];
                }

                scope.allLocations = PrerequisiteService.fnGetAllLocations();

                switch (scope.vehicleMainDetails.vehicleState) {
                    case "1": // Not Logged In
                        scope.vehicleDetails.vName = PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetails.vehicleName).vehicleName;
                        scope.vehicleDetails.vType = PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetails.vehicleType).vehicleType;
                        scope.vehicleDetails.loginLocation = scope.vehicleMainDetails.location;
                        scope.vehicleDetails.loginVehModel = scope.vehicleMainDetails.details.mfgMonth + ' - ' + scope.vehicleMainDetails.details.mfgYear;
                        //scope.vehicleDetails.loginPaymentStatus = PrerequisiteService.fnGetVehicleStatusTextById(scope.vehicleMainDetails.paymentStatus);
                        scope.vehicleDetails.vConditionText = PrerequisiteService.fnGetVehicleConditionTextById(scope.vehicleMainDetails.details.condition);
                        scope.vehicleDetails.vStatusText = PrerequisiteService.fnGetVehicleStatusTextById(scope.vehicleMainDetails.paymentStatus);
                        scope.vehicleMainDetails.loginStartKms = scope.vehicleMainDetails.startKms;
                        scope.vehicleMainDetails.expLoginHours = '14'; // default login hours

                        scope.vStateHeading = '';
                        scope.vLoginView = true;
                        break;
                    case "2": // Vacant
                    case "3": // In Break
                        var loginTime = (scope.vehicleMainDetails.details.loginTime) ? scope.vehicleMainDetails.details.loginTime.split(' ') : '';
                        scope.bookingType = "1";
                        scope.vStateHeading = (scope.vehicleMainDetails.vehicleState == "3") ? ' - In Break' : '';
                        scope.vNextBookingState = (scope.vehicleMainDetails.details.nextBooking == "1") ? 'Yes' : 'No';
                        scope.vehicleDetails.vName = PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetails.vehicleName).vehicleName;
                        scope.vehicleDetails.vType = PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetails.vehicleType).vehicleType;
                        scope.vehicleMainDetails.details.vacantTimeText = scope.vehicleMainDetails.details.vacantTime;//PrerequisiteService.fnFormatMinutesToHoursAndMinutes(scope.vehicleMainDetails.details.vacantTime);
                        scope.vehicleMainDetails.details.overAllBreakTimeText = PrerequisiteService.fnFormatMinutesToHoursAndMinutes(scope.vehicleMainDetails.details.dayBreakTime);
                        scope.vehicleMainDetails.details.loginTime = (scope.vehicleMainDetails.details.loginTime) ? (loginTime[0].split('-')[2] + ' -> ' + loginTime[1].substring(0, 5)) : '';
                        scope.vVacantView = true;
                        break;
                    case "4": // Allot
                    case "5": // Attach
                    case "6": // While Driving
                        var oTmpJt = PrerequisiteService.fnGetMainJourneyTypeOfSubJourneyType(scope.vehicleMainDetails.details.subJourneyType);
                        if (oTmpJt) {
                            scope.tmpDetails.tmpJourneyType = oTmpJt.id;
                            scope.vehicleMainDetails.details.journeyTypeText = oTmpJt.journeyType;
                            scope.vehicleMainDetails.details.subJourneyTypeText = PrerequisiteService.fnGetSubJourneyObjectById(scope.vehicleMainDetails.details.subJourneyType).journeyType;
                            scope.vehicleDetails.vName = PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetails.vehicleName).vehicleName;
                            scope.vehicleDetails.vType = PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetails.vehicleType).vehicleType;
                            // from booking details
                            scope.vehicleDetails.bookingVName = (scope.vehicleMainDetails.details && scope.vehicleMainDetails.details.vehicleName) ? PrerequisiteService.fnGetVehicleNameById(scope.vehicleMainDetails.details.vehicleName).vehicleName : '';
                            scope.vehicleDetails.bookingVType = (scope.vehicleMainDetails.details && scope.vehicleMainDetails.details.vehicleType) ? PrerequisiteService.fnGetVehicleTypeById(scope.vehicleMainDetails.details.vehicleType).vehicleType : '';
                            scope.vehicleMainDetails.details.pickupTimeText = scope.vehicleMainDetails.details.pickupTime.substring(0, 5); //removing seconds
                            if (scope.vehicleMainDetails.vehicleState == "4") {
                                scope.vStateHeading = ' - Allot';
                            } else if (scope.vehicleMainDetails.vehicleState == "5") {
                                scope.vStateHeading = ' - Confirmed';
                            } else if (scope.vehicleMainDetails.vehicleState == "6") {
                                scope.vStateHeading = ' - In Driving';
                            }
                            // storing journey type to use in popup's
                            scope.vehicleMainDetails.tempSelectedJourneyTypeId = oTmpJt.id;
                            scope.vehicleMainDetails.details.displayPickupDate = PrerequisiteService.fnFormatDate(scope.vehicleMainDetails.details.pickupDate);
                            scope.vAllotView = true;
                        } else {
                            scope.vehicleErrorMessage = 'Error in fetching details..';
                            scope.vDefaultView = true;
                            scope.vInfoButtonsDisable = true;
                        }
                        break;
                    case "7": // Inactive
                    case "8": // Not in use
                        scope.vehicleErrorMessage = scope.vehicleMainDetails.details.message;
                        scope.vDefaultView = true;
                        scope.vInfoButtonsDisable = true;
                        break;
                    case "9": // Vehicle Breakdown
                        scope.vehicleErrorMessage = "Vehicle in Break down condition";
                        scope.vDefaultView = true;
                        scope.vInfoButtonsDisable = true;
                        break;
                    default:
                        scope.vDefaultView = true;
                        scope.vInfoButtonsDisable = true;
                        break;
                }

                /*if (scope.vehicleMainDetails.details.vehicleType) {
                    scope.tmpDetails.tmpVehicleType = scope.vehicleMainDetails.details.vehicleType;
                }
                if (scope.vehicleMainDetails.details.vehicleName) {
                    scope.tmpDetails.tmpVehicleName = scope.vehicleMainDetails.details.vehicleName;
                }*/

                // load current Day data
                if (scope.vehicleMainDetails.id) {
                    scope.fnCurrentDayData(scope.vehicleMainDetails.id);

                    // Load the details only once
                    if (scope.previousRequestVehId !== scope.vehicleMainDetails.id) {
                        scope.previousRequestVehId = scope.vehicleMainDetails.id;

                        // load current Month & last month history and Vehicle performance
                        scope.fnCurrentMonthData(scope.vehicleMainDetails.id);
                        scope.fnLastMonthData(scope.vehicleMainDetails.id);
                        scope.fnVehicleData(scope.vehicleMainDetails.id);
                    }
                }
            };
            scope.fnSearchVehicle = function(sSearch) {
                console.log(sSearch);
                console.log('Searching by vehicle Id');
                // search by vehicle code / vehicle mobile no.
                var oSearch = (sSearch && sSearch.length <= 6) ? {
                    vcode: sSearch
                } : {
                    mobile: PrerequisiteService.fnCheckValidMobile(sSearch)
                };
                if(oSearch.mobile) {
                    scope.callerPhone = oSearch.mobile;
                }
                console.log(oSearch);
                DispatchService.fnFindVehicleByMobile(oSearch)
                    .success(function(data, status, headers, config) {
                        if (data.status == 500) { // no data found of vehicle
                            console.log('500 fnSearchVehicle', data);
                            scope.vehicleErrorMessage = data.result[0].errorMessage || errorMesg;
                            scope.vLoginView = false;
                            scope.vVacantView = false;
                            scope.vAllotView = false;
                            scope.vDefaultView = true;
                            scope.vInfoButtonsDisable = true;
                            // make callPhone as mobile 
                            //scope.customerDetails.mobile = scope.callerPhone;
                            scope.fnClearVehicleInfo();
                        } else if (data.status == 200 && data.result) {
                            console.log('vehicle search success');
                            console.log(data);
                            scope.fnSetVehicleDetails(data);
                        } else { // error in data.result object.
                            console.log('Erro in result: fnSearchVehicle', data);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log('error fnSearchVehicle: ', data);
                        scope.vehicleErrorMessage = "Error in fetching vehicle details..";
                        scope.vDefaultView = true;
                        scope.vInfoButtonsDisable = true;
                    });

            }
            scope.fnClearVehicleInfo = function() {
                scope.vehicleMainDetails.owner = {};

                scope.vehicleMainDetails.owner.name = '';
                scope.vehicleMainDetails.owner.mobile = '';
                scope.vehicleMainDetails.location = '';
                scope.vehicleMainDetails.driver = [];
            }
            scope.fnMultipurposeSearch = function() {
                var sSearch = scope.searchDetails.searchByVehicleId || '';
                if (sSearch === '' || (sSearch.length > 6 && sSearch.length < 10)) {
                    alert('Please enter valid Vehicle Code or Mobile no.')
                    return false;
                }
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
            scope.tmpSelectedJourneyType = PrerequisiteService.fnGetJourneyObjectById(scope.vehicleMainDetails.journeyType);
            for (var i = 0; i < scope.subJourneyTypes.length; i++) {
                if (scope.subJourneyTypes[i].parentId == scope.vehicleMainDetails.journeyType) {
                    scope.vehicleMainDetails.subJourneyType = scope.subJourneyTypes[i].id;
                    break;
                }
            }
        };
        // function to change VehicleNames
        scope.fnPopVehicleNames = function() {
            scope.tmpSelectedVehicleType = PrerequisiteService.fnGetVehicleTypeById(scope.tmpDetails.tmpVehicleType);
            scope.tmpDetails.tmpVehicleName = "";
            scope.vehicleMainDetails.vehicleType = scope.tmpSelectedVehicleType.id;
            if (scope.vehicleNames) {
                for (var i = 0; i < scope.vehicleNames.length; i++) {
                    if (scope.vehicleNames[i].id == "") {
                        scope.vehicleNames.splice(i, 1);
                    }
                }
                // scope.vehicleNames.push({
                //     vehicleType: '1', // any-vehicle default to small
                //     id: '',
                //     vehicleName: 'Any-Vehicle',
                //     status: '1'
                // });
            }

        };
        // function to change VehicleNames
        scope.fnPopVehicleTypes = function() {
            if (scope.tmpDetails.tmpVehicleName == "") {
                scope.tmpDetails.tmpVehicleType = '1';
                scope.vehicleMainDetails.vehicleName = "";
                return;
            }
            scope.tmpSelectedVehicleName = PrerequisiteService.fnGetVehicleNameById(scope.tmpDetails.tmpVehicleName);
            scope.tmpDetails.tmpVehicleType = scope.tmpSelectedVehicleName.vehicleType;

            scope.vehicleMainDetails.vehicleName = scope.tmpSelectedVehicleName.id;
        };

        scope.fnLoadDispactherView = function() {
            // scope.existingCustomerAddBooking = URLService.view('existingCustomerAddBooking');
        };
        scope.fnLoadUnexpectedError = function() {
            // scope.existingCustomerAddBooking = URLService.view('errorResponseFormatMisMatch');
            alert('in fnLoadUnexpectedError');
        };

        scope.fnGetVehicleMoreInfo = function() {
            var oData = {};

            console.log('in fnGetVehicleMoreInfo');
            alert('WIP for vehicle more details');
            //serverService.sendData('P','dispatcher/getAllBookings', oData, scope.fnGetVehicleMoreInfoSuccess, scope.fnGetVehicleMoreInfoError);
        }

        scope.fnGetVehicleMoreInfoSuccess = function(data) {
            console.log('>>>>>>>>>> fnGetVehicleMoreInfoSuccess', data);
        }
        scope.fnGetVehicleMoreInfoError = function(xhr, data) {
            console.log('>>>>>>>>>> fnGetVehicleMoreInfoError', data);
            // do some error processing..
        }

        scope.fnChangeVehiclePhone = function() {
            if (scope.vehicleMainDetails.selectedDriver && scope.vehicleMainDetails.selectedDriver.id !== "") {
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
                                vehicleMainDetails: scope.vehicleMainDetails
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
            if (scope.vehicleMainDetails.selectedDriver && scope.vehicleMainDetails.selectedDriver.id !== "") {
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
                                vehicleMainDetails: scope.vehicleMainDetails
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
            if (scope.vehicleMainDetails.selectedDriver && scope.vehicleMainDetails.selectedDriver.id !== "") {
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
                                vehicleMainDetails: scope.vehicleMainDetails
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
            if (scope.vehicleMainDetails.selectedDriver && scope.vehicleMainDetails.selectedDriver.id !== "") {
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
                                vehicleMainDetails: scope.vehicleMainDetails
                            };
                            return oData;
                        },
                        isControlView: function() {
                            return false;
                        }
                    }
                };
                modalWindow.addDataToModal($scope.opts);
            } else {
                alert('Please select driver.')
            }
        };
        scope.fnVehicleBreakStop = function() {
            if (scope.vehicleMainDetails.selectedDriver && scope.vehicleMainDetails.selectedDriver !== "") {
                $scope.opts = {
                    templateUrl: URLService.view('vehicleBreakStop'),
                    controller: 'vehicleBreakStop',
                    dialogClass: 'modalClass booking-close-modal',
                    resolve: {
                        editMode: [

                            function() {
                                return false;
                            }
                        ],
                        oVehicleData: function() {
                            var oData = {
                                vehicleMainDetails: scope.vehicleMainDetails
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
                            vehicleMainDetails: scope.vehicleMainDetails
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
                dialogClass: 'modalClass add-request',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: scope.vehicleMainDetails
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
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return false;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingClose = function() {
            // if close booking is before the pickup time
            var pickupTimeStamp = new Date(scope.vehicleMainDetails.details.pickupDate + ' ' + scope.vehicleMainDetails.details.pickupTime).getTime();
            /*if(new Date().getTime() < pickupTimeStamp) {
                alert('Cannot give close report before pickup time');
                return;
            }*/
            
            $scope.opts = {
                templateUrl: URLService.view('vehicleBookingClose'),
                controller: 'vehicleBookingClose',
                dialogClass: 'modalClass booking-close-modal',
                resolve: {
                    editMode: [

                        function() {
                            return false;
                        }
                    ],
                    oVehicleData: function() {
                        var oData = {
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return false;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleBookingTariff = function() {
            var oData = {
                "customerId": scope.vehicleMainDetails.details.customerId || ''
            };

            if (oData.customerId === '') {
                alert('Error in fetching Customer details');
                return;
            }
            // fetching customer details first
            DispatchService.fnGetCustomerDetails(oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
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
                                var obj = {
                                    vehicleMainDetails: scope.vehicleMainDetails
                                };
                                return obj;
                            },
                            oCustomerDetails: function() {
                                return data.result;
                            }
                        }
                    };
                    modalWindow.addDataToModal($scope.opts);
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', data)
                });
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
                            vehicleMainDetails: scope.vehicleMainDetails
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
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return false;
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
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return false;
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
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnVehicleRejectBooking = function() {
            var bookingId = scope.vehicleMainDetails.details.bookingId || '';
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
                            vehicleMainDetails: scope.vehicleMainDetails
                        };
                        return oData;
                    },
                    isControlView: function() {
                        return false;
                    }
                }
            };
            modalWindow.addDataToModal($scope.opts);
        };

        scope.fnOpenDisposition = function() {
            var oData = {
                "customerId": scope.vehicleMainDetails.details.customerId || ''
            };

            if (oData.customerId === '') {
                alert('Error in fetching Customer details');
                return;
            }
            // fetching customer details first
            DispatchService.fnGetCustomerDetails(oData)
                .success(function(data, status, headers, config) {
                    console.log('Success: ', data);
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
                                var oDetails = scope.vehicleMainDetails.details;
                                // send readyToSave booking details
                                return {
                                    bookingStatus: null,
                                    customerId: oDetails.customerId,
                                    dropPlace: oDetails.dropPlace,
                                    extraMobile: "",
                                    id: "19",
                                    discount: 0,
                                    landmark1: oDetails.landmark1,
                                    landmark2: oDetails.landmark2,
                                    pickupDate: oDetails.pickupDate,
                                    pickupPlace: oDetails.pickupPlace,
                                    pickupTime: oDetails.pickupTime,
                                    primaryMobile: "",
                                    primaryPassenger: "",
                                    subJourneyType: oDetails.subJourneyType,
                                    vehicleName: null,
                                    vehicleType: scope.vehicleMainDetails.vehicleType
                                }
                            },
                            oCustomer: function() {
                                return data.result;
                            }
                        }
                    };
                    modalWindow.addDataToModal($scope.opts);
                });
        };

        // handling custom events
        var oEventGetVehicleStatus = $rootScope.$on('eventGetVehicleStatus', function(oEvent, oData) {
            console.log('>>>>>scope.eventGetVehicleStatus changed', arguments);
            scope.fnVehicleSearch(scope.vehicleMainDetails.mobileNo);
        });

        scope.$on('$destroy', function() {
            console.log('destroying oEventGetVehicleStatus');
            oEventGetVehicleStatus();
        });

        // Roadside booking - navigate to booking
        scope.fnRoadSideBooking = function() {
            window.location.hash = "#/";
        }

        // tabs click
        scope.showControlViewTab = function() {
            scope.showTariffDetails = false;
            scope.showBookingHistoryDetails = false;
            scope.showBookingDetails = false;
            scope.showDispatchView = false;
            scope.showControlViewDetails = true;
            window.location.hash = "#/controlView";

            //scope.fnResizeWindowHack();
        };
        scope.showDispatchViewTab = function() {
            scope.showTariffDetails = false;
            scope.showBookingHistoryDetails = false;
            scope.showBookingDetails = false;
            scope.showControlViewDetails = false;
            scope.showDispatchView = true;
            window.location.hash = "#/dispatch";

            //scope.fnResizeWindowHack();
        };
        scope.showBookingDetailsTab = function() {
            scope.showTariffDetails = false;
            scope.showBookingHistoryDetails = false;
            scope.showBookingDetails = true;
            scope.showDispatchView = false;
            scope.showControlViewDetails = false;
            window.location.hash = "#/";

            //scope.fnResizeWindowHack();
        };

        /*scope.showTariffDetailsTab = function() {
            scope.mainTariffDetails = URLService.view('mainTariffDetails');
            scope.showBookingDetails = false;
            scope.showBookingHistoryDetails = false;
            scope.showControlViewDetails = false;
            scope.showTariffDetails = true;
            scope.showDispatchView = false;

            //scope.fnResizeWindowHack();
        };*/
    });