
angular.module('sigmaCabsApp')
  .directive('addDynamicField', function(PrerequisiteService, $compile) {
      return {
          require: 'ngModel',
          link: function(scope, element, attrs, model) {

              // scope.test = function(){
              //   console.log('inTest directive');
              // }

              $(element).on('click', function(){
                
                if(!PrerequisiteService.customerFieldTypes[model.$modelValue]){
                  return;
                }

                switch(PrerequisiteService.customerFieldTypes[model.$modelValue]) {
                  case 'text':
                    sInputField = '<input type="text" data-ng-model="customerDetails.' + model.$modelValue + '" class="form-control validate[required,maxSize[128]] large" placeholder="' + PrerequisiteService.customerFields[model.$modelValue] + '" />';
                  break;
                  case 'dropdown' : 
                    sInputField = '<select class="form-control large" data-ng-model="customerDetails.' + model.$modelValue + '" ng-options="value.type as value.title for value in ' + scope.extraFieldTypes[model.$modelValue] + '"></select>';
                  break;
                }

                var sHtml = '';
                    sHtml = '<div class="fieldContainer relative left">';
                    sHtml += '<label class="control-label">' + PrerequisiteService.customerFields[model.$modelValue] + '</label> ';
                    sHtml += sInputField;
                    sHtml += ' </div>';

                var sTemplate = $compile(sHtml)(scope);

                $(sTemplate)
                .insertBefore('#insertFieldBeforeMeID');
                // angular.element(sHtml);

                //     var sId = (new Date()).getTime();
                // $('<div id="id_' + sId + '">' + sHtml + '</div>')
                // .insertBefore('#insertFieldBeforeMeID');

                // var sDomHtml = $('#id_' + sId);// .contents();
                // console.log(sDomHtml);

                // var sTemplate = angular.element($compile(sDomHtml)(scope));

                // for(var x in scope.emptyCustomerFields) {
                //   if(x == model.$modelValue) {
                //     delete scope.emptyCustomerFields[x];
                //   }
                //   j = x;
                // }
                // for(var x in scope.emptyCustomerFields) {
                //   if(x != ""){
                //     j = x ;
                //     break;
                //   }
                // }

                scope.$emit('dynamicFieldAdded', model.$modelValue);

                $('#insertFieldHackId').val('testtsetetsdfasfs');


              });
          }
      };
  });