/*
Name: AuthenticationService
Description: Service which handles authentication such as login, registration, logout etc.
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
  .factory('AuthenticationService', function($http, URLService, $rootScope) {
    var oUser = null;

    return {
      login: function(credentials) {
        var _params = '?j_username=' + credentials.j_username + "&j_password=" + credentials.j_password;
        var login = $http.post(URLService.service('login') + _params, credentials);
        return login;
      },
      register: function(payload) {
        var service = $http.post(URLService.service('register'), "json=" + JSON.stringify(payload), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        return service;
      },
      logout: function() {
        var logout = $http.get(URLService.service('logout'));
        return logout;
      },
      getSession: function() {
        return $http.get(URLService.service('session'))
          .success(function(data) {
            if (data.status == 200) {
              oUser = data.result.user;              
            }
          })
      },
      getSessionFromCache: function() {
        return oUser;
      }
    }
  });