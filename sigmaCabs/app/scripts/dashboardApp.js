'use strict';

angular.module('sigmaCabsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ngGrid',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {  // default page for logged-in user.
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
      .otherwise({
        redirectTo: '/' // redirect to dashboard.html 
      });
  });
