<?php

  // Read the JSON file contents and store in a variable
  $getFileContents = file_get_contents('../json/countryBorders.geo.json');

  //parse contents into json_decode to transform the json string into a php object and store result into a variable
  $convertToPHPObj = json_decode($getFileContents, true);

  //store the features of the php array in a variable
  $features = $convertToPHPObj['features'];

  //initialise two empty arrays of countries and there iso codes
  $iso2Array = array();
  $countryNamesArray = array();


  //implement a country class for the arrays to store countries and iso codes
  class countryClass {
    public $names;
    public $iso2;
  }

  //instantiate a new class object and store the result in a variable
  $listCountries = new countryClass;

  //loop for each feature property in the array
  foreach ($features as $feature) {
    $iso2 = $feature['properties']['iso_a2'];
    $name = $feature['properties']['name'];
    //push the values into the empty arrays
    array_push($iso2Array, $iso2);
    array_push($countryNamesArray, $name);
  }
 

  // pushing the values of each array into the newCountryClass variables
  $listCountries->names = $countryNamesArray;
  $listCountries->iso2 = $iso2Array;

  //display the return values back in JSON format using json encode
  echo json_encode($listCountries);

?>