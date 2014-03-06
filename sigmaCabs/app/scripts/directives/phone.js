angular.module('sigmaCabsApp')
  .directive('phone', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {        
        $(element).attr({
          'maxlength' : '10'
        });
        $(element).numeric({negative : false});

        $(element).bind('keypress',function(e) {
          if(this.value.indexOf("0") == 0)
          {
            return false;
          }
        });
        $(element).bind('keyup',function(e) {
          if(this.value.indexOf("0") == 0)
          {
            this.value = "";
          }
        });
      }
    };
  });