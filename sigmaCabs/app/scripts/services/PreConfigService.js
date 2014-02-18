/*
Name: PreConfigService
Description: Service which handles REST Calls for PreConfigService
Date: 1Feb2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .factory('PreConfigService', function($http, URLService, $rootScope) {
        
        return {
            /* CONSTANTS DELARATIONS FOR BOOKING */
            BOOKING_ENQUIRY : 1,
            BOOKING_FOLLOW_UP : 2,
            BOOKING_REJECTED : 3,
            BOOKING_YET_TO_DISPATCH : 4,
            BOOKING_VEHICLE_ASSIGNED : 5,
            WHILE_DRIVING : 6,
            BOOKING_COMPLETED_N_CLOSED : 7,
            BOOKING_CANCELLED : 8,

            VEHICLE_AVAILABLE_COLOR : '#00FF00',
            VEHICLE_PROBABLILY_AVAILABLE_COLOR : '#FFA500',
            VEHICLE_NOT_AVAILABLE_COLOR : '#FF0000',
        };

    });