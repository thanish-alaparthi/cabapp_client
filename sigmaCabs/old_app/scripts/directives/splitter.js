angular.module('sigmaCabsApp')
  .directive('splitter', function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {

        computedStyle = function(e, p, g) {
          g = window.getComputedStyle;
          return (g ? g(e) : e.currentStyle)[p.replace(/-(\w)/gi, function(w, l) {
            return l.toUpperCase();
          })];
        };
        
        var $, clientXProp, domElement, drag, draggingHandler, elementHeight, elementLeft, elementRight, elementTop, elementWidth, handler, handlers, heightProp, i, jqPane, jqPanes, left, leftProp, length, maxWidthProp, minWidthProp, pane, panes, topProp, vertical, verticalClass, widthProp, _fn, _i, _ref;
        panes = element.children();
        length = panes.length;
        if (length < 2) {
          return;
        }
        domElement = element[0];
        element.css('position', 'absolute');
        $ = angular.element;
        vertical = attrs.vertical;
        if (vertical) {
          widthProp = 'height';
          heightProp = 'width';
          minWidthProp = 'min-height';
          maxWidthProp = 'max-height';
          leftProp = 'top';
          topProp = 'left';
          clientXProp = 'clientY';
          verticalClass = 'vertical';
        } else {
          widthProp = 'width';
          heightProp = 'height';
          minWidthProp = 'min-width';
          maxWidthProp = 'max-width';
          leftProp = 'left';
          topProp = 'top';
          clientXProp = 'clientX';
          verticalClass = 'horizontal';
        }
        elementHeight = computedStyle(domElement, heightProp);
        elementTop = computedStyle(domElement, topProp);
        elementLeft = parseInt(computedStyle(domElement, leftProp));
        elementWidth = parseInt(computedStyle(domElement, widthProp));
        elementRight = elementLeft + elementWidth;
        drag = draggingHandler = null;
        jqPanes = (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
            _results.push($(panes[i]));
          }
          return _results;
        })();
        handlers = [];
        pane = panes[length - 1];
        jqPane = jqPanes[length - 1];
        jqPane.css('position', 'absolute');
        pane.minWidth = parseInt(computedStyle(pane, minWidthProp) || '0');
        pane.width = parseInt(computedStyle(pane, widthProp) || jqPane.css(widthProp, '100px') && '100');
        _fn = function(handler, pane, i) {
          handler.bind('mousedown', function(ev) {
            ev.preventDefault();
            drag = true;
            return draggingHandler = handler;
          });
          return handler.bind('click', function(ev) {
            var leftPaneWidth, pos, right, rightPane, right_pos;
            ev.preventDefault();
            if (handler.clicked) {
              handler.clicked = false;
              if (i < length - 2) {
                if (parseInt(handlers[i + 1].css(leftProp)) < parseInt(handler.leftProp)) {
                  return;
                }
              }
              jqPanes[i].css(widthProp, handler.leftPaneWidth);
              handler.css(leftProp, handler.leftProp);
              jqPanes[i + 1].css(leftProp, handler.rightPaneLeftProp);
              jqPanes[i + 1].css(widthProp, handler.rightPaneWidthProp);
              return;
            }
            rightPane = panes[i + 1];
            handler.leftPaneWidth = jqPanes[i].css(widthProp);
            handler.leftProp = handler.css(leftProp);
            handler.rightPaneLeftProp = jqPanes[i + 1].css(leftProp);
            handler.rightPaneWidthProp = jqPanes[i + 1].css(widthProp);
            if (i === length - 2 && length !== 2) {
              leftPaneWidth = elementRight - parseInt(handlers[i - 1].css(leftProp)) - rightPane.minWidth;
              jqPanes[i].css(widthProp, leftPaneWidth + 'px');
              pos = elementRight - rightPane.minWidth;
              handler.css(leftProp, pos + 'px');
              jqPanes[i + 1].css(leftProp, pos + 'px');
              jqPanes[i + 1].css(widthProp, rightPane.minWidth + 'px');
            } else {
              leftPaneWidth = pane.minWidth;
              if (i === 0) {
                pos = elementLeft + leftPaneWidth;
              } else {
                pos = parseInt(handlers[i - 1].css(leftProp)) + leftPaneWidth;
              }
              if (length !== 2) {
                right = parseInt(handlers[i + 1].css(leftProp));
              } else {
                right = elementRight;
              }
              right_pos = right - pos;
              jqPanes[i].css(widthProp, leftPaneWidth + 'px');
              handler.css(leftProp, pos + 'px');
              jqPanes[i + 1].css(leftProp, pos + 'px');
              jqPanes[i + 1].css(widthProp, right_pos + 'px');
            }
            return handler.clicked = true;
          });
        };
        for (i = _i = 0, _ref = length - 1; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
          pane = panes[i];
          jqPane = jqPanes[i];
          jqPane.css('position', 'absolute');
          pane.minWidth = parseInt(computedStyle(pane, minWidthProp) || '0');
          pane.width = parseInt(computedStyle(pane, widthProp) || jqPane.css(widthProp, '100px') && '100');
          handler = angular.element('<div class="' + verticalClass + ' split-handler" style="position:absolute;"></div>');
          left = left + jqPane.width;
          handler.index = i;
          handler.css(leftProp, computedStyle(panes[i + 1], leftProp));
          handler.css(heightProp, elementHeight);
          handler.css(topProp, elementTop);
          jqPane.after(handler);
          handlers.push(handler);
          _fn(handler, pane, i);
        }
        element.bind('mousemove', function(ev) {
          var leftPane, leftPaneWidth, pos, pos_left, right, rightPane, right_pos;
          if (!drag) {
            return;
          }
          i = draggingHandler.index;
          draggingHandler.clicked = false;
          if (i < length - 2) {
            handlers[i + 1].clicked = false;
          }
          leftPane = panes[i];
          rightPane = panes[i + 1];
          if (i === 0) {
            left = elementLeft;
          } else {
            left = parseInt(handlers[i - 1].css(leftProp));
          }
          if (i === length - 2) {
            right = elementRight;
          } else {
            right = parseInt(handlers[i + 1].css(leftProp));
          }
          pos = ev[clientXProp];
          pos_left = pos - left;
          leftPaneWidth = pos - left;
          if (pos_left < leftPane.minWidth) {
            return;
          }
          right_pos = right - pos;
          if (right_pos < rightPane.minWidth) {
            return;
          }
          jqPanes[i].css(widthProp, leftPaneWidth + 'px');
          draggingHandler.css(leftProp, pos + 'px');
          jqPanes[i + 1].css(leftProp, pos + 'px');
          return jqPanes[i + 1].css(widthProp, right_pos + 'px');
        });
        return angular.element(document).bind('mouseup', function(ev) {
          return drag = false;
        });
      }
    };
  });

/*
//@ sourceMappingURL=splitter.map
*/