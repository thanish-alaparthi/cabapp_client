angular.module('sigmaCabsApp')
.factory('stubService', function(){
	var baseUrl = "";
	var stubService = function(data){
		angular.extend(this, data);
	}
	/*START: Stub data*/
	var controlViewController_bookingData = [
    {'bookingId':'1','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1001"},
    {'bookingId':'2','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Mehdipatnam', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1002"},
    {'bookingId':'3','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1003"},
    {'bookingId':'4','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Mehdipatnam', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1004"},
    {'bookingId':'6','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1005"},
    {'bookingId':'7','bookingCode':'BID1','vehicleName':'Vista','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1006"},
    {'bookingId':'8','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1007"},
    {'bookingId':'9','bookingCode':'BID1','vehicleName':'Vista','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1008"},
    {'bookingId':'10','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1009"},
    {'bookingId':'11','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1010"},
    {'bookingId':'12','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1011"},
    {'bookingId':'13','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'KPHB', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1012"},
    {'bookingId':'14','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1013"},
    {'bookingId':'15','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1014"},
    {'bookingId':'16','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1015"},
    {'bookingId':'14','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1016"},
    {'bookingId':'15','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1017"},
    {'bookingId':'16','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1018"},
    {'bookingId':'17','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1019"},
    {'bookingId':'18','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1020"},
    {'bookingId':'19','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1021"},
    {'bookingId':'20','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1022"},
    {'bookingId':'21','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1023"},
    {'bookingId':'22','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1024"},
    {'bookingId':'23','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1025"},
    {'bookingId':'24','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1026"},
    {'bookingId':'25','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "10127"},
    {'bookingId':'26','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1028"},
    {'bookingId':'27','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1029"},
    {'bookingId':'28','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1030"},
    {'bookingId':'29','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1031"},
    {'bookingId':'31','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1032"},
    {'bookingId':'32','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1033"},
    {'bookingId':'33','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1034"},
    {'bookingId':'34','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1035"},
    {'bookingId':'35','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1036"},
    {'bookingId':'36','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1037"},
    {'bookingId':'37','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1038"},
    {'bookingId':'38','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'status':'Not Alloted', 'vehicleCode': "1039"}
  ];

  var controlViewController_vehiclesForBookingData = [
    {'vehicleName':'Innova','vehicleCode':'1001','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1002','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1003','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1004','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1005','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1006','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1007','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1008','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1009','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1010','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1011','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1012','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1013','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1014','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1015','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1016','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'},
    {'vehicleName':'Innova','vehicleCode':'1017','mobileNumber':'9709709709','attachmentType':'Mehdipatnam','location':'Mehdipatnam'}
  ];

  var controlViewController_vacantVehiclesData = [
    {'vehicleCode':'VID1','vName':'Indica','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID2','vName':'Innova','lgnHrs':'10:00 AM', 'currLoc': 'Rethibowli', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID3','vName':'Verito','lgnHrs':'09:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID4','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Secunderabad', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID5','vName':'Verito','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID6','vName':'Innova','lgnHrs':'10:00 PM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID8','vName':'Innova','lgnHrs':'12:00 PM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID9','vName':'Verito','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID10','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID11','vName':'Verito','lgnHrs':'16:00 PM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID12','vName':'Indica','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID13','vName':'Verito','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID14','vName':'Tavera','lgnHrs':'18:00 PM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID15','vName':'Indica','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID16','vName':'Innova','lgnHrs':'12:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID17','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID18','vName':'Innova','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID19','vName':'Indica','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID20','vName':'Xylo','lgnHrs':'10:00 AM', 'currLoc': 'Mehdipatnam', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vName':'Vista','lgnHrs':'10:00 AM', 'currLoc': 'Miyapur', 'isBreak': 'No', 'collection': 'Rs. 2000'}
  ];

  var controlViewController_whileDrivingData = [
    {'bId':'BID1','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID2','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID3','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID4','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID5','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID6','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID7','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID8','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID9','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID10','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID11','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID12','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID13','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID14','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID15','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID16','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID17','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID18','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID19','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID20','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID21','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bId':'BID22','vehicleCode':'VID1','vehicle':'Indica','pTime':'10:00 PM','pPlace':'Rethibowli', 'sJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'collection':'Rs. 2000', 'nxtBookng':'Yes'}         
  ];

  /*END: Stub data*/
	var _stubHash = {
		'controlViewController_bookingData': controlViewController_bookingData,
		'controlViewController_vehiclesForBookingData': controlViewController_vehiclesForBookingData,
		'controlViewController_vacantVehiclesData': controlViewController_vacantVehiclesData,
		'controlViewController_whileDrivingData': controlViewController_whileDrivingData,
	}
	stubService.getStubData = function(configObj){
		var data = "",
				uri = configObj.controller +'_'+configObj.url;
		data = _stubHash[uri];		
		return data;
	}
	return stubService;
});