/*
Name: sigmaCabs
Description: BookingHistory
Date: 18Feb2014
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('MainBookingHistory', function($scope, $rootScope, URLService, BookingService, VehiclesService, $routeParams, PrerequisiteService) {

      //attach safeApply
      $scope.safeApply = function(fn) {
        var phase = this.$root.$$phase;
        if(phase == '$apply' || phase == '$digest') {
          if(fn && (typeof(fn) === 'function')) {
            fn();
          }
        } else {
          this.$apply(fn);
        }
      };

      var scope = $scope;


      scope.mainBookingHistoryGrid = {
        data: 'bookingHistoryDetails',
        rowHeight: 25,
        columnDefs: [{
          field: 'srno',
          displayName: '#',
          width : 30
        }, {
          field: 'bookingCode',
          displayName: 'Booking#',
          width: '65'
        },{
          field: 'bookingDisplayDate',
          displayName: 'Booking Dt. & Tm.',
          width: '110'
        },{
          field: 'pickupDisplayDateAndTime',
          displayName: 'Pickup Dt. & Tm.',
          width: '110'
        }, {
          field: 'primaryPassanger',
          displayName: 'Passenger Name',
          width: 110
        }, {
          field: 'pickupPlace',
          displayName: 'Pickup',
          width: '*'
        }, {
          field: 'dropPlace',
          displayName: 'Drop',
          width: '*'
        }, {
          field: 'subJourneyTypeName',
          displayName: 'Sub-Journey Type',
          width: '125'
        }, {
          field: 'vehicleDisplayType',
          displayName: 'V. Type',
          width: 60
        }, {
          field: 'vehicleDisplayName',
          displayName: 'V. Name',
          width: 70
        }, {
          field: 'bookingStatusName',
          displayName: 'Status',
          width: 90
        }, {
          field: 'id',
          displayName: 'id',
          visible: false
        }],
        enablePaging: false,
        showFooter: false,
        multiSelect: false,
        enableCellSelection : false,
        enableRowSelection: true,
        afterSelectionChange: function(oRow) {
          console.log(oRow.selectionProvider.selectedItems[0]);
        }
      };

      scope.voiceRecordingGridData = [];

      scope.mainVoiceRecordingGrid = {
        data: 'voiceRecordingGridData',
        rowHeight: 25,
        columnDefs: [{
          field: 'srno',
          displayName: '#',
          width : 30
        }, {
          field: 'Date & Time',
          displayName: 'dateAndTime',
          width: '110'
        },{
          field: 'filePath',
          displayName: 'File Path',
          width: '*'
        },{
          displayName: 'Action',
          width: '110'
        }],
        enablePaging: false,
        showFooter: false,
        multiSelect: false,
        enableCellSelection : false,
        enableRowSelection: false
      };




      scope.$on('$destroy', function () {
          console.log('destory MainBookingHistory');
      });
    
    });
