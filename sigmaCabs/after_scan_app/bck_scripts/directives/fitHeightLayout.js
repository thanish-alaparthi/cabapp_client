angular.module('sigmaCabsApp')
  .directive('fitHeightLayout', ['$rootScope', function($rootScope){
  return{
  	restrict: 'A',
  	link: function( $scope, element, attributes){
  		var winHeight = $(window).height()
  			, elmHeight
        , heightToBeRemoved;
  		
  		$scope.$watch(attributes.ngModel, function (v) {
        heightToBeRemoved = v;
  			elmHeight = winHeight - v;
  			$(element).height(elmHeight);
        //$rootScope.$broadcast('heightResolved');
      });
      $(window).resize(function(){
          var winHeight = $(window).height();
          elmHeight = winHeight - heightToBeRemoved;
          $(element).height(elmHeight);
          
      });
  	}
  }
}]); 