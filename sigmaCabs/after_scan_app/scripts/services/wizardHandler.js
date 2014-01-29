//Contains all the the utility methods related to wizard component
'use strict';
angular.module('sigmaCabsApp')
.factory('wizardHandler', function( $rootScope, $http){
  var wizardHandler = function(data){
    angular.extend(this, data);
  };

  var currentTab = '';
  //var steps = ['basicInfo', 'certificates'];
  var steps = []
  var step = 0;
  wizardHandler.resetStep = function(){
    step = 0;
    steps = [];
  };
  /*
    Method description: Sets the currents steps with passed arary
    PARAMS: steps array
  */
  wizardHandler.setSteps = function(stepArray){
    steps = stepArray ;
  };

  /*
    Method description: Sets the currents step to passed number
    PARAMS: step number
  */
  wizardHandler.setStep = function(stepNum){
    step = stepNum ;
  };


  /*
    Method description: Gets currrent  step
    PARAMS: No params
  */
  wizardHandler.getCurrentStep = function(){
    return step;
  };
  /*
    Method description: Increments the step
    PARAMS: No params
  */
  wizardHandler.incrementStep = function(){
    step ++;
  };

  /*
    Method description: Increments the step
    PARAMS: No params
  */
  wizardHandler.decrementStep = function(){
    step -= (this.isFirstStep()) ? 0 : 1;
  };

  /*
    Method description: Gets the the label based on step
    PARAMS: No params
  */
  wizardHandler.getNextLabel = function() {
    return (this.isLastStep()) ? 'Finish' : 'Next'; 
  };

  /*
    Method description: Checks if current step is first or not 
    PARAMS: No params
  */
  wizardHandler.isFirstStep = function() {
    return step === 0;
  };

  /*
    Method description: Checks if current step is last or not 
    PARAMS: No params
  */
  wizardHandler.isLastStep = function() {
    var lastStep = false; 
    if(step === (steps.length - 1)){
      lastStep = true;
    }
    return lastStep;


  };

  wizardHandler.clearLocation = function(){
    this.currentTab = '';
  };
  /*
    Method description: Get the current tab in asset master operation view
    PARAMS: No params
  */
  wizardHandler.showCurrentTab = function(){
    var whichStep = this.getCurrentStep();
    this.currentTab = steps[whichStep].template + '.html';
  }
  return wizardHandler;

});