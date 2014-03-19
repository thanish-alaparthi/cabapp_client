angular.module('sigmaCabsApp')
  .directive('numberOnly', function() {
    return {
      require: 'ngModel',
      restrict: 'ACE',
      link: function(scope, element, attrs, modelCtrl) {
        modelCtrl.$parsers.push(function(inputValue) {
          var firstParse, safeParse,
            secondParse, indexOfDot,
            transformedInput, transformedInputLength,
            min, max, returnValue;

          if (inputValue == undefined) {
            return '';
          }

          firstParse = inputValue.replace(/[^0-9.]/g, '');
          safeParse = firstParse.charAt(0);
          prepParse = firstParse.substring(1, firstParse.length);
          secondParse = safeParse + prepParse.replace(/[^0-9.]/g, '');
          indexOfDot = secondParse.indexOf(".");

          if (indexOfDot == -1) {
            transformedInput = secondParse;
          } else {
            safeParse = secondParse.substring(0, indexOfDot + 1);
            firstParse = (secondParse.substring(indexOfDot + 1, secondParse.length)).replace(/[^0-9]/g, '');
            indexOfDot = 2;

            transformedInput = (firstParse.length <= indexOfDot) ? (safeParse + firstParse) : (safeParse + firstParse.substring(0, indexOfDot));
          }
          min = (attrs.minvalue) ? parseInt(attrs.minvalue) : 0;
          max = parseInt(attrs.maxvalue);


          if (transformedInput != inputValue ||
            transformedInput < min ||
            transformedInput > max) {

            returnValue = (transformedInput < min || transformedInput > max) ?
              transformedInput.substring(0, transformedInput.length - 1) :
              transformedInput;

            modelCtrl.$setViewValue(returnValue);
            modelCtrl.$render();
          }

          return transformedInput;
        });
      }
    };
  });