angular.module('sigmaCabsApp')
  .directive('dynamicMultiVehicleBooking', function(PrerequisiteService, $compile) {
    return {
     //  require: 'ngModel',
      link: function(scope, element, attrs, model) {
        console.log('Model Here: ',scope.vehicleCounts);


        fnDrawBookingDetails = function() {
          var iTotalVehicles =parseInt(scope.vehicleCounts.small + scope.vehicleCounts.medium + scope.vehicleCounts.tavera + scope.vehicleCounts.xyloAndInnova);

          sHtml = "";

          // Make the header
          // sHtml += "<tr><th class='headMultiVehicleTable'>Booking Details</th>";
          // for(var i=0;i<scope.vehicleCounts.small;i++){
          //   sHtml += "<th style='text-align: center;'>Small [" + (i +1) + "]</th>";  
          // }
          // for(var i=0;i<scope.vehicleCounts.medium;i++){
          //   sHtml += "<th style='text-align: center;'>Medium [" + (i +1) + "]</th>";  
          // }
          // for(var i=0;i<scope.vehicleCounts.tavera;i++){
          //   sHtml += "<th style='text-align: center;'>Tavera [" + (i +1) + "]</th>";  
          // }
          // for(var i=0;i<scope.vehicleCounts.xyloAndInnova;i++){
          //   sHtml += "<th style='text-align: center;'>Xylo/ Innova [" + (i +1) + "]</th>";  
          // }
          // sHtml += "</tr>";

          aBookingDetails = ['Vehicle Type','Pickup', 'Drop', 'Date', 'Time', 'Pas. Name', 'Pas. Phone', 'Journey Type', 'Sub-Journey', 'Landmark1', 'Landmark2', 'Vehicle Avail.'];

          sHtml += "<tr>";
          for(var i=0;i<aBookingDetails.length;i++){
            sHtml += "<th class='headMultiVehicleTable'>" + aBookingDetails[i]+ "</th>";
          }
          sHtml += "</tr>";

          scope.aTmpBookings = [];

          fnGetFields = function(iBookingKey) {

            scope.minutes = PrerequisiteService.minutes;
            scope.hours = PrerequisiteService.hours;

            scope.aTmpBookings[iBookingKey] = (scope.aTmpBookings[iBookingKey]) ? scope.aTmpBookings[iBookingKey] : {
              hours : PrerequisiteService.defaultBookingHour,
              minutes : PrerequisiteService.defaultBookingMinutes,
              pickupDate : PrerequisiteService.fnFormatDate(PrerequisiteService.currentDate),
              vehicleAvailability : '-'
            };

            sRtnHtml = "";
              sRtnHtml +="<td><input class='textFieldCompact' ng-model='aTmpBookings[" + iBookingKey + "].pickup' type='text' /></td>"; // pickup
              sRtnHtml +="<td><input class='textFieldCompact' ng-model='aTmpBookings[" + iBookingKey + "].drop' type='text' /></td>"; // Drop
              sRtnHtml +="<td><input datepicker ng-model='aTmpBookings[" + iBookingKey + "].pickupDate' class='textFieldCompact' type='text' /></td>"; // Date
              sRtnHtml +="<td>";
                sRtnHtml +="<select ng-model='aTmpBookings[" + iBookingKey + "].hours' ng-options='k as v for (k,v) in hours' class=' validate[maxSize[36]] selectFieldCompact' style='width:48px;'></select>";
                sRtnHtml +="<select ng-model='aTmpBookings[" + iBookingKey + "].minutes' ng-options='k as v for (k,v) in minutes' class=' validate[maxSize[36]] selectFieldCompact' style='width:48px;'></select>";
              sRtnHtml +="</td>"; // Time
              sRtnHtml +="<td><input ng-model='aTmpBookings[" + iBookingKey + "].passengerName' class='textFieldCompact' type='text' /></td>"; // Passenger Name
              sRtnHtml +="<td><input ng-model='aTmpBookings[" + iBookingKey + "].passengerPhone' class='textFieldCompact' type='text' /></td>"; // Passenger Phone
              sRtnHtml +="<td><select ng-model='aTmpBookings[" + iBookingKey + "].journeyType' class=' validate[maxSize[36]] selectFieldCompact'></select></td>"; // Journey Type
              sRtnHtml +="<td><select ng-model='aTmpBookings[" + iBookingKey + "].subJourneyType'  class=' validate[maxSize[36]] selectFieldCompact'></select></td>"; // Journey Sub-Type
              sRtnHtml +="<td><input ng-model='aTmpBookings[" + iBookingKey + "].landmark1' class='textFieldCompact' type='text' /></td>"; // Landmark 1
              sRtnHtml +="<td><input ng-model='aTmpBookings[" + iBookingKey + "].landmark2' class='textFieldCompact' type='text' /></td>"; // Landmark 2
              sRtnHtml +="<td style='background:#6EC5B8;'>{{ aTmpBookings[" + iBookingKey + "].vehicleAvailability }}</td>"; // Vehicle Availability
            return sRtnHtml;
          }

          var iBookingCount = 0;
          for(var i=0;i<scope.vehicleCounts.small;i++){
            sHtml += "<tr class='singleVehicleRow'>";
              sHtml +="<td>Small [" + (i+1) + "]</td>";
              sHtml += fnGetFields(iBookingCount);
            sHtml += "</tr>";
            iBookingCount++;
          }

          for(var i=0;i<scope.vehicleCounts.medium;i++){
            sHtml += "<tr class='singleVehicleRow'>";
              sHtml +="<td>Medium [" + (i+1) + "]</td>";
              sHtml += fnGetFields(iBookingCount);
            sHtml += "</tr>";
            iBookingCount++;
          }
          for(var i=0;i<scope.vehicleCounts.tavera;i++){
            sHtml += "<tr class='singleVehicleRow'>";
              sHtml +="<td>Tavera [" + (i+1) + "]</td>";
              sHtml += fnGetFields(iBookingCount);
            sHtml += "</tr>";
            iBookingCount++;
          }
          for(var i=0;i<scope.vehicleCounts.xyloAndInnova;i++){
            sHtml += "<tr class='singleVehicleRow'>";
              sHtml +="<td>Xylo/ Innova [" + (i+1) + "]</td>";
              sHtml += fnGetFields(iBookingCount);
            sHtml += "</tr>";
            iBookingCount++;
          }
          
          // for(var i=0;i<aBookingDetails.length;i++){
          //   sHtml += "<tr>";
          //     sHtml += "<td style='font-weight:bold;'>" + aBookingDetails[i] + "</td>";

          //     for(var j=0;j<iTotalVehicles;j++) {
          //       sHtml += "<td><input class='textFieldCompact' style='width:100%;' type='text'/></td>";
          //     }
          //   sHtml += "</tr>";
          // }          

          var sTemplate = $compile(sHtml)(scope);
          element.html(sTemplate);
        }

        fnDrawBookingDetails();

        scope.$watch('vehicleCounts', function(newVal, oldVal) {
          var iTotalVehicles =parseInt(scope.vehicleCounts.small + scope.vehicleCounts.medium + scope.vehicleCounts.tavera + scope.vehicleCounts.xyloAndInnova);
          
          if(isNaN(iTotalVehicles)){
            scope.$emit('eventVehicleCountMoreThanLimit');
          }

          if(iTotalVehicles> 5) {
            return false;
          }
          fnDrawBookingDetails();
        },true);
      }
    };
  });