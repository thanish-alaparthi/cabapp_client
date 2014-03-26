
angular.module('sigmaCabsApp')
  .directive('googleplace', function($compile) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, model) {
              var options = {
                  types: [],
                  componentRestrictions: {country: 'in'}
              };

              if(typeof(google) != 'undefined') {

                scope.gPlace = new google.maps.places.Autocomplete(element[0], options);

                google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                    scope.$apply(function() {
                        model.$setViewValue(element.val());                
                    });
                });
              } else {

                // var sHtml = '<angucomplete id="ex1" placeholder="Search" pause="100" som="' +  attrs.ngModel + '" localdata="allLocations" selectedobject="' + attrs.ngModel + '" searchfields="location" titlefield="location" minlength="1" inputclass="form-control form-control-small textFieldCompact" ngblur="' + attrs.ngBlur +'" ngfocus="' + attrs.ngFocus + '" ngclass="' + attrs.ngClass + '"  />';

                var sXtraAttr = "";                  
                if(attrs.hasOwnProperty('ngBlur')){
                  sXtraAttr += 'ng-blur="' + attrs.ngBlur +'"'; 
                }
                if(attrs.hasOwnProperty('ngFocus')){
                  sXtraAttr += 'ng-focus="' + attrs.ngFocus + '"'; 
                }
                if(attrs.hasOwnProperty('ngClass')){
                  sXtraAttr += 'ng-class="' + attrs.ngClass + '"'; 
                }

                var sHtml = '<select class="' + attrs.class +'" ng-model="' + attrs.ngModel + '" ng-options="obj.location as obj.location for obj in allLocations | orderBy:\'location\'" ' + sXtraAttr + ' ></select>';
                

                var sTemplate = $compile(sHtml)(scope);
                element.replaceWith(sTemplate);

                // $(sTemplate)
                // .insertBefore('#insertFieldBeforeMeID');
              }
          }
      };
  });