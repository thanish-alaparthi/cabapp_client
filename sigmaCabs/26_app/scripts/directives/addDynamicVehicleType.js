angular.module('sigmaCabsApp')
  .directive('addDynamicVehicleType', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {

        fnAttachVehicleTypesHtml = function(iVehicleCount) {
          var sHtml = '';
          $('#insertVehicleTypeDropDownId').html(' ');
          scope.bookingDetails.vehicleTypes = scope.bookingDetails.vehicleTypes || [];
          for (var i = 0; i < iVehicleCount; i++) {
            scope.bookingDetails.vehicleTypes[i] = (scope.bookingDetails.vehicleTypes[i]) ? (scope.bookingDetails.vehicleTypes[i]).toString() : '1';
            sHtml = '<div class="fieldContainer relative left">';
            sHtml += '<label class="control-label">Vehicle Type' + (i + 1) + '</label>';
            sHtml += '<select class="form-control validate[maxSize[36]] large" data-ng-model="bookingDetails.vehicleTypes[' + i + ']" data-ng-options="k as v for (k,v) in vehicleTypes"></select>';
            sHtml += '</div>';
            var sTemplate = $compile(sHtml)(scope);
            $('#insertVehicleTypeDropDownId').append(sTemplate);
          }

          //remove the not needed vehicle Types ng-model
          for(var i=(scope.bookingDetails.vehicleTypes.length -1);i>=iVehicleCount;i--){
            scope.bookingDetails.vehicleTypes.splice(i,1);
          }

          /*
            check for vehicleCount and passengerCount            
          */
          scope.fnValidatePassengerCount();

          scope.safeApply();
        }

        fnDrawVehicleTypes = function(el) {

          // console.log('In fnDrawVehicleTypes', model.$modelValue);

          // console.log('vehicleCount: ',model.$modelValue);


          if (isNaN(model.$modelValue) || model.$modelValue > 50) {
            return;
          }

          fnAttachVehicleTypesHtml(model.$modelValue);


        };

        $(element).bind('change', fnDrawVehicleTypes);

        if (scope.bookingDetails && scope.bookingDetails.vehicleTypes && scope.bookingDetails.vehicleTypes.length) {
          var oData = $(element).data('is-first-time-call');
          if (!oData) {
            $(element).data('is-first-time-call', 'yes');
            var oData = $(element).data('is-first-time-call');
            fnAttachVehicleTypesHtml(scope.bookingDetails.vehicleTypes.length);
          }
        }
      }
    };
  });