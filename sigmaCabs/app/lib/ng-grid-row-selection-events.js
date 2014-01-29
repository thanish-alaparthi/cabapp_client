/*:: Thanish ::
    This plugin is to extend the behavior of ngGrid, for the requirement of having custom RowSelection behavior, when we click on the row.
*/
function ngGridRowSelectionEvents () {
    var self = this;
    self.$scope = null;
    self.myGrid = null;
    self.previousRow = null;
    // The init method gets called during the ng-grid directive execution.
    self.init = function(scope, grid, services) {
        // The directive passes in the grid scope and the grid object which we will want to save for manipulation later.
        self.$scope = scope;
        self.myGrid = grid;
        self.services = services;
        // In this example we want to assign grid events.
        self.assignEvents();
    };
    self.colToMove = undefined;
    self.groupToMove = undefined;
    self.assignEvents = function() {
        // Here we set the onmousedown event handler to the header container.
        self.myGrid.$viewport.on('click', self.onRowMouseDown);
		self.myGrid.$root.on('deSelectRows', self.deSelectGridRows);
    };
    // Row functions
    self.onRowMouseDown = function(event) {
        var targetElem = $(event.target);
        //Check if the mouse down is on a row
        if(targetElem.parents('div.ngRow').length){
            // Get the closest row element from where we clicked.
            var targetRow = targetElem.closest('.ngRow');
            // Get the scope from the row element
            var rowScope = angular.element(targetRow).scope();
            if(rowScope){
                //Fetch the rowselected attribute, which reveals if the our row selection info
                var rowSelected = targetRow.attr('rowselected');
                if(targetElem.is('input')) {
                    //do something for checkbox selection
                } else {
                    var prevRow = self.services.DomUtilityService.eventStorage.$customRowSelected;
                    /* 
                      If there is already a previous row,
                        1. check if the row selection is on the same row,
                            if yes, then just fire the deselection event, as additional overhead is taken care down the line
                        2. deselect the previously selected row.
                    */
                    if(prevRow){                        
                        $(prevRow).removeClass('ngRowSelected').attr('rowselected','false');
                        if($(prevRow).is($(targetRow))){
                            self.$scope.$emit('ngGridRowDeSelected', rowScope.row.entity);
                            self.services.DomUtilityService.eventStorage.$customRowSelected = undefined;
                            return;
                        }
                    }
                    if(rowSelected !== undefined && rowSelected !== false && rowSelected !== "false"){
                        targetRow.removeClass('ngRowSelected').attr('rowselected','false');
                    } else {
                        targetRow.addClass('ngRowSelected').attr('rowselected','true');
                        self.$scope.$emit('ngGridRowSelected', rowScope.row.entity);
                        self.services.DomUtilityService.eventStorage.$customRowSelected = targetRow;
                    }
                }
            }
        }
    };
	self.deSelectGridRows = function(){		
		var prevRow = self.services.DomUtilityService.eventStorage.$customRowSelected;
		if(prevRow){
			var rowScope = angular.element(prevRow).scope();
            if(rowScope){
    			$(prevRow).removeClass('ngRowSelected').attr('rowselected','false');
    			self.$scope.$emit('ngGridRowDeSelected', rowScope.row.entity);
    			self.services.DomUtilityService.eventStorage.$customRowSelected = undefined;
            }
			return;
		}
	};
}