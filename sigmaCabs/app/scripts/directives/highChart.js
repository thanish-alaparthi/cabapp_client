angular.module('sigmaCabsApp')
  .directive('chart', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      template:'<div></div>',
      link: function (scope, element, attrs) {
       var chart, backGroundColor, whiteColor, greyColor;
       whiteColor = '#FFFFFF';
       greyColor = '#EBEBEB';
        if(attrs.type == 'bar'){
          backGroundColor = whiteColor;
        } else {
          backGroundColor = greyColor;
        }
        var stateObj = $('#stateChart');
        var statusObj = $('#statusChart');
        var windowWidth = $(window).width()/3 -1 - 60;
        var chartsDefaults = {
          chart: {
            renderTo: element[0],
            type: attrs.type || null,
            height: attrs.height || null,
            width: windowWidth,
            backgroundColor: backGroundColor,
            plotBorderWidth: null,
            plotShadow: false,
               events: {
                  click: function(event) { 
                    scope.arrowPointer = "bar";
                    scope.changeChart(attrs.type);
                  }
              }  
          },
          
          credits: {
            enabled: false
          },

          xAxis: {
              //allowDecimals : false,
              categories: [],
              title:{
                text:''
            }
          },

          yAxis:{
            allowDecimals : false,
            title:{
              text:''
            }
          },        

          plotOptions: {
            bar: {            
              dataLabels: {
                enabled: true
              },
              events:{
                click: function(event) {
                  scope.changeChart(attrs.type);
                }
              },
              showInLegend: false
            },pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                animation:0,
                dataLabels: {
                    enabled: true,
                    formatter: function() {
                           return Math.round(this.percentage*100)/100 + ' %';
                      },
                },
                events:{
                  click: function(event) {
                      scope.changeChart(attrs.type);
                  }
              },
                point: {
                    events: {
                          mouseOut: function () {
                           //if(scope.arrowPointer == "pie")
                              setTranslation(this, false);
                          },
                          mouseOver: function() {
                            //if(scope.arrowPointer == "pie")
                              setTranslation(this, true);
                          },
                        legendItemClick: function () {
                          scope.changeChart(attrs.type);
                          return false; // <== returning false will cancel the default action
                        }
                    }
                },
                showInLegend: true
            },series: {
                animation: {
                  duration: 1500,
                  easing: 'swing'
                },
                colorByPoint: true
              }
          }, legend: {            
               width: 105,
               align: 'right',
               x: -10,
               verticalAlign: 'top',
               y: 20,
               itemWidth: 80,
               floating: true,
               borderWidth : 0
          }, 
          tooltip:{
              formatter: function(){
                var tempAssetCount = '<br>' + 'Assets' + ':' + this.y
                return this.point.name + tempAssetCount ;
              }
          }   
        };
        // Watches for data changes
        scope.$watch(function() { return attrs.value;}, function(value) {
          scope.arrowPointer = "bar"; 
            if(!attrs.value) 
              return;
            var deepCopy = true;
            var newSettings = {};
            $.extend(deepCopy, newSettings, chartsDefaults, JSON.parse(attrs.value));
            chart = new Highcharts.Chart(newSettings);
            scope.stateChart = stateObj.highcharts(); 
            scope.statusChart = statusObj.highcharts();
        });

        //Handles the clik functionality for the chart

        scope.changeChart = function(chartType){
          $timeout(function(){
            if(chartType == 'bar'){ 
                scope.arrowPointer = "bar";                 
                scope.changeBgColor(scope.statusChart, whiteColor);
                scope.changeBgColor(scope.stateChart, greyColor); 
            }else{   
                scope.arrowPointer =  "pie"; 
                scope.changeBgColor(scope.statusChart, greyColor);
                scope.changeBgColor(scope.stateChart, whiteColor);            
            } 
          },0);

        };
        
        //Changes the Background color of the chart
        scope.changeBgColor = function(chartType, color){
          chartType.chartBackground.attr({
              fill:color
          });
        };  

        // Translation for pie chart

        function setTranslation(p, slice){
          p.sliced = slice;
          if(p.sliced){
              p.graphic.animate(p.slicedTranslation);
          } else {
              p.graphic.animate({
                  translateX: 0,
                  translateY: 0
              });
          }       
      }
       
      }
   }
  });