angular.module('sigmaCabsApp')
  .directive('datepicker', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {
        element
          .datePicker({
            createButton: false,
            displayClose: true,
            closeOnSelect: true,
            selectMultiple: false
          })
          .bind(
            'click',
            function() {
              $(this).dpDisplay();
              this.blur();
              return false;
            }
        ).bind(
          'dateSelected',
          function(e, selectedDate, $td, state) {
            if(!state){
              setTimeout(function(){
                console.log($td);
                $td.removeClass('selected');
              },100);
            }

          }
        );

        scope.$watch('model',function(){
          console.log('watching date....', model.$modelValue);
          element.dpSetSelected(model.$modelValue);
        });

      }
    };
  });