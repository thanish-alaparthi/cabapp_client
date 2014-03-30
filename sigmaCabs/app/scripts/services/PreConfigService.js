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
            BOOKING_ENQUIRY : 1,             // onServer it is Enquiry  
            BOOKING_FOLLOW_UP : 2,           // onServer it is Follow Up
            BOOKING_REJECTED : 3,            // onServer it is Rejected by Customer  
            BOOKING_YET_TO_DISPATCH : 4,     // onServer it is Yet to Dispatch 
            BOOKING_VEHICLE_ASSIGNED : 5,    // onServer it is Vehicle Assigned   
            WHILE_DRIVING : 6,               // onServer it is Vehicle Confirmed  
            BOOKING_COMPLETED_N_CLOSED : 7,  // onServer it is While Driving    
            BOOKING_CANCELLED : 8,           // onServer it is Completed
            BOOKING_CANCELLED_ON_CALL : 9,   // onServer it is Cancelled  

            /* VEHICLE STATUS */

            VEHICLE_AVAILABLE_COLOR : '#00FF00',
            VEHICLE_PROBABLILY_AVAILABLE_COLOR : '#FFA500',
            VEHICLE_NOT_AVAILABLE_COLOR : '#FF0000',

            // default airport pickup and drop, these are set when journey type is changed
            DEFAULT_ADDR_FOR_AIRPORT : 'AIRPORT',

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