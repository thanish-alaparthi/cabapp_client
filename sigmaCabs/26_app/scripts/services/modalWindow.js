'use strict';

angular.module('sigmaCabsApp')
.factory('modalWindow', function($http, $dialog){

	var modalWindow = {};

	modalWindow.addDataToModal = function(opts){
		opts['backdrop'] = true;
		opts['keyboard'] = false;
		opts['backdropClick'] = false;
		var dialogBox = $dialog.dialog(opts)
			, modalEl = $(dialogBox.modalEl);
	  dialogBox.open();
		
	};

	// TODO: Not using this function
	modalWindow.addDataToMessageBox = function(opts){
	    $dialog.messageBox(title, msg, btns)
	      .open()
	      .then(function(result){
	        alert('dialog closed with result: ' + result);
	    });
	};
	return modalWindow;
});
