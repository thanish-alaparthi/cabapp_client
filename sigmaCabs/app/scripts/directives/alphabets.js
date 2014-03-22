angular.module('sigmaCabsApp')
  .directive('alphabetsOnly', function() {
    return {
      require: 'ngModel',
      restrict: 'ACE',
      link: function(scope, element, attrs, modelCtrl) {
        var regexPattern,
          oPattern = {
            'A': /[^a-zA-Z ]/g,
            'AN': /[^a-zA-Z0-9 ]/g
          };

        // Options to restrict
        // A - Alphabets only
        // AN - Alphanumeric
        switch (attrs.restrict) {
          case "AN":
            regexPattern = oPattern[attrs.restrict];
            break;
          case "A":
          default:
            regexPattern = (attrs.restrict) ? oPattern[attrs.restrict] : oPattern['A'];
            break;
        }
        modelCtrl.$parsers.push(function(inputValue) {
          var transformedInput = '',
            returnValue = '';
          if (inputValue == undefined) {
            return '';
          }

          if (inputValue.match(regexPattern)) {
            transformedInput = inputValue.replace(regexPattern, '');
          } else {
            transformedInput = inputValue;
          }

          if (transformedInput != inputValue) {
            returnValue = (inputValue.match(regexPattern)) ? transformedInput : inputValue;
            modelCtrl.$setViewValue(returnValue);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });