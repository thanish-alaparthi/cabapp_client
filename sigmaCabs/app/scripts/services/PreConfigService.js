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

            /* VEHICLE STATUS */

            VEHICLE_AVAILABLE_COLOR : '#00FF00',
            VEHICLE_PROBABLILY_AVAILABLE_COLOR : '#FFA500',
            VEHICLE_NOT_AVAILABLE_COLOR : '#FF0000',

            // default airport pickup and drop, these are set when journey type is changed
            DEFAULT_ADDR_FOR_AIRPORT : 'RGIA, Hyderabad, Andhra Pradesh, India',

            // IDs of subJourney types 
            START_IS_AIRPORT_ID : '14',
            END_IS_AIRPORT_ID : '13',
            MID_IS_AIRPORT_ID : '15',
            START_AND_END_IS_AIRPORT_ID : '16',
            START_AIRPORT_PACKAGE_ID : '17',

            // array of subJourneyTypes IDs which has airport as either start or end.
            aAirportJourneyIds : ['13', '14', '15', '16', '17']
        };
        
    });