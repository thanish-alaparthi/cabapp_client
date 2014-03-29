'use strict';

angular.module('sigmaCabsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid',
  'ui.bootstrap'
])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', { // default page for logged-in user.
        templateUrl: 'views/booking.html',
        controller: 'bookingController'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'usersMainController'
      })
      .when('/client', {
        templateUrl: 'views/client.html',
        controller: 'dashboardController'
      })
      .when('/vehicle', {
        templateUrl: 'views/vehicle.html',
        controller: 'vehicleMainController'
      })
      .when('/reports', {
        templateUrl: 'views/reports.html',
        controller: 'ReportsMainController'
      })
      .when('/dispatch', {
        templateUrl: 'views/dispatch.html',
        controller: 'dispatchMainController'
      })
      .when('/controlView', {
        templateUrl: 'views/dispatches/controlView.html',
        controller: 'controlViewController'
      })
      .when('/booking', {
        templateUrl: 'views/booking.html',
        controller: 'bookingController'
      })
      .when('/customer', {
        templateUrl: 'views/customer.html',
        controller: 'customersMainController'
      })
      .when('/admincs', {
        templateUrl: 'views/admincs.html',
        // customer support
        controller: 'adminCsMainController'
      })
      .otherwise({
        redirectTo: '/' // redirect to dashboard.html 
      });
  })
  .factory('SafeApply', function() {
    return function($scope, fn) {
      var phase = $scope.$root.$$phase;
      if (phase == '$apply' || phase == '$digest') {
        if (fn && (typeof(fn) === 'function')) {
          fn();
        }
      } else {
        $scope.$apply(fn);
      }
    }
  });