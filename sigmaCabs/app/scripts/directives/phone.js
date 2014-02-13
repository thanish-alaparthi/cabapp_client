angular.module('sigmaCabsApp')
  .directive('phone', function(PrerequisiteService, $compile) {
    return {
      require: 'ngModel',
      link: function(scope, element, attrs, model) {        
        $(element).attr({
          'maxlength' : '10'
        });
        $(element).numeric({negative : false});
      }
    };
  });