angular.module('sigmaCabsApp')
  .directive('accordianHandler', function() {
  	return {
  		restrict: 'A',
      link: function(scope, element, attrs, model) {
          var elem = $(element),
              headElem = elem.find('.panel-heading'),
	      	    bodyElem = elem.find('.panel-body'),
	      	    iElem = elem.find('i');          
        if(!bodyElem.hasClass('hide'))
          iElem.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
          
        $(headElem).click(function(ev){
          if(scope.oneAtATime)
            hideAllAccordions(elem);
          bodyElem.toggleClass('hide');
	      	if(bodyElem.hasClass('hide'))
            iElem.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');
          else
            iElem.removeClass('glyphicon-chevron-right').addClass('glyphicon-chevron-down');
      	});
      	/*scope.$watch('',function(){
      		
      	});*/
      	function hideAllAccordions(el){
          var elem = $(el);
      		var accordSiblings = elem.siblings();
      		angular.forEach(accordSiblings, function(accord) {
      			var accordElem = $(accord),
      				  bodyElem = accordElem.find('.panel-body'),
                iElem = accordElem.find('i');
      			bodyElem.addClass('hide');
      			iElem.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-right');      			
      		});
      	}
      }
    };
 });