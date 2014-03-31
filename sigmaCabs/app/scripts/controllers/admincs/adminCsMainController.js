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
    .controller('adminCsMainController', function($scope, $rootScope, URLService, DispatchService, $routeParams, PrerequisiteService, $dialog, modalWindow, serverService) {
        var scope = $scope;
        scope.callerPhone = $routeParams.mobile;
        scope.oMonths = angular.copy(PrerequisiteService.fnGetMonthsObjects());
        //scope.redirectUrl = window.location.origin + '/ticket/upload/open.php?mobile=' + scope.callerPhone;
        scope.redirectUrl = 'http://10.0.2.188:8080/ticket/upload/open.php?mobile=' + scope.callerPhone;
        console.log('In adminCsMainController', scope.redirectUrl);
        scope.vehicle = {};


        scope.fnSaveVehicleMasters = function() {
            alert('Wip...');
        }
    });