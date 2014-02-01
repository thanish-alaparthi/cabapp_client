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
    .controller('dispatchMainController', function($scope, $rootScope, URLService, BookingService, $routeParams, PrerequisiteService) {
        var scope = $scope;

        scope.dispatcherMainView = URLService.view('dispatcherMainView');
        scope.vehicalInformationForm = URLService.view('vehicalInformationForm');
        scope.vehicalLoginForm = URLService.view('vehicalLoginForm');
        scope.vehicalVacantForm = URLService.view('vehicalVacantForm');
        scope.vehicalAllotForm = URLService.view('vehicalAllotForm');
        scope.currentMonthData = URLService.view('currentMonthData');
        scope.lastMonthHistory = URLService.view('lastMonthHistory');
        scope.vehicalData = URLService.view('vehicalData');
        scope.vehicalPerformance = URLService.view('vehicalPerformance');
        scope.chatForm = URLService.view('chatForm');
        scope.bookingStatistics = URLService.view('bookingStatistics');

        scope.currentMonthGridDetails = [{
            'bookingId' : '1',
            'srno' : '1',
            'tripDate' : '25/03/2014',
            'bookingCode' : 'SCB099900001',
            'customerName' : 'Aswin kumar Chowdary',
            'startTime' : '11:20 PM',
            'pickup' : 'Santosh Nagar',
            'drop' : 'Airport',
            'vehicle' : 'Indica',
            'package' : '400KM 500rs',
            'status' : 'Pending',
            'action' : 'Button Here',
        },{
            'bookingId' : '2',
            'srno' : '2',
            'tripDate' : '25/03/2014',
            'bookingCode' : 'SCB099900001',
            'customerName' : 'Aswin kumar Chowdary',
            'startTime' : '11:20 PM',
            'pickup' : 'Santosh Nagar',
            'drop' : 'Airport',
            'vehicle' : 'Indica',
            'package' : '400KM 500rs',
            'status' : 'Closed',
            'action' : 'Button Here',
        },{
            'bookingId' : '3',
            'srno' : '3',
            'tripDate' : '25/03/2014',
            'bookingCode' : 'SCB099900001',
            'customerName' : 'Aswin kumar Chowdary',
            'startTime' : '11:20 PM',
            'pickup' : 'Santosh Nagar',
            'drop' : 'Airport',
            'vehicle' : 'Indica',
            'package' : '400KM 500rs',
            'status' : 'Closed',
            'action' : 'Button Here',
        },{
            'bookingId' : '4',
            'srno' : '4',
            'tripDate' : '25/03/2014',
            'bookingCode' : 'SCB099900001',
            'customerName' : 'Aswin kumar Chowdary',
            'startTime' : '11:20 PM',
            'pickup' : 'Santosh Nagar',
            'drop' : 'Airport',
            'vehicle' : 'Indica',
            'package' : '400KM 500rs',
            'status' : 'Pending',
            'action' : 'Button Here',
        },{
            'bookingId' : '5',
            'srno' : '5',
            'tripDate' : '25/03/2014',
            'bookingCode' : 'SCB099900001',
            'customerName' : 'Aswin kumar Chowdary',
            'startTime' : '11:20 PM',
            'pickup' : 'Santosh Nagar',
            'drop' : 'Airport',
            'vehicle' : 'Indica',
            'package' : '400KM 500rs',
            'status' : 'Pending',
            'action' : 'Button Here',
        }];

        scope.chartData = [{"name":"New","y":1},{"name":"Retired","y":2},{"name":"Un-Assigned","y":67}];

        /*scope.fnOpenClosedAsBookAgain = function(row) {
            console.log("fnOpenClosedAsBookAgain BookingId: ", row.entity);
            scope.bookingDetails.bookingId = row.entity.bookingId;
            $rootScope.$emit('eventClosedBookingSelectFromGrid', {
                bShowCancel : false,
                bShowSaveAndClose : false,
                bShowCustomerFeedbackBtn : true,
                bookingId : row.entity.bookingId
            });
        }

        scope.fnOpenPendingForEdit = function(row) {
            console.log("fnOpenPendingForEdit BookingId: ", row.entity);
            scope.bookingDetails.bookingId = row.entity.bookingId;
            $rootScope.$emit('eventClosedBookingSelectFromGrid', {
                bShowCancel : true,
                bShowSaveAndClose : true,
                bShowCustomerFeedbackBtn : false,
                bookingId : row.entity.bookingId
            });
        }*/

        scope.gridCurrentMonthData = {
            data: 'currentMonthGridDetails',
            rowHeight: 25,
            columnDefs: [{
                field: 'srno',
                displayName: '#',
                width : 30
            },{
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
    });
