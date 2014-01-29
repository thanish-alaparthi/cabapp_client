/*:: Thanish ::
    This plugin is to extend the behavior of ngGrid, for the requirement of having custom RowSelection behavior, when we click on the row.
*/
function ngGridCellEditEvents () {
    var self = this;
    self.$scope = null;
    self.$gridScope = null;
    self.myGrid = null;
    // The init method gets called during the ng-grid directive execution.
    self.init = function(scope, grid, services) {
      // The directive passes in the grid scope and the grid object which we will want to save for manipulation later.
      self.$scope = scope;
      self.myGrid = grid;
      self.services = services;
      self.assignEvents();      
    };
    self.colToMove = undefined;
    self.groupToMove = undefined;
    self.assignEvents = function() {
      self.myGrid.$viewport.on('dblclick', self.onCellEditEvent);
      self.myGrid.$viewport.on('click', self.onCellEditTestEvent);
    };
    // Row functions
    self.onCellEditEvent = function(event) {
      var targetElem = $(event.target), endEvent = null, startEvent = null, oldCellValue = null, newCellValue = null;
       if(targetElem.parents('div.ngCell').length){
        var rowScope = angular.element(targetElem.closest('.ngRow')).scope();
        var cellScope = angular.element(targetElem.closest('.ngCell')).scope();
        var rowRef = rowScope.row;
        var rowObj = rowRef.entity;
        var index = rowRef.rowIndex; 
        var columnField = cellScope.col.field;
        startEvent = cellScope.$on('ngGridEventStartCellEdit', function() {
          oldCellValue = rowObj[columnField];
          startEvent(); //We do not want
        });
        endEvent = cellScope.$on('ngGridEventEndCellEdit', function(e, data) {
          newCellValue = data;
          if(newCellValue != undefined && newCellValue != oldCellValue){
            var eventData = {
                'row' : rowObj
              , 'rowIndex' : index
              , 'field': columnField
              , 'oldValue': oldCellValue
              , 'newValue': newCellValue
            }            
            self.$scope.$emit('ngGridCellEditComplete', eventData);
          }
          endEvent();
        });
      }
    };
    self.onCellEditTestEvent = function(event) {

    };
}