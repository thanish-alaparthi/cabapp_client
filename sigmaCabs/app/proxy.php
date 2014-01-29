<?php	
// Define IP to where it has to communicate
$ip = 'http://www.oxylator3is.com/sigma/public/index.php';
// $ip = 'http://localhost/ownmvc/public/index.php';

// Input data to request
$url = $_REQUEST['url'];
$data = $_REQUEST['data'];

function getCURLresponseWithPostParams($ip, $url='usertype/index'/*default controller & action*/, $data=null)
{
	$params = 'url='.$url.'&data='.$data;
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $ip);
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $params);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION,0);
	curl_setopt($ch, CURLOPT_HEADER, 0);  
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	$result = curl_exec($ch);
	curl_close($ch);
	return $result;
}

echo getCURLresponseWithPostParams($ip, $url, $data);

?>