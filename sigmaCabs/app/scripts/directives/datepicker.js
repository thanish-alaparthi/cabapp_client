angular.module('sigmaCabsApp')
  .directive('datepicker', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {

        var isMultiDate = element.attr('multidate'); 

        element
          .datePicker({
            createButton: false,
            displayClose: true,
            closeOnSelect: (!isMultiDate ? true : false),
            selectMultiple: (isMultiDate ? true : false)
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
            } else {
              if(isMultiDate){
                var oMultiDate = element.attr('multidate-model');
                console.log('selectedDate: ',selectedDate);
                scope.fnDateAdded(oMultiDate, selectedDate);
              }
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