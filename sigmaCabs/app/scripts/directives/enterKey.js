angular.module('sigmaCabsApp')
  .directive('ngEnter', function(SafeApply) {
    return function(scope, element, attrs) {
      element.bind("keypress", function(event) {
        if (event.which === 13) {
          SafeApply(scope, function() {
            scope.$eval(attrs.ngEnter);
          });
          event.preventDefault();
        }
      });
    };
  });