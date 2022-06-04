<?php

  //Storing the isoCode in the super global REQUEST variable in order to initiate the ajax call
  $isoCode = $_REQUEST['isoCode'];


  //reading file contents and storing data in a variable
  $getFileContents = file_get_contents('../json/countryBorders.geo.json');

  //storing the converted json contents in the countryBorders variable
  $countryBorders = json_decode($getFileContents, true);

  //storing the countryBorder features property in a variable to loop through
  $features = $countryBorders['features'];


  //looping through each element in the array to match a given iso code to a specific country
  foreach ($features as $feature) {
    $countryCode = $feature['properties']['iso_a2'];
    if ($isoCode === $countryCode) {
      $countryGeoJson = $feature;

      //displaying the correct coordinates for each border
      $output = json_encode($countryGeoJson);
      echo $output;
    }
  }

?>