/*
Name: vehicleAddController
Description: Main controller to handle vehicle add modal
Date: 03/01/2014
Author: mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
    .controller('vehicleAddUpdateController', function(oVehicle, $scope, PrerequisiteService, $dialog, dialog, wizardHandler, $http, URLService, VehiclesService, appUtils) {

        var scope = $scope,
            oDate = new Date(),
            yyyy = oDate.getFullYear().toString(),
            mm = (oDate.getMonth() + 1).toString(),
            dd = oDate.getDate().toString(),
            currentDate = yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]),
            nextYearDate = (parseInt(yyyy) + 1) + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);

        scope.vehicle = {};

        scope.fromSaveAndExit = false;

        // get the vehicle Owners list
        scope.vehicleOwnersList = [];
        VehiclesService.fnGetVehicleOwnersList()
        .success(function(data, status, headers, config) {
            console.log('Success fnGetVehicleOwnersList: ', data);
            for(var i=0;i<data.length;i++) {
                scope.vehicleOwnersList.push({
                    id: data[i].id,
                    name : data[i].firstName + ' ' + data[i].lastName
                });
            }
            console.log('scope.vehicleOwnersList', scope.vehicleOwnersList);
        })
        .error(function(data, status, headers, config) {
            console.log('Error fnGetVehicleOwnersList: ', data);
        });


        /*
            function to set the default vehicle fields
        */
        scope.fnSetDefaultVehicleValues = function() {
            // basic details
            scope.vehicle.vehicleType = (1).toString(); // PrerequisiteService.vehicleTypeOptions[1];   // small
            scope.vehicle.vehicleAttachmentType = (1).toString(); // [COV] Operated by Company;
            scope.vehicle.carrier = '1'; // no-carrier;
            scope.vehicle.companyBranding = true; // Yes;
            // insurance details
            scope.vehicle.insuranceDetails = [];
            scope.tmpInsuranceDetails = {
                insuranceNumber: '',
                insuranceType: '1',
                name: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                provider: '',
                amount: '',
                id: ''
            };
            // permit details
            scope.vehicle.permitDetails = [];
            scope.tmpPermitDetails = {
                permitNumber: '',
                permitType: '1',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                id: ''
            };
            // RoadTax details
            scope.vehicle.roadTaxDetails = [];
            scope.tmpRoadTaxDetails = {
                roadTaxNumber: '',
                premiumType: '1',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                premiumAmount: '',
                id: ''
            };

            // RoadTax details
            scope.vehicle.rcDetails = [];
            scope.tmpRcDetails = {
                rcNumber: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                id: ''
            };
            // Dent & Scratch details
            scope.vehicle.vehicleCondition = {
                exterior: {
                    dentAndScratch: [],
                    tyres: {
                        frontLeft: '1',
                        frontRight: '1',
                        backRight: '1',
                        backLeft: '1',
                        stepney: '1'
                    },
                    lights: {
                        front: '1',
                        rear: '1',
                        indicator: '1'
                    },
                    winShield: {
                        front: '1',
                        rear: '1'
                    }
                },
                interior: {
                    floorMet: '1',
                    seatCover: '1',
                    ac: '1',
                    perfume: '1',
                    companyInternalBranding: '1',
                    comments: ""
                }
            };
            scope.tmpDentAndScratchDetails = {
                type: '1',
                severity: '1'
            };

            // vehicle performance
            scope.vehicle.vehiclePerformance = {
                battery: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                electricals: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                clutch: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                breaks: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                alignment: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                suspension: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                coolers: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                airFilters: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                engineOil: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                powerSteeringOil: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                gearOil: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                },
                breakOil: {
                    lastChangedOn: currentDate,
                    lastChangedKm: '',
                    description: ''
                }
            };

            // facilities detrails
            scope.vehicle.facilities = {
                entertainment: {
                    musicSystem: {
                        aux: false,
                        usb: false,
                        videoOut: false
                    },
                    cardPayments: false,
                    displayForVideo: false,
                    newsPaper: false
                },
                billingSystem: false,
                vehicleTrackingSystem: false,
                journySecuritySystem: false,
                tarrifLaminatedSystem: false
            };

            //advertisments 
            scope.vehicle.advertisments = {
                offLineAdds: false,
                onLineAdds: false
            }


        }
        /*
            EOF: function to set the default vehicle fields
        */



        console.log(oVehicle);
        // Check for type of screen
        if (oVehicle.id) {
            scope.screeType = "Update Vehicle [" + oVehicle.vehicleCode + "]";
            VehiclesService.fnGetVehicleDataById({
                id: oVehicle.id
            })
            .success(function(data, status, headers, config) {
                console.log('Success fnGetVehicleDataById: ', data);
                scope.vehicle = data;
            })
            .error(function(data, status, headers, config) {
                console.log('Error fnGetVehicleDataById: ', data);
            });
        } else {
            scope.screeType = "Add Vehicle";

            scope.fnSetDefaultVehicleValues();
        }

        /*
            Setup for basic details 
        */
            scope.brandingOptoins = PrerequisiteService.companyBrandingOptions;
            scope.vehicleTypes = PrerequisiteService.vehicleTypeOptions;
            scope.vehicleAttachmentTypes = PrerequisiteService.vehicleAttachmentTypeOptions;
            scope.tempVehicleConditionTypes = PrerequisiteService.vehicleConditionTypes;
            scope.entertainmentOptions = PrerequisiteService.entertainmentOptions;
            scope.insuranceTypeOptions = PrerequisiteService.insuranceType;
            scope.roadTaxTypeOptions = PrerequisiteService.roadTaxType;

            scope.polutionAndFitness = [{
                type: '1',
                title: 'Polution'
            },{
                type: '2',
                title: 'Fitness'
            }];
        /*
            EOF : Setup for basic details 
        */

        /*
            Setup sub-Tabs for SupportDetails Tab
        */
        scope.supportSubTab = 1; // Set the first tab as the default tab.

        /*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
        scope.fnIsActiveSupportSubTab = function(iTab) {
            return scope.supportSubTab == iTab;
        };
        scope.fnSetActiveSupportSubTab = function(iTab) {
            scope.supportSubTab = iTab;
        };

        scope.vehicleInsuranceDetails = URLService.view('vehicleSupportInsuranceDetailsSubTab');
        scope.vehiclePermitDetails = URLService.view('vehicleSupportPermitDetailsSubTab');
        scope.vehicleRoadTaxDetails = URLService.view('vehicleSupportRoadTaxDetailsSubTab');
        scope.vehicleRcDetails = URLService.view('vehicleSupportRcDetailsSubTab');
        scope.vehiclePollutionAndFitness = URLService.view('vehicleSupportPollutionAndFitnessSubTab');
        /*
            EOF : Setup sub-Tabs for SupportDetails Tab
        */

        /*
            Setup sub-Tabs for Exteriors Tab
        */
        scope.exteriorSubTab = 1; // Set the first tab as the default tab.

        /*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
        scope.fnIsActiveExteriorSubTab = function(iTab) {
            return scope.exteriorSubTab == iTab;
        };
        scope.fnSetActiveExteriorSubTab = function(iTab) {
            scope.exteriorSubTab = iTab;
        };

        scope.vehicleDentAndScratchesDetails = URLService.view('vehicleExterirorDentAndScratchesDetailsSubTab');
        scope.vehicleTyresDetails = URLService.view('vehicleExterirorTyresDetailsSubTab');
        scope.vehicleLightsDetails = URLService.view('vehicleExterirorLightsDetailsSubTab');
        scope.vehicleWindShieldDetails = URLService.view('vehicleExterirorWindSheildDetailsSubTab');
        scope.vehicleExteriorComments = URLService.view('vehicleExterirorCommentsDetailsSubTab');
        /*
            EOF : Setup sub-Tabs for Exterior Tab
        */

        /*
            Setup sub-Tabs for Performance Tab
        */
        scope.performanceSubTab = 1; // Set the first tab as the default tab.

        /*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
        scope.fnIsActivePerformaceSubTab = function(iTab) {
            return scope.performanceSubTab == iTab;
        };
        scope.fnSetActivePerformaceSubTab = function(iTab) {
            scope.performanceSubTab = iTab;
        };

        scope.vehicleBatteryAndElectricals = URLService.view('vehiclePerformanceBatteryAndElectricalsSubTab');
        scope.vehicleClutchAndBreaks = URLService.view('vehiclePerformanceClutchAndBreaksSubTab');
        scope.vehicleAlignmentAndSuspension = URLService.view('vehiclePerformanceAlignmentAndSuspensionsSubTab');
        scope.vehicleCoolersAndAirFilters = URLService.view('vehiclePerformanceCoolersAndAirFiltersSubTab');
        scope.vehicleEngineAndPowerSteeringOil = URLService.view('vehiclePerformanceEngineAndPowerSteeringOilSubTab');
        scope.vehicleGearAndBreakOil = URLService.view('vehiclePerformanceGearAndBreakOilSubTab');
        /*
            EOF : Setup sub-Tabs for Performance Tab
        */

        /*
            Setup sub-Tabs for Facilities Tab
        */
        scope.facilitiesSubTab = 1; // Set the first tab as the default tab.

        /*
            Name: fnIsActive,
            Descriptoin: takes tab number as an argument and returns true if passed tab number is active tab.
                Whenever a tab head is clicked, this function is called.
        */
        scope.fnIsActiveFacilitiesSubTab = function(iTab) {
            return scope.facilitiesSubTab == iTab;
        };
        scope.fnSetActiveFacilitiesSubTab = function(iTab) {
            scope.facilitiesSubTab = iTab;
        };

        scope.vehicleEntertainment = URLService.view('vehicleFacilitiesEntertainmentSubTab');
        scope.vehicleAdvertisments = URLService.view('vehicleFacilitiesAdvertismentSubTab');
        /*
            EOF : Setup sub-Tabs for Performance Tab
        */

        scope.close = function() {
            dialog.close();
        };

        scope.vehicleBrands = [{
            'id' : '1',
            'name': 'Tata'
        }, {
            'id' : '2',
            'name': 'Hunday'
        }, {
            'id' : '3',
            'name': 'Toyota'
        }, {
            'id' : '4',
            'name': 'Audi'
        }, {
            'id' : '5',
            'name': 'Mercedies'
        }, {
            'id' : '6',
            'name': 'Honda'
        }, {
            'id' : '7',
            'name': 'Maruti'
        }];


        scope.tabs = [{
            "label": 'Basic Details',
            "tooltip": 'Basic Details',
            "id": 0,
            "selected": true,
            "showTab": true,
            "template": URLService.view('vehicleBasicDetails')
        }, {
            "label": 'Paper Validity',
            "tooltip": 'Paper Validity',
            "id": 1,
            "selected": false,
            "showTab": true,
            "template": URLService.view('vehicleSupportDetailsTab')
        }, {
            "label": 'Vehicle Condition',
            "tooltip": 'Vehicle Condition',
            "id": 2,
            "selected": false,
            "showTab": true,
            "template": URLService.view('vehicleExteriorCondtionTab')
        }, {
            "label": 'Interior Condition',
            "tooltip": 'Interior Condition',
            "id": 3,
            "selected": false,
            "showTab": true,
            "template": URLService.view('vehicleInteriorCondtionTab')
        }, {
            "label": 'Vehicle Performance',
            "tooltip": 'Vehicle Performance',
            "id": 4,
            "selected": false,
            "showTab": true,
            "template": URLService.view('vehiclePerformanceTab')
        }, {
            "label": 'Facilities',
            "tooltip": 'Facilities',
            "id": 5,
            "selected": false,
            "showTab": true,
            "template": URLService.view('vehicleFacilitiesTab')
        }];

        scope.carrierRadioTypes = PrerequisiteService.carrierTypes;

        var tabCounter = 0;
        wizardHandler.setSteps(scope.tabs);
        // Show the first tab by default
        wizardHandler.setStep(0);
        scope.tabs[0].selected = true;
        wizardHandler.showCurrentTab();
        scope.previousSelectedTab = null;
        scope.currentSelectedTab = scope.tabs[0].id;
        scope.currentlyClickedTab = null;
        scope.wizardHandler = wizardHandler;

        scope.handleTabClick = function(clickedid) {
            if (scope.currentSelectedTab == clickedid) {
                return;
            }
            //scope.hideErrorMsg();
            scope.setTabSelection(clickedid);
        };

        /*
            Method description: Set the tab selection
            PARAMS: Currently selected tab
        */
        scope.setTabSelection = function(id) {
            scope.currentlyClickedTab = id;
            scope.isNext = true;
            $scope.$broadcast('getTabData');
            scope.changeTab(id);
        };

        /*
        Method description: Change the tab selection 
        PARAMS: No params
      */
        scope.changeTab = function(id) {
            tabCounter = 0;
            scope.tabs[scope.currentSelectedTab].selected = false;
            scope.tabs[id].selected = true;
            scope.previousSelectedTab = scope.currentSelectedTab;
            scope.currentSelectedTab = id;
            wizardHandler.setStep(id);
            wizardHandler.showCurrentTab();
            scope.wizardHandler = wizardHandler;
        };

        scope.handleNext = function() {
            $scope.$broadcast('getTabData');
        };

        scope.handleSaveAndExit = function(user) {
            scope.fromSaveAndExit = true;
            // scope.handleNext();

            if (scope.vehicle.id) {

                VehiclesService.fnUpdateVehicleData(scope.vehicle).
                success(function(data, status, headers, config) {
                    console.log('Success: ', arguments);
                    alert(data.response.message);
                    scope.close();
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', arguments);
                });
            } else {
                VehiclesService.fnAddVehicleData(scope.vehicle).
                success(function(data, status, headers, config) {
                    console.log('Success: ', arguments);
                    alert(data.response.message);
                    scope.close();
                })
                .error(function(data, status, headers, config) {
                    console.log('Error: ', arguments);
                });
            }
        };

        scope.$on('sendTabData', function(event, data) {
            scope.userDetObj = appUtils.mergeObj(scope.userDetObj, data.detObj);
            // console.log(scope.userDetObj);
        });

        scope.$on('showNext', function() {
            scope.showNext = true;
        });



        /**
        Insurance details grid..
        **/
        scope.insuranceAddButon = "Add to List";
        scope.fnClearVehicleInsuranceFields = function() {

            scope.tmpInsuranceDetails = {
                insuranceNumber: '',
                insuranceType: '1',
                name: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                provider: '',
                amount: '',
                id: ''
            };

            scope.tmpInsuranceDetails.rowIndex = "";
            scope.insuranceAddButon = "Add to List";
        };
        scope.fnInsuranceRowSelected = function(rowItem) {
            // console.log(rowItem.rowIndex, scope.insuranceSelectedData);
            if (!scope.insuranceSelectedData.length) {
                scope.fnClearVehicleInsuranceFields();
                return;
            }
            scope.tmpInsuranceDetails.insuranceNumber = scope.insuranceSelectedData[0].insuranceNumber;
            scope.tmpInsuranceDetails.name = scope.insuranceSelectedData[0].name;
            scope.tmpInsuranceDetails.insuranceType = scope.insuranceSelectedData[0].insuranceType;
            scope.tmpInsuranceDetails.issueDate = scope.insuranceSelectedData[0].issueDate;
            scope.tmpInsuranceDetails.expiryDate = scope.insuranceSelectedData[0].expiryDate;
            scope.tmpInsuranceDetails.provider = scope.insuranceSelectedData[0].provider;
            scope.tmpInsuranceDetails.amount = scope.insuranceSelectedData[0].amount;
            scope.tmpInsuranceDetails.id = scope.insuranceSelectedData[0].id;
            scope.tmpInsuranceDetails.rowIndex = rowItem.rowIndex;
            scope.insuranceAddButon = "Update";
        };

        scope.insuranceSelectedData = [];
        scope.insuranceGridOptions = {
            data: 'vehicle.insuranceDetails',
            columnDefs: [{
                field: 'insuranceNumber',
                displayName: 'Insurance Number'
            }, {
                field: 'name',
                displayName: 'Name'
            }, {
                field: 'insuranceType',
                displayName: 'Type',
                visible: false
            }, {
                field: 'issueDate',
                displayName: 'Issue Date'
            }, {
                field: 'expiryDate',
                displayName: 'Expiry Date'
            }, {
                field: 'provider',
                displayName: 'provider'
            }, {
                field: 'amount',
                displayName: 'Amount'
            }, {
                field: 'attachment',
                displayName: 'Attachment',
                visible: false
            }, {
                field: 'insuranceId',
                displayName: 'InsuranceId',
                visible: false
            }],
            keepLastSelected: false,
            selectedItems: scope.insuranceSelectedData,
            multiSelect: false,
            afterSelectionChange: scope.fnInsuranceRowSelected
        };
        scope.fnAddInsuranceToList = function() {
            if (!scope.tmpInsuranceDetails.issueDate || !scope.tmpInsuranceDetails.expiryDate || !scope.tmpInsuranceDetails.provider || !scope.tmpInsuranceDetails.amount) {
                alert('Please add all the insurance details.');
                return;
            }

            // console.log(">>>>>",scope.tmpInsuranceDetails.rowIndex);
            if (parseInt(scope.tmpInsuranceDetails.rowIndex) >= 0) {
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].issueDate = scope.tmpInsuranceDetails.issueDate;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].expiryDate = scope.tmpInsuranceDetails.expiryDate;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].provider = scope.tmpInsuranceDetails.provider;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].amount = scope.tmpInsuranceDetails.amount;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].insuranceType = scope.tmpInsuranceDetails.insuranceType;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].name = scope.tmpInsuranceDetails.name;
                scope.vehicle.insuranceDetails[scope.tmpInsuranceDetails.rowIndex].insuranceNumber = scope.tmpInsuranceDetails.insuranceNumber;
            } else {
                scope.vehicle.insuranceDetails.push({
                    insuranceType: scope.tmpInsuranceDetails.insuranceType,
                    name: scope.tmpInsuranceDetails.name,
                    insuranceNumber: scope.tmpInsuranceDetails.insuranceNumber,
                    issueDate: scope.tmpInsuranceDetails.issueDate,
                    expiryDate: scope.tmpInsuranceDetails.expiryDate,
                    provider: scope.tmpInsuranceDetails.provider,
                    amount: scope.tmpInsuranceDetails.amount,
                    attachments: []
                });
            }

            scope.tmpInsuranceDetails = {
                insuranceNumber: '',
                insuranceType: '1',
                name: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                provider: '',
                amount: ''
            };
            scope.tmpInsuranceDetails.rowIndex = "";
        }
        /**
        Insurance details grid end
        **/


        /**
        Permit details grid start
        **/
        scope.permitAddButon = "Add to List";
        scope.fnClearVehiclePermitFields = function() {

            scope.tmpPermitDetails = {
                permitNumber: '',
                permitType: '1',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                id: ''
            };

            scope.tmpPermitDetails.rowIndex = "";
            scope.permitAddButon = "Add to List";
        };
        scope.fnPermitRowSelected = function(rowItem) {
            // console.log(rowItem.rowIndex, scope.permitSelectedData);
            if (!scope.permitSelectedData.length) {
                scope.fnClearVehiclePermitFields();
                return;
            }
            console.log(scope.permitSelectedData[0]);
            scope.tmpPermitDetails.permitNumber = scope.permitSelectedData[0].permitNumber;
            scope.tmpPermitDetails.permitType = scope.permitSelectedData[0].permitType;
            scope.tmpPermitDetails.issueDate = scope.permitSelectedData[0].issueDate;
            scope.tmpPermitDetails.expiryDate = scope.permitSelectedData[0].expiryDate;
            scope.tmpPermitDetails.permitId = scope.permitSelectedData[0].permitId;
            scope.tmpPermitDetails.id = scope.permitSelectedData[0].id;
            scope.tmpPermitDetails.rowIndex = rowItem.rowIndex;
            scope.permitAddButon = "Update";
        };

        scope.permitSelectedData = [];
        scope.permitGridOptions = {
            data: 'vehicle.permitDetails',
            columnDefs: [{
                field: 'permitNumber',
                displayName: 'Permit Number'
            }, {
                field: 'permitType',
                displayName: 'Type',
                visible: false
            }, {
                field: 'issueDate',
                displayName: 'Issue Date'
            }, {
                field: 'expiryDate',
                displayName: 'Expiry Date'
            }, {
                field: 'attachment',
                displayName: 'Attachment',
                visible: false
            }, {
                field: 'permitId',
                displayName: 'PermitId',
                visible: false
            }],
            keepLastSelected: false,
            selectedItems: scope.permitSelectedData,
            multiSelect: false,
            afterSelectionChange: scope.fnPermitRowSelected
        };
        scope.fnAddPermitToList = function() {
            if (!scope.tmpPermitDetails.issueDate || !scope.tmpPermitDetails.permitNumber || !scope.tmpPermitDetails.expiryDate) {
                alert('Please add all the permit details.');
                return;
            }

            // console.log(">>>>>",scope.tmpPermitDetails.rowIndex);
            if (parseInt(scope.tmpPermitDetails.rowIndex) >= 0) {
                scope.vehicle.permitDetails[scope.tmpPermitDetails.rowIndex].issueDate = scope.tmpPermitDetails.issueDate;
                scope.vehicle.permitDetails[scope.tmpPermitDetails.rowIndex].expiryDate = scope.tmpPermitDetails.expiryDate;
                scope.vehicle.permitDetails[scope.tmpPermitDetails.rowIndex].permitType = scope.tmpPermitDetails.permitType;
                scope.vehicle.permitDetails[scope.tmpPermitDetails.rowIndex].permitNumber = scope.tmpPermitDetails.permitNumber;
            } else {
                scope.vehicle.permitDetails.push({
                    permitType: scope.tmpPermitDetails.permitType,
                    permitNumber: scope.tmpPermitDetails.permitNumber,
                    issueDate: scope.tmpPermitDetails.issueDate,
                    expiryDate: scope.tmpPermitDetails.expiryDate,
                    attachments: []
                });
            }

            scope.tmpPermitDetails = {
                permitNumber: '',
                permitType: '1',
                name: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                provider: '',
                amount: ''
            };
            scope.tmpPermitDetails.rowIndex = "";
        }
        /**
         EOF: Permit details grid end
        **/


        /**
        RoadTax details grid..
        **/
        scope.roadTaxAddButon = "Add to List";
        scope.fnClearVehicleRoadTaxFields = function() {

            scope.tmpRoadTaxDetails = {
                roadTaxNumber: '',
                premiumType: '1',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                premiumAmount: ''
            };

            scope.tmpRoadTaxDetails.rowIndex = "";
            scope.roadTaxAddButon = "Add to List";
        };
        scope.fnRoadTaxRowSelected = function(rowItem) {
            // console.log(rowItem.rowIndex, scope.roadTaxSelectedData);
            if (!scope.roadTaxSelectedData.length) {
                scope.fnClearVehicleRoadTaxFields();
                return;
            }
            scope.tmpRoadTaxDetails.roadTaxNumber = scope.roadTaxSelectedData[0].roadTaxNumber;
            scope.tmpRoadTaxDetails.premiumType = scope.roadTaxSelectedData[0].premiumType;
            scope.tmpRoadTaxDetails.issueDate = scope.roadTaxSelectedData[0].issueDate;
            scope.tmpRoadTaxDetails.expiryDate = scope.roadTaxSelectedData[0].expiryDate;
            scope.tmpRoadTaxDetails.premiumAmount = scope.roadTaxSelectedData[0].premiumAmount;
            scope.tmpRoadTaxDetails.roadTaxId = scope.roadTaxSelectedData[0].roadTaxId;
            scope.tmpRoadTaxDetails.rowIndex = rowItem.rowIndex;
            scope.roadTaxAddButon = "Update";
        };

        scope.roadTaxSelectedData = [];
        scope.roadTaxGridOptions = {
            data: 'vehicle.roadTaxDetails',
            columnDefs: [{
                field: 'roadTaxNumber',
                displayName: 'RoadTax Number'
            }, {
                field: 'premiumType',
                displayName: 'Type',
                visible: false
            }, {
                field: 'issueDate',
                displayName: 'Issue Date'
            }, {
                field: 'expiryDate',
                displayName: 'Expiry Date'
            }, {
                field: 'premiumAmount',
                displayName: 'Amount'
            }, {
                field: 'attachment',
                displayName: 'Attachment',
                visible: false
            }, {
                field: 'roadTaxId',
                displayName: 'RoadTaxId',
                visible: false
            }],
            keepLastSelected: false,
            selectedItems: scope.roadTaxSelectedData,
            multiSelect: false,
            afterSelectionChange: scope.fnRoadTaxRowSelected
        };
        scope.fnAddRoadTaxToList = function() {
            if (!scope.tmpRoadTaxDetails.issueDate || !scope.tmpRoadTaxDetails.expiryDate || !scope.tmpRoadTaxDetails.premiumAmount) {
                alert('Please add all the road Tax details.');
                return;
            }

            // console.log(">>>>>",scope.tmpRoadTaxDetails.rowIndex);
            if (parseInt(scope.tmpRoadTaxDetails.rowIndex) >= 0) {
                scope.vehicle.roadTaxDetails[scope.tmpRoadTaxDetails.rowIndex].issueDate = scope.tmpRoadTaxDetails.issueDate;
                scope.vehicle.roadTaxDetails[scope.tmpRoadTaxDetails.rowIndex].expiryDate = scope.tmpRoadTaxDetails.expiryDate;
                scope.vehicle.roadTaxDetails[scope.tmpRoadTaxDetails.rowIndex].premiumAmount = scope.tmpRoadTaxDetails.premiumAmount;
                scope.vehicle.roadTaxDetails[scope.tmpRoadTaxDetails.rowIndex].premiumType = scope.tmpRoadTaxDetails.premiumType;
                scope.vehicle.roadTaxDetails[scope.tmpRoadTaxDetails.rowIndex].roadTaxNumber = scope.tmpRoadTaxDetails.roadTaxNumber;
            } else {
                scope.vehicle.roadTaxDetails.push({
                    premiumType: scope.tmpRoadTaxDetails.premiumType,
                    roadTaxNumber: scope.tmpRoadTaxDetails.roadTaxNumber,
                    issueDate: scope.tmpRoadTaxDetails.issueDate,
                    expiryDate: scope.tmpRoadTaxDetails.expiryDate,
                    premiumAmount: scope.tmpRoadTaxDetails.premiumAmount,
                    attachments: []
                });
            }

            scope.tmpRoadTaxDetails = {
                roadTaxNumber: '',
                premiumType: '1',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                premiumAmount: ''
            };
            scope.tmpRoadTaxDetails.rowIndex = "";
        }
        /**
        RoadTax details grid end
        **/


        /**
        Rc details grid start
        **/
        scope.rcAddButon = "Add to List";
        scope.fnClearVehicleRcFields = function() {

            scope.tmpRcDetails = {
                rcNumber: '',
                issueDate: currentDate,
                expiryDate: nextYearDate
            };

            scope.tmpRcDetails.rowIndex = "";
            scope.rcAddButon = "Add to List";
        };
        scope.fnRcRowSelected = function(rowItem) {
            // console.log(rowItem.rowIndex, scope.rcSelectedData);
            if (!scope.rcSelectedData.length) {
                scope.fnClearVehicleRcFields();
                return;
            }
            console.log(scope.rcSelectedData[0]);
            scope.tmpRcDetails.rcNumber = scope.rcSelectedData[0].rcNumber;
            scope.tmpRcDetails.issueDate = scope.rcSelectedData[0].issueDate;
            scope.tmpRcDetails.expiryDate = scope.rcSelectedData[0].expiryDate;
            scope.tmpRcDetails.rcId = scope.rcSelectedData[0].rcId;
            scope.tmpRcDetails.rowIndex = rowItem.rowIndex;
            scope.rcAddButon = "Update";
        };

        scope.rcSelectedData = [];
        scope.rcGridOptions = {
            data: 'vehicle.rcDetails',
            columnDefs: [{
                field: 'rcNumber',
                displayName: 'Rc Number'
            }, {
                field: 'issueDate',
                displayName: 'Issue Date'
            }, {
                field: 'expiryDate',
                displayName: 'Expiry Date'
            }, {
                field: 'attachment',
                displayName: 'Attachment',
                visible: false
            }, {
                field: 'rcId',
                displayName: 'RcId',
                visible: false
            }],
            keepLastSelected: false,
            selectedItems: scope.rcSelectedData,
            multiSelect: false,
            afterSelectionChange: scope.fnRcRowSelected
        };
        scope.fnAddRcToList = function() {
            if (!scope.tmpRcDetails.issueDate || !scope.tmpRcDetails.rcNumber || !scope.tmpRcDetails.expiryDate) {
                alert('Please add all the rc details.');
                return;
            }

            // console.log(">>>>>",scope.tmpRcDetails.rowIndex);
            if (parseInt(scope.tmpRcDetails.rowIndex) >= 0) {
                scope.vehicle.rcDetails[scope.tmpRcDetails.rowIndex].issueDate = scope.tmpRcDetails.issueDate;
                scope.vehicle.rcDetails[scope.tmpRcDetails.rowIndex].expiryDate = scope.tmpRcDetails.expiryDate;
                scope.vehicle.rcDetails[scope.tmpRcDetails.rowIndex].rcNumber = scope.tmpRcDetails.rcNumber;
            } else {
                scope.vehicle.rcDetails.push({
                    rcNumber: scope.tmpRcDetails.rcNumber,
                    issueDate: scope.tmpRcDetails.issueDate,
                    expiryDate: scope.tmpRcDetails.expiryDate,
                    attachments: []
                });
            }

            scope.tmpRcDetails = {
                rcNumber: '',
                name: '',
                issueDate: currentDate,
                expiryDate: nextYearDate,
                provider: '',
                amount: ''
            };
            scope.tmpRcDetails.rowIndex = "";
        }
        /**
         EOF: Rc details grid end
        **/

        /**
        DentAndScratch details grid start
        **/
        scope.dentAndScratchAddButon = "Add to List";
        scope.fnClearVehicleDentAndScratchFields = function() {

            scope.tmpDentAndScratchDetails = {
                type: '1',
                severity: '1'
            };

            scope.tmpDentAndScratchDetails.rowIndex = "";
            scope.dentAndScratchAddButon = "Add to List";
        };
        scope.fnDentAndScratchRowSelected = function(rowItem) {
            // console.log('test');
            // console.log(rowItem.rowIndex, scope.dentAndScratchSelectedData);
            if (!scope.dentAndScratchSelectedData.length) {
                scope.fnClearVehicleDentAndScratchFields();
                return;
            }
            // console.log(scope.dentAndScratchSelectedData[0]);
            scope.tmpDentAndScratchDetails.type = scope.dentAndScratchSelectedData[0].type;
            scope.tmpDentAndScratchDetails.severity = scope.dentAndScratchSelectedData[0].severity;
            scope.tmpDentAndScratchDetails.rowIndex = rowItem.rowIndex;
            scope.dentAndScratchAddButon = "Update";
        };

        scope.dentAndScratchSelectedData = [];
        scope.dentsAndScratchesGridOptions = {
            data: 'vehicle.vehicleCondition.exterior.dentAndScratch',
            columnDefs: [{
                field: 'type',
                displayName: 'Type',
                visible: false
            }, {
                field: 'severity',
                displayName: 'Severity',
                visible: false
            }, {
                field: 'typeName',
                displayName: 'Type'
            }, {
                field: 'severityName',
                displayName: 'Severity'
            }],
            keepLastSelected: false,
            selectedItems: scope.dentAndScratchSelectedData,
            multiSelect: false,
            afterSelectionChange: scope.fnDentAndScratchRowSelected
        };
        scope.fnAddDentAndScratchToList = function() {

            // console.log(">>>>>",scope.tmpDentAndScratchDetails.rowIndex);
            if (parseInt(scope.tmpDentAndScratchDetails.rowIndex) >= 0) {
                scope.vehicle.vehicleCondition.exterior.dentAndScratch[scope.tmpDentAndScratchDetails.rowIndex].type = scope.tmpDentAndScratchDetails.type;
                scope.vehicle.vehicleCondition.exterior.dentAndScratch[scope.tmpDentAndScratchDetails.rowIndex].severity = scope.tmpDentAndScratchDetails.severity;
                scope.vehicle.vehicleCondition.exterior.dentAndScratch[scope.tmpDentAndScratchDetails.rowIndex].typeName = scope.dentsAndScraches[scope.tmpDentAndScratchDetails.type - 1].title;
                scope.vehicle.vehicleCondition.exterior.dentAndScratch[scope.tmpDentAndScratchDetails.rowIndex].severityName = scope.dentAndScratchSeverityType[scope.tmpDentAndScratchDetails.severity - 1].title;
            } else {
                scope.vehicle.vehicleCondition.exterior.dentAndScratch.push({
                    type: scope.tmpDentAndScratchDetails.type,
                    severity: scope.tmpDentAndScratchDetails.severity,
                    typeName: scope.dentsAndScraches[scope.tmpDentAndScratchDetails.type - 1].title,
                    severityName: scope.dentAndScratchSeverityType[scope.tmpDentAndScratchDetails.severity - 1].title,
                    attachments: []
                });
            }

            scope.tmpDentAndScratchDetails = {
                type: '1',
                severity: '1'
            };
            scope.tmpDentAndScratchDetails.rowIndex = "";
        }
        /**
         EOF: DentAndScratch details grid end
        **/

        /*
        vehicle condition Exterior
        */
        scope.dentsAndScraches = PrerequisiteService.dentAndScratchType;
        scope.dentAndScratchSeverityType = PrerequisiteService.dentAndScratchSeverityType;

        /*
        EOF :: vehicle condition Exterior
        */


    });
