<?php


//returns the response time in ms
$executionStartTime = microtime(true) / 1000;


//fetches API url and concatenates the required lat and lng parameters as well as the api key generated
$api_url = 'https://api.opencagedata.com/geocode/v1/json?q=' . $_REQUEST['lat'] . '%2C' . $_REQUEST['lng'] . '&key=5a9d7e3d7919422a8fd6837de083df0b&language=en&pretty=1';

//initialise curl object
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $api_url);

$result = curl_exec($ch);

curl_close($ch);
  
$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "location retrieved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $decode['results'];
	
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>