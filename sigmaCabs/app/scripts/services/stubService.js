angular.module('sigmaCabsApp')
.factory('stubService', function(){
	var baseUrl = "";
	var stubService = function(data){
		angular.extend(this, data);
	}
	/*START: Stub data*/
	var controlViewController_bookingData = [
    {'bookingId':'1','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1001"},
    {'bookingId':'2','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Mehdipatnam', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1002"},
    {'bookingId':'3','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1003"},
    {'bookingId':'4','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Mehdipatnam', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1004"},
    {'bookingId':'6','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1005"},
    {'bookingId':'7','bookingCode':'BID1','vehicleName':'Vista','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1006"},
    {'bookingId':'8','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1007"},
    {'bookingId':'9','bookingCode':'BID1','vehicleName':'Vista','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1008"},
    {'bookingId':'10','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1009"},
    {'bookingId':'11','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1010"},
    {'bookingId':'12','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1011"},
    {'bookingId':'13','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'KPHB', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1012"},
    {'bookingId':'14','bookingCode':'BID1','vehicleName':'Innova','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1013"},
    {'bookingId':'15','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Small','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1014"},
    {'bookingId':'16','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1015"},
    {'bookingId':'14','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1016"},
    {'bookingId':'15','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1017"},
    {'bookingId':'16','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1018"},
    {'bookingId':'17','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1019"},
    {'bookingId':'18','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1020"},
    {'bookingId':'19','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1021"},
    {'bookingId':'20','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1022"},
    {'bookingId':'21','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1023"},
    {'bookingId':'22','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1024"},
    {'bookingId':'23','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1025"},
    {'bookingId':'24','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1026"},
    {'bookingId':'25','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "10127"},
    {'bookingId':'26','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1028"},
    {'bookingId':'27','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1029"},
    {'bookingId':'28','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1030"},
    {'bookingId':'29','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'JNTU', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1031"},
    {'bookingId':'31','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1032"},
    {'bookingId':'32','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1033"},
    {'bookingId':'33','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1034"},
    {'bookingId':'34','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Lakdikapool', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1035"},
    {'bookingId':'35','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1036"},
    {'bookingId':'36','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1037"},
    {'bookingId':'37','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Miyapur', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1038"},
    {'bookingId':'38','bookingCode':'BID1','vehicleName':'Indica','vehicleType':'Big','pickupTime':'10:00 PM','pickupPlace':'Secunderabad', 'journeyType':'City','subJourneyType':'1 Hr 20 KMS', 'bookingOrigin':'WEBAPP', 'bookingStatus':'Not Alloted', 'vehicleCode': "1039"}
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
    {'vehicleCode':'VID1','vehicleName':'Indica','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID2','vehicleName':'Innova','loginTime':'10:00 AM', 'location': 'Rethibowli', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID3','vehicleName':'Verito','loginTime':'09:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID4','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Secunderabad', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID5','vehicleName':'Verito','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID6','vehicleName':'Innova','loginTime':'10:00 PM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID8','vehicleName':'Innova','loginTime':'12:00 PM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID9','vehicleName':'Verito','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID10','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID11','vehicleName':'Verito','loginTime':'16:00 PM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID12','vehicleName':'Indica','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID13','vehicleName':'Verito','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID14','vehicleName':'Tavera','loginTime':'18:00 PM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID15','vehicleName':'Indica','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID16','vehicleName':'Innova','loginTime':'12:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID17','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID18','vehicleName':'Innova','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID19','vehicleName':'Indica','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID20','vehicleName':'Xylo','loginTime':'10:00 AM', 'location': 'Mehdipatnam', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'},
    {'vehicleCode':'VID7','vehicleName':'Vista','loginTime':'10:00 AM', 'location': 'Miyapur', 'inBreak': 'No', 'dayCollection': 'Rs. 2000'}
  ];

  var controlViewController_whileDrivingData = [
    {'bookingId':'BID1','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID2','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID3','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID4','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID5','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID6','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID7','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID8','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID9','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID10','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID11','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID12','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID13','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID14','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID15','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID16','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID17','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID18','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID19','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID20','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID21','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'},
    {'bookingId':'BID22','vehicleCode':'VID1','vehicle':'Indica','pickupTime':'10:00 PM','pickupPlace':'Rethibowli', 'subJourneyType':'1 Hr 20 KMS', 'expectVacntTime':'1 Hr', 'dayCollection':'Rs. 2000', 'nxtBookng':'Yes'}         
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