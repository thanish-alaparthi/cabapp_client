/*
Name: usersOpsController
Description: Main controller to handle users tab.
Date: 03/12/1987
Author: chot2::dev.chot2@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
	.controller('UserProfessionalDetails', function($scope, $http, PrerequisiteService, URLService, UsersService) {
		var scope = $scope,
			oDate = new Date(),
            yyyy = oDate.getFullYear().toString(),
            mm = (oDate.getMonth() + 1).toString(),
            dd = oDate.getDate().toString(),
            currentDate = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),
            nextYearDate = (parseInt(yyyy) + 1) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);


		/*
			set default values
		*/
		scope.tmpEducationalDetails = {
			yop: '',
			institute: '',
			degreeDiploma: '',
			grade: '',
			location: '',
			percentMarks: '',
			id : ''
		};
		scope.tmpPastExperienceDetails = {
			company: '',
			startDate: currentDate,
			endDate: nextYearDate,
			description: '',
			location: '',
			percentMarks: '',
			id : ''
		};
		/*
			EOF: set default values
		*/


		/*
            Setup sub-Tabs for professional Tab
        */
		scope.professionalSubTab = 1; // Set the first tab as the default tab.

		/*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
		scope.fnIsActiveProfessionalSubTab = function(iTab) {
			return scope.professionalSubTab == iTab;
		};
		scope.fnSetActiveProfessionalSubTab = function(iTab) {
			scope.professionalSubTab = iTab;
		};
		scope.userEducationalDetails = URLService.view('userEducationalDetailsSubTab');
		scope.userPastExperienceDetails = URLService.view('userPastExperienceDetailsTab');
		/*
            EOF : Setup sub-Tabs for SupportDetails Tab
        */

		/**
        EducationalDetails details grid start
        **/
		scope.educationalDetailsAddButon = "Add to List";
		scope.fnClearUserEducationalDetailsFields = function() {

			scope.tmpEducationalDetails = {
				yop: '',
				institute: '',
				degreeDiploma: '',
				grade: '',
				location: '',
				percentMarks: '',
				id : ''
			};

			scope.tmpEducationalDetails.rowIndex = "";
			scope.educationalDetailsAddButon = "Add to List";
		};
		scope.fnEducationalDetailsRowSelected = function(rowItem) {
			// console.log(rowItem.rowIndex, scope.educationalDetailsSelectedData);
			if (!scope.educationalDetailsSelectedData.length) {
				scope.fnClearUserEducationalDetailsFields();
				return;
			}
			scope.tmpEducationalDetails.yop = scope.educationalDetailsSelectedData[0].yop;
			scope.tmpEducationalDetails.institute = scope.educationalDetailsSelectedData[0].institute;
			scope.tmpEducationalDetails.degreeDiploma = scope.educationalDetailsSelectedData[0].degreeDiploma;
			scope.tmpEducationalDetails.grade = scope.educationalDetailsSelectedData[0].grade;
			scope.tmpEducationalDetails.percentMarks = scope.educationalDetailsSelectedData[0].percentMarks;
			scope.tmpEducationalDetails.educationalDetailsId = scope.educationalDetailsSelectedData[0].id;
			scope.tmpEducationalDetails.rowIndex = rowItem.rowIndex;
			scope.educationalDetailsAddButon = "Update";
		};

		scope.educationalDetailsSelectedData = [];
		scope.educationalDetailsGridOptions = {
			data: 'user.professionalDetails.educationDetails',
			columnDefs: [{
				field: 'yop',
				displayName: 'Year of Passing'
			}, {
				field: 'institute',
				displayName: 'Institute/College',
				visible: false
			}, {
				field: 'qualification',
				displayName: 'Qualification'
			}, {
				field: 'percentMarks',
				displayName: 'Percent/ Marks'
			}, {
				field: 'grade',
				displayName: 'Grade'
			}, {
				field: 'id',
				displayName: 'EducationalDetailsId',
				visible: true
			}],
			keepLastSelected: false,
			selectedItems: scope.educationalDetailsSelectedData,
			multiSelect: false,
			afterSelectionChange: scope.fnEducationalDetailsRowSelected
		};
		scope.fnAddEducationalDetailsToList = function() {
			if (!scope.tmpEducationalDetails.yop || !scope.tmpEducationalDetails.institute || !scope.tmpEducationalDetails.degreeDiploma || !scope.tmpEducationalDetails.percentMarks || !scope.tmpEducationalDetails.grade) {
				alert('Please add all the educationalDetails details.');
				return;
			}

			// console.log(">>>>>",scope.tmpEducationalDetails.rowIndex);
			if (parseInt(scope.tmpEducationalDetails.rowIndex) >= 0) {
				scope.user.professionalDetails.educationDetails[scope.tmpEducationalDetails.rowIndex].yop = scope.tmpEducationalDetails.yop;
				scope.user.professionalDetails.educationDetails[scope.tmpEducationalDetails.rowIndex].institute = scope.tmpEducationalDetails.institute;
				scope.user.professionalDetails.educationDetails[scope.tmpEducationalDetails.rowIndex].degreeDiploma = scope.tmpEducationalDetails.degreeDiploma;
				scope.user.professionalDetails.educationDetails[scope.tmpEducationalDetails.rowIndex].percentMarks = scope.tmpEducationalDetails.percentMarks;
				scope.user.professionalDetails.educationDetails[scope.tmpEducationalDetails.rowIndex].grade = scope.tmpEducationalDetails.grade;
			} else {
				scope.user.professionalDetails.educationDetails.push({
					yop: scope.tmpEducationalDetails.yop,
					institute: scope.tmpEducationalDetails.institute,
					degreeDiploma: scope.tmpEducationalDetails.degreeDiploma,
					percentMarks: scope.tmpEducationalDetails.percentMarks,
					grade: scope.tmpEducationalDetails.grade,
					attachments: []
				});
			}

			scope.tmpEducationalDetails = {
				yop: '',
				institute: '',
				degreeDiploma: '',
				grade: '',
				location: '',
				percentMarks: ''
			};
			scope.tmpEducationalDetails.rowIndex = "";
		}
		/**
         EOF: EducationalDetails details grid end
        **/


		/**
        PastExperienceDetails details grid start
        **/
		scope.pastExperienceDetailsAddButon = "Add to List";
		scope.fnClearUserPastExperienceDetailsFields = function() {

			scope.tmpPastExperienceDetails = {
				company: '',
				startDate: currentDate,
				endDate:  nextYearDate,
				description: '',
				location: '',
				id: ''
			};

			scope.tmpPastExperienceDetails.rowIndex = "";
			scope.pastExperienceDetailsAddButon = "Add to List";
		};
		scope.fnPastExperienceDetailsRowSelected = function(rowItem) {
			// console.log(rowItem.rowIndex, scope.pastExperienceDetailsSelectedData);
			if (!scope.pastExperienceDetailsSelectedData.length) {
				scope.fnClearUserPastExperienceDetailsFields();
				return;
			}
			scope.tmpPastExperienceDetails.company = scope.pastExperienceDetailsSelectedData[0].company;
			scope.tmpPastExperienceDetails.startDate = scope.pastExperienceDetailsSelectedData[0].startDate;
			scope.tmpPastExperienceDetails.endDate = scope.pastExperienceDetailsSelectedData[0].endDate;
			scope.tmpPastExperienceDetails.location = scope.pastExperienceDetailsSelectedData[0].location;
			scope.tmpPastExperienceDetails.description = scope.pastExperienceDetailsSelectedData[0].description;
			scope.tmpPastExperienceDetails.id = scope.pastExperienceDetailsSelectedData[0].id;
			scope.tmpPastExperienceDetails.rowIndex = rowItem.rowIndex;
			scope.pastExperienceDetailsAddButon = "Update";
		};

		scope.pastExperienceDetailsSelectedData = [];
		scope.pastExperienceDetailsGridOptions = {
			data: 'user.professionalDetails.pastExperience',
			columnDefs: [{
				field: 'company',
				displayName: 'Company'
			}, {
				field: 'startDate',
				displayName: 'Start Date'
			}, {
				field: 'endDate',
				displayName: 'End Date'
			}, {
				field: 'location',
				displayName: 'Location'
			}, {
				field: 'employeeId',
				displayName: 'employeeId'
			}, {
				field: 'id',
				displayName: 'PastExperienceDetailsId',
				visible: true
			}],
			keepLastSelected: false,
			selectedItems: scope.pastExperienceDetailsSelectedData,
			multiSelect: false,
			afterSelectionChange: scope.fnPastExperienceDetailsRowSelected
		};
		scope.fnAddPastExperienceDetailsToList = function() {
			console.log(scope.tmpPastExperienceDetails);
			if (!scope.tmpPastExperienceDetails.company || !scope.tmpPastExperienceDetails.startDate || !scope.tmpPastExperienceDetails.endDate || !scope.tmpPastExperienceDetails.description) {
				alert('Please add all the pastExperienceDetails details.');
				return;
			}

			// console.log(">>>>>",scope.tmpPastExperienceDetails.rowIndex);
			if (parseInt(scope.tmpPastExperienceDetails.rowIndex) >= 0) {
				scope.user.professionalDetails.pastExperience[scope.tmpPastExperienceDetails.rowIndex].company = scope.tmpPastExperienceDetails.company;
				scope.user.professionalDetails.pastExperience[scope.tmpPastExperienceDetails.rowIndex].startDate = scope.tmpPastExperienceDetails.startDate;
				scope.user.professionalDetails.pastExperience[scope.tmpPastExperienceDetails.rowIndex].endDate = scope.tmpPastExperienceDetails.endDate;
				scope.user.professionalDetails.pastExperience[scope.tmpPastExperienceDetails.rowIndex].description = scope.tmpPastExperienceDetails.description;
				scope.user.professionalDetails.pastExperience[scope.tmpPastExperienceDetails.rowIndex].location = scope.tmpPastExperienceDetails.location;
			} else {
				scope.user.professionalDetails.pastExperience.push({
					company: scope.tmpPastExperienceDetails.company,
					startDate: scope.tmpPastExperienceDetails.startDate,
					endDate: scope.tmpPastExperienceDetails.endDate,
					description: scope.tmpPastExperienceDetails.description,
					location: scope.tmpPastExperienceDetails.location,
					attachments: []
				});
			}

			scope.tmpPastExperienceDetails = {
				company: '',
				startDate: currentDate,
				endDate: nextYearDate,
				description: '',
				location: ''
			};
			scope.tmpPastExperienceDetails.rowIndex = "";
		}
		/**
         EOF: PastExperienceDetails details grid end
        **/
	});