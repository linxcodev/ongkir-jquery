<?php

$curl = curl_init();

if ($_GET) {
  $url = $_GET['url'];
  $apiKey = $_GET['api'];

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => array(
      "key: $apiKey"
    ),
  ));
}

if ($_POST) {
  $url = $_POST['url'];
  $apiKey = $_POST['api'];
  $asal = $_POST['asal'];
  $tujuan = $_POST['tujuan'];
  $berat = $_POST['berat'];
  $kurir = $_POST['kurir'];

  curl_setopt_array($curl, array(
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POSTFIELDS => "origin=$asal&destination=$tujuan&weight=$berat&courier=$kurir",
    CURLOPT_HTTPHEADER => array(
      "content-type: application/x-www-form-urlencoded",
      "key: $apiKey"
    ),
  ));
}

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
