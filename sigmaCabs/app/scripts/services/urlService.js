/*
Name: URLService
Description: Sends URLs for fixtures, services, views and pages...
Date: 13Nov2013
Author: Mario::216mario216@gmail.com
*/

'use strict';

angular.module('sigmaCabsApp')
  .factory('URLService', function() {

    var bIsFixture = false, // if true, REST API is taken from static JSON files from fixtures folder.

      // urls for the REST APIs
      _oUrls = {
        'login': '',
        'register': 'service/accessrequest/create',
        'session': '', //'service/user/login',
        'logout': 'j_spring_security_logout',
        'changePassword': 'service/dbridgeUser/changePassword',

        'getUserTypes' : "?url=usertype/index",

        'addUser' : "", //?url=user/save",
        'updateUser' : "?url=user/modify",
        'getUserDetails' : "",
        'userDelete' : "",

        'RestApiGetAllJourneyTypes' : '?url=journey/all',        
        // 'RestApiGetAllJourneyTypes' : '?url=config/getAllJourneyTypes',

        'RestApiGetAllBookingStates' : '?url=config/getAllBookingStatus',
        'RestApiGetAllGrades' : '?url=config/getAllGrades',
        'RestApiGetAllReasons' : '?url=reason/all',
        'RestApiGetAllTariff': '?url=config/getTariffInfo',
        'RestApiGetVehicleNames' : '?url=config/getAllVehicleNames',
		'RestApiGetTravelType' : '?url=traveltype/all',
        'RestApiCancelBooking' : '',
        'RestApiSaveCustomerDetails' : '',
        'RestApiBlockCustomer' : '',
        'RestApiRegularRequest' : '',
        'RestApiSaveCorporateRequest' : '',
        'RestApiSaveSpecialRequest' : '',
        'RestApiGetLatestBookings' : '',
		'RestApiVehicleLogin' : '',
        'RestApiVehicleChangePhone' : '',
        'RestApiVehicleChangeStatus' : '',
        'RestApiVehicleChangeLocation' : '',
        'RestApiVehicleBreakStart' : '',
        'RestApiVehicleBreakStop' : '',
        'RestApiVehicleLogout' : '',
        'RestApiVehicleConfirm' : '',
        'RestApiVehicleBookingStart' : '',
        'RestApiVehicleBookingClose' : '',
        'RestApiVehicleBookingComplaint' : '',
        'RestApiSaveBooking' : '',
        'RestApiSearchByVehicleMobile' : '',
        'RestApiGetStatistics':'?url=vehicle/getAvailableStatistics',        
        'RestApiGetAvailableVehicles':'',        
        'RestGetTariffById': '',
        'RestGetAllVehicleTypes' : '?url=config/getAllVehicleTypes',


        'addVehicle' :  "", //"?url=vehicle/save",
        'updateVehicle' : "", // ?url=vechile/modify"
        'getAllVehicles' : "?url=vehicle/index",
        'getAvailableVehicles' : "?url=vehicle/available",
        'getVehicleDetails' : "",
        'getAllAvailVehicles' : "",
        'getAllAvailBookings':"?url=booking/openbookings",
        'dispatchVehicle': "/vehicledriverbooking/assign",
        'customerList' : '?url=user/index',
        'sendVehicleActivity':'vehicle/activity',
        'searchCustomerByMobile' : '',
		'dispathData': '',
        'bookingTariffs' : ''
      },

      // to be served when bIsFixture is true..
      ofixtures = {
        'login': 'fixtures/login.json',
        'session': 'fixtures/session.json',

        'canceledBooking': 'fixtures/canceledBookingList.json',
        'customerList': 'fixtures/customerList.json',
        'pastBooking': 'fixtures/pastBookingList.json'
      },

      // actual html pages to serve.
      _oPages = {
        'logout': 'index.html',
        'dashboard': 'dashboard.html'
      },

      // html fragments to be served as html snippets
      _oPartials = {
        'loadingText' : 'views/loadingText.html',
        'errorResponseFormatMisMatch' : 'views/errorResponseFormatMisMatch.html',

        'usersList' : 'views/users/usersList.html',
        'vehicleList' : 'views/vehicles/vehicleList.html',
        // 'customerBookingTabs': 'views/bookings/customerBookingTabs.html',
        'existingCustomerAddBooking': 'views/bookings/existingCustomerAddBooking.html',
        'bookingForm': 'views/bookings/bookingForm.html',
        'personalForm': 'views/bookings/personalForm.html',
        'bookingHistory': 'views/bookings/bookingHistory.html',
        'bookingTariffGrid': 'views/bookings/bookingTariffGrid.html',
        'extraInfoDetails': 'views/bookings/extraInfoDetails.html',

        'bookingSnapshotPackageDuration' : 'views/bookings/bookingSnapshotPackageDurationDetails.html',
        'bookingSnapshotTarrifDetails' : 'views/bookings/bookingSnapshotTarrifDetails.html',
        'bookingSnapshotRouteMapDetails' : 'views/bookings/bookingSnapshotRouteMapDetails.html',

        'userPersonalDetailsTab' : "views/users/personalDetailsTab",
        'professionalDetailsTab' : "views/users/professionalDetailsTab",
        'driverDetailsTab' : "views/users/driverDetailsTab",

        'userEducationalDetailsSubTab' : "views/users/educationalDetailsTab.html",
        'userPastExperienceDetailsTab' : "views/users/pastExperienceDetailsTab.html",

        'vehicleBasicDetails': 'views/vehicles/basicDetailsTab',
        'vehicleExteriorCondtionTab' : 'views/vehicles/vehicleExteriorCondtionTab',
        'vehicleSupportDetailsTab' : 'views/vehicles/vehicleSupportDetailsTab',
        'vehicleInteriorCondtionTab' : 'views/vehicles/vehicleInteriorCondtionTab',        
        'vehiclePerformanceTab' : 'views/vehicles/vehiclePerformanceTab',
        'vehicleFacilitiesTab' : 'views/vehicles/vehicleFacilitiesTab',

        'vehicleSupportInsuranceDetailsSubTab' : 'views/vehicles/insuranceDetailsTab.html',
        'vehicleSupportPermitDetailsSubTab' : 'views/vehicles/permitDetailsTab.html',
        'vehicleSupportRoadTaxDetailsSubTab' : 'views/vehicles/roadTaxDetailsTab.html',
        'vehicleSupportRcDetailsSubTab' : 'views/vehicles/rcDetailsTab.html',

        'vehicleExterirorDentAndScratchesDetailsSubTab' : 'views/vehicles/dentAndScratchesTab.html',
        'vehicleExterirorTyresDetailsSubTab' : 'views/vehicles/tyresDetailsTab.html',
        'vehicleExterirorLightsDetailsSubTab' : 'views/vehicles/lightsDetailsTab.html',
        'vehicleExterirorWindSheildDetailsSubTab' : 'views/vehicles/windShieldDetailsTab.html',
        'vehicleExterirorCommentsDetailsSubTab' : 'views/vehicles/exteriorCommentsTab.html',


        'vehiclePerformanceBatteryAndElectricalsSubTab' : 'views/vehicles/batteryAndElectricalsTab.html',
        'vehiclePerformanceClutchAndBreaksSubTab' : 'views/vehicles/clutchAndBreaksTab.html',
        'vehiclePerformanceAlignmentAndSuspensionsSubTab' : 'views/vehicles/alignmentAndSuspensionTab.html',
        'vehiclePerformanceCoolersAndAirFiltersSubTab' : 'views/vehicles/coolersAndAirFiltersTab.html',
        'vehiclePerformanceEngineAndPowerSteeringOilSubTab' : 'views/vehicles/engineAndPowerSteeingOilTab.html',
        'vehiclePerformanceGearAndBreakOilSubTab' : 'views/vehicles/gearAndBreakOilTab.html',

        'vehicleFacilitiesEntertainmentSubTab' : 'views/vehicles/entertainmentTab.html',
        'vehicleFacilitiesAdvertismentSubTab' : 'views/vehicles/advertismentTab.html',
        'vehicleLogin' : 'views/dispatches/vehicleLogin.html',
        'breakDetails': 'views/dispatches/breakDetails.html',
        'reportDetails' : 'views/dispatches/reportDetails.html',


        'chatForm' : 'views/chat/chatForm.html',

        'vehicleAvailabilityCheck' : 'views/bookings/checkVehicleAvilabilty.html',
        'cancelBookingMain' : 'views/bookings/cancelBookingMain.html',
        'dispositionForm' : 'views/bookings/dispositionForm.html',
        'blockCustomerMain' : 'views/bookings/blockCustomerMain.html',
        'customerRequestMain' : 'views/bookings/customerRequestMain.html',
        'bookingTariffTable' : 'views/bookings/bookingTariffTable.html',
        'checkTariff':'views/bookings/checkTariff.html',
        'singleTariff':'views/bookings/singleTariff.html',
        'bookingStatistics' : 'views/bookings/statistics/bookingStatistics.html',
        'dispatcherMainView' : 'views/dispatches/dispatcherMainView.html',
        'vehicleInformationForm': 'views/dispatches/vehicleInformationForm.html',
        'vehicleLoginForm': 'views/dispatches/vehicleLoginForm.html',
        'vehicleVacantForm': 'views/dispatches/vehicleVacantForm.html',
        'vehicleAllotForm': 'views/dispatches/vehicleAllotForm.html',
        'currentMonthData': 'views/dispatches/currentMonthData.html',
        'lastMonthHistory': 'views/dispatches/lastMonthHistory.html',
        //'vehicleData': 'views/dispatches/vehicleData.html',
        'vehiclePerformance': 'views/dispatches/vehiclePerformance.html',
        'dispatchFeedback': 'views/dispatches/dispatchFeedback.html',
        'dispatchAddRequest': 'views/dispatches/dispatchAddRequest.html',
        'changeVehiclePhone': 'views/dispatches/changeVehiclePhone.html',
        'changeVehicleLocation': 'views/dispatches/changeVehicleLocation.html',
        'changeVehicleStatus': 'views/dispatches/changeVehicleStatus.html',
        'vehicleBreakStart': 'views/dispatches/vehicleBreakStart.html',
        'vehicleBreakStop': 'views/dispatches/vehicleBreakStop.html',
        'vehicleBookingStart': 'views/dispatches/vehicleBookingStart.html',
        'vehicleBookingClose': 'views/dispatches/vehicleBookingClose.html',
        'vehicleBookingComplaint': 'views/dispatches/vehicleBookingComplaint.html',
        'vehicleLogout': 'views/dispatches/vehicleLogout.html'
      },


      // actual IP/ServerDomainName where REST API resides..
      // _serviceRoot = 'proxy.php';
        _serviceRoot = 'http://localhost/proxy.php';  // for localhost 
      // _serviceRoot = 'http://10.0.1.192/proxy.php';  // for localhost 
      // _serviceRoot = 'proxy.php';   // for hosting

    return {
      service: function(serviceName) {
        return bIsFixture ? 'scripts/' + ofixtures[serviceName] : _serviceRoot + _oUrls[serviceName];
      },
      view: function(viewName) {
        return _oPartials[viewName];
      },
      page: function(pageName) {
        return _oPages[pageName];
      }
    };
  });