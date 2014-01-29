angular.module('customDialogServices', []).factory('customDialog', ["$document", "$compile", "$rootScope", "$controller", "$timeout",
  function ($document, $compile, $rootScope, $controller, $timeout) {
    var defaults = {
      id: null,
      template: null,
      templateUrl: null,
      title: 'Default Title',
      backdrop: false,
      success: {label: 'OK', fn: null},
      cancel: {label:'Cancel', fn:null},
      controller: null, //just like route controller declaration
      backdropClass: "modal-backdrop",
      footerTemplate: null,
      footerContent: null,
      headerTemplate: null,
      headerContent:null,
      modalClass: "modal",
      dialogType: 'informative',
      css: {
        top: '100px',
        left: '30%',
        margin: '0 auto'
      },
      resourceBundle:null
    };
    var body = $document.find('body');
    /*$scope.resourceBundle = $.extend(,{

    });*/
    return function Dialog(templateUrl/*optional*/, options, passedInLocals) {

      // Handle arguments if optional template isn't provided.
      if(angular.isObject(templateUrl)){
        passedInLocals = options;
        options = templateUrl;
      } else {
        options.templateUrl = templateUrl;
      }

      options = angular.extend({}, defaults, options); //options defined in constructor
      var key;
      var idAttr = options.id ? ' id="' + options.id + '" ' : '';
      var defaultFooterTemplate;
      if(options.dialogType == 'confirm'){
        defaultFooterTemplate = [ '<button class="grayBtn left" ng-click="$modalSuccess()" title="'
                                  , options.footerContent.okBtnTooltip
                                  , '">'
                                  , options.footerContent.okBtnLabel
                                  , '</button><button class="grayBtn right" ng-click="$modalCancel()" title="'
                                  , options.footerContent.cancelBtnTooltip
                                  , '">'
                                  , options.footerContent.cancelBtnLabel
                                  , '</button>'
                                ];
      }else if(options.dialogType == 'informative'){
        defaultFooterTemplate = ['<button class="grayBtn right" ng-click="$modalSuccess()" title="'
                                  , options.footerContent.okBtnTooltip
                                  , '">'
                                  , options.footerContent.okBtnLabel
                                  , '</button>'
                                ];
      }

      var defaultFooter = defaultFooterTemplate.join('');
      var footerTemplateArr = [ '<div class="modal-footer">'
                              , (options.footerTemplate || defaultFooter) 
                              , '</div>'
                              ];
      var footerTemplate =  footerTemplateArr.join('');
      var defaultHeaderTemplate = ['<span class="heading left">', options.headerContent.title, '</span>'];
      var defaultHeader = defaultHeaderTemplate.join('');
      var headerTemplateArr = ['<div class="modal-header clearfix">'
                             , (options.headerTemplate || defaultHeader)
                             , '</div>'];
      var headerTemplate = headerTemplateArr.join('');

      var modalBody = (function(){
        if(options.template){
          if(angular.isString(options.template)){
            // Simple string template
            var simpleTemplate = ['<div class="modal-body">', options.template, '</div>'];
            return  simpleTemplate.join('');
          } else {
            // jQuery/JQlite wrapped object
            var wrappedTemplate = ['<div class="modal-body">', options.template.html(), '</div>'];
            return wrappedTemplate.join('');
          }
        } else {
          // Template url
          var templateUrlTemplate = ['<div class="modal-body" ng-include="\''
                                    , options.templateUrl
                                    , '\'"></div>'
                                  ];
          return  templateUrlTemplate.join('');
        }
      })();
      //We don't have the scope we're gonna use yet, so just get a compile function for modal
      var modalElementTemplate = [ '<div class="'
                                  , options.modalClass
                                  , idAttr
                                  , '>'
                                  , headerTemplate
                                  , modalBody
                                  , footerTemplate
                                  , '</div>'
      ]
      var modalEl = angular.element(
        modalElementTemplate.join(' '));

      for(key in options.css) {
        modalEl.css(key, options.css[key]);
      }
      /*
        var backdropEl = angular.element('<div ng-click="$modalCancel()">')
        Removed the ng-click event to prevent a dialog box from closing
      */
      var backdropEl = angular.element('<div></div>');
      backdropEl.addClass(options.backdropClass);
      backdropEl.addClass('fade in');

      var handleEscPressed = function (event) {
        /*if (event.keyCode === 27) {
          scope.$modalCancel();
        }*/
      };

      var closeFn = function () {
        body.unbind('keydown', handleEscPressed);
        modalEl.remove();
        if (options.backdrop) {
          backdropEl.remove();
        }
        scope.$destroy();
      };

      body.bind('keydown', handleEscPressed);

      var ctrl, locals,
      scope = options.scope || $rootScope.$new();

      scope.$title = options.title;
      scope.$modalClose = closeFn;
      scope.$modalSuccess = function () {
        var callFn = options.success.fn || closeFn;
        scope.$modalClose();
        callFn.call();
      };
      scope.$modalCancel = function () {
        var callFn = options.cancel.fn || closeFn;
        scope.$modalClose();
        callFn.call();
      };
      scope.$modalSuccessLabel = options.success.label;

      if (options.controller) {
        locals = angular.extend({$scope: scope}, passedInLocals);
        ctrl = $controller(options.controller, locals);
        // Yes, ngControllerController is not a typo
        modalEl.contents().data('$ngControllerController', ctrl);
      }

      $compile(modalEl)(scope);
      $compile(backdropEl)(scope);
      body.append(modalEl);
      if (options.backdrop) body.append(backdropEl);

      $timeout(function () {
        modalEl.addClass('in');
      }, 200);
    };
  }]);