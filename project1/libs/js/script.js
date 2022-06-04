// -------------------------------- Preloader --------------------------------
$(window).on('load', () => {
    if ($('#preloader').length) {
        $('#preloader').delay(3000).fadeOut('slow', () => {
            $(this).remove();
        });
    }
});

// -------------------------------- Display Map --------------------------------

//Creating map overlay to display on page
const map = L.map('map').setView([38.685516, -101.073324], 13);

// adds tile layer to map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// -------------------------------- Global Variables & Marker Clusters --------------------------------

// Global object that will hold the country borders data
var country = {};
let currentBorder = null; // clears the current border

// Marker clusters initialisation

// marker cluster layer groups
var capitalGroup = L.layerGroup().addTo(map);
var cityGroup = L.layerGroup().addTo(map);
var universitiesGroup = L.layerGroup().addTo(map);
var airportGroup = L.layerGroup().addTo(map);
var webcamGroup = L.layerGroup().addTo(map);

// speicifies the radius in which the markers will begin to cluster
let capitalClusterRadius = 0.1; 
let universitiesClusterRadius = 51;
let airportClusterRadius = 51;
let cityClusterRadius = 51;
let webcamClusterRadius = 51;

// Cluster Groups

var capitalMarkerClusters = L.markerClusterGroup({
chunkedLoading: true,
maxClusterRadius: () => capitalClusterRadius,
});

var universitiesMarkerClusters = L.markerClusterGroup({
chunkedLoading: true,
maxClusterRadius: () => universitiesClusterRadius,
});

var citiesMarkerClusters = L.markerClusterGroup({
chunkedLoading: true,
maxClusterRadius: () => cityClusterRadius,
});

var airportsMarkerClusters = L.markerClusterGroup({
chunkedLoading: true,
maxClusterRadius: () => clusterRadius,
});

var webcamMarkerClusters = L.markerClusterGroup({
chunkedLoading: true,
maxClusterRadius: () => webcamClusterRadius,
});

// -------------------------------- Classes --------------------------------

// Modal classes

// Modal 1 Country Info Class:
class countryInfo {
constructor(area, capitalCity, continent, currencyCode, languages, population, exchangeRate) {
    this.area = area;
    this.capitalCity = capitalCity;
    this.continent = continent;
    this.currencyCode = currencyCode;
    this.languages = languages;
    this.population = population;
    this.exchangeRate = exchangeRate;
}
}

// Modal 2 Weather Info Class
class weatherInfo {
constructor(main, description, temp, pressure, humidity, hourNow, 
    hour1, hour2, hour3, hour4, hour5, tomorrowTemp, 
    dayAfterTomorrowTemp, tomorrowMain, dayAfterTomorrowMain, 
    name, iconToday, iconTomorrow, iconDayAfterTomorrow, 
    iconHourNow, iconHour1, iconHour2, iconHour3, iconHour4, iconHour5) {

    this.main = main;
    this.description = description;
    this.temp = temp;
    this.pressure = pressure;
    this.humidity = humidity;
    this.hourNow = hourNow;
    this.hour1 = hour1;
    this.hour2 = hour2;
    this.hour3 = hour3;
    this.hour4 = hour4;
    this.hour5 = hour5;
    this.tomorrowTemp = tomorrowTemp;
    this.dayAfterTomorrowTemp = dayAfterTomorrowTemp;
    this.tomorrowMain = tomorrowMain;
    this.dayAfterTomorrowMain = dayAfterTomorrowMain;
    this.name = name;
    this.iconToday = iconToday;
    this.iconTomorrow = iconTomorrow;
    this.iconDayAfterTomorrow = iconDayAfterTomorrow;
    this.iconHourNow = iconHourNow;
    this.iconHour1 = iconHour1;
    this.iconHour2 = iconHour2;
    this.iconHour3 = iconHour3;
    this.iconHour4 = iconHour4;
    this.iconHour5 = iconHour5;
}
}

// Modal 3 News Info Class
class newsInfo {
constructor(urlToImage, title,url , source,publishedAt,countryName) {

    this.urlToImage = urlToImage;
    this.title = title;
    this.url = url;
    this.source = source;
    this.publishedAt = publishedAt;
    this.countryName = countryName;
}
}

// Map Markers Class
class mapMarkers {
constructor(capital, cities, airports, universities, webcamID) {
    this.capital = capital;
    this.cities = cities;
    this.airports = airports;
    this.universities = universities;
    this.webcamID = webcamID;
}
}

// -------------------------------- Data Containers & Instances ------------------------------------------

//instantiate each class in order to use it's constructors variables
var countryData = new countryInfo();
var weatherdata = new weatherInfo();
var markers = new mapMarkers();

//news container array contains each news article
var newsDataContainer = [];

//containers to hold marker data
markers.capital = [];
markers.cities = [];
markers.universities = [];
markers.airports = [];
markers.webcamID = [];

// -------------------------------- Display Current Location & Welcome Alert --------------------------------

//ajax call to display user's current location using reverse geolocation as well as display markers
const openCageReverseGeolocation = (userLat, userLng) => {
$.ajax({
    url: 'libs/php/openCageReverseGeolocation.php',
    type: 'POST',
    datatype: 'json',
    data: {
        lat: userLat,
        lng: userLng
    },
    success: (result) => {
        const response = result['data'][0]['components']["ISO_3166-1_alpha-2"];
        $('#selCountry').val(response).change();

        setTimeout(() => {
                Swal.fire({
                    title: 'Welcome to Geolocation Gazetteer!',
                    html: `<br>Please select a country from the list and click any of the map icons on the top lefthand side of the map to get you started. <br><br>
    
            <i>We see that you are visiting us from <b>${$("#selCountry option:checked").text()}</b>. We've positioned the map at your current location...</i>`,
                    confirmButtonColor: 'black',
                    confirmButtonText: 'Click to continue',
                    background: '#D3D3D3',
                });

            }, 500);
    },
    error: (error) => {
        console.log(error); // display errors to the console
    }
});
}

// display current user location that calls the openGeolocation api
const displayUserLocation = () => {
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((getPosition) => {
            let getUserLat = getPosition.coords.latitude;
            let getUserLng = getPosition.coords.longitude;
            //call open cage api to retrieve our user location inputting the user's lat and lng values
            openCageReverseGeolocation(getUserLat, getUserLng);
        }, (error) => {
            console.warn(`ERROR(${error.code}): ${error.message}`);

        }, () => ({
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }));
} else {
    alert("Geolocation is not supported by your browser. Unable to retrieve location");
}
}

// display welcome message when location is available
const locationSuccess = (position) => {
currentlat = position.coords.latitude;
currentlng = position.coords.longitude;
displayUserLocation(currentlat, currentlng);
};

//error message if user location is not available
const locationError = () => {
Swal.fire({
    title: 'Welcome to Geolocation Gazetteer!',
    html: `<br>Please select a country from the list and click any of the map icons on the top lefthand side of the map to get you started. <br><br>
    <i>Unable to determine your current location. <br><br> Please enable location access`,
    confirmButtonColor: 'black',
    confirmButtonText: 'Continue',
    background: '#D3D3D3'
});
};

// //ajax call for populating the select tag
const populateSelectForm = () => {
$.ajax({
    url: 'libs/php/displayCountriesOnForm.php',
    type: 'POST',
    datatype: 'json',
    success: (result) => {
        const fillFormJson = JSON.parse(result);
        // displays countries alphabetically and keep their isocodes:
        const displayCountries = {};
        let fillFormIndex = 0;
        fillFormJson.names.forEach((name) => {
                displayCountries[name] = fillFormJson.iso2[fillFormIndex];
                fillFormIndex++;
            });
        const orderedCountries = {};
        Object.keys(displayCountries).sort().forEach((country) => {
                orderedCountries[country] = displayCountries[country];
            });

        //populate the select element using the ordered countries object
        Object.keys(orderedCountries).forEach((country) => {
                let isoCodeValue = '"' + orderedCountries[country] + '"';

                let selectOptionElement = '<option value=' + isoCodeValue + '>' + country + '</option>';

                $('#selCountry').append(selectOptionElement); // appends all the elements in the array to the select form
            });
        $('#selCountry > option[value="-99"').remove();

        // Called when user location is detected
        navigator.geolocation.getCurrentPosition(locationSuccess, locationError);
    },
    error: (error) => {
        console.log(error); // display errors on console
    }
});
};

// -------------------------------- Main Application Ajax Calls --------------------------------

//ajax call to display a countries borders
const displayBorders = (country) => {
$.ajax({
    url: 'libs/php/displayBorders.php',
    type: 'POST',
    datatype: 'json',
    data: { isoCode: country },
    success: (result) => {
        //condition prevents displaying multiple borders when selecting countries
        if (currentBorder) {
            currentBorder.remove();
        }
        //parse results obtained from array into JSON format
        let geoJsonFeature = JSON.parse(result);
        var borderStyle = { "color": "#025d3f", "weight": 4, "opacity": 0.5, "border": "solid" };
        const geoJsonLayer = L.geoJSON(geoJsonFeature, { style: borderStyle }).addTo(map);
        currentBorder = geoJsonLayer;
        map.fitBounds(geoJsonLayer.getBounds());
    },
    error: (error) => {
        console.log(error); //displays errors to the console
    }
});
};

//ajax call to find out lat and lng based on ISO code
const openCageLatLng = (isoCode) => $.ajax({
url: 'libs/php/openCageLatLng.php',
type: 'POST',
datatype: 'json',
async: false,
data: {
    isoCode: isoCode
}
})

// ajax call to display country information 
const getCountryInfo = (country) => {
return $.ajax({
    url: 'libs/php/getCountryInfo.php',
    type: 'POST',
    datatype: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {

        if (result.status.name == "ok") {

            // fetching api data from geonames
            countryData.area = result['data']['geonames'][0]['areaInSqKm'];
            countryData.capitalCity = result['data']['geonames']['0']['capital'];
            countryData.continent = result['data']['geonames']['0']['continentName'];
            countryData.currencyCode = result['data']['geonames']['0']['currencyCode'];
            countryData.languages = result['data']['geonames']['0']['languages'];
            countryData.population = result['data']['geonames']['0']['population'];
            countryData.name = result['data']['geonames']['0']['countryName'];

            // Populating country information:
            document.getElementById('staticBackdropLabelCountry').innerHTML = `Interesting facts about ${countryData.name}`;
            document.getElementById('countryInfoName').innerHTML = countryData.name;
            document.getElementById('countryInfoCapital').innerHTML = countryData.capitalCity;
            document.getElementById('countryInfoPopulation').innerHTML = `${(countryData.population / 1000000).toFixed(1)} Million`;
            document.getElementById('countryInfoArea').innerHTML = `${Math.floor(countryData.area)}`;
            document.getElementById('countryInfoLanguage').innerHTML = countryData.languages;
            document.getElementById('countryInfoCurrencyCode').innerHTML = countryData.currencyCode;
        }
   
    },
    error: (error) => {
     
        console.log(error);
    }
});
};

// ajax call to display weather information:
const getWeatherInfo = () => {

let isoCode = $("#selCountry option:checked").val();
if (!isoCode) {
    isoCode = "AF";
}
// get lat lng
$.when(openCageLatLng(isoCode)).done((ISOresponse) => {

        if (ISOresponse) {
            $.ajax({
                url: 'libs/php/getWeather.php',
                type: 'POST',
                datatype: 'json',
                data: {
                    cityName: countryData.capitalCity // retrieves the capital city weather information
                },
                success: (result) => {

                    if (result.status.name == "ok") {

                        // ---------------- Retrieving API data --------------------
                        // fetching main weather data from open weather
                        weatherdata.name = result['data']['city']['name'];
                        weatherdata.main = result['data']['list'][0]['weather'][0]['main'];
                        weatherdata.description = result['data']['list'][0]['weather'][0]['description'];
                        weatherdata.temp = Math.round(result['data']['list'][0]['main']['temp']);
                        weatherdata.pressure = result['data']['list'][0]['main']['pressure'];
                        weatherdata.humidity = result['data']['list'][0]['main']['humidity'];

                        // fetching hourly weather data
                        weatherdata.hourNow = Math.round(result['data']['list'][0]['main']['temp']);
                        weatherdata.hour1 = Math.round(result['data']['list'][1]['main']['temp']);
                        weatherdata.hour2 = Math.round(result['data']['list'][2]['main']['temp']);
                        weatherdata.hour3 = Math.round(result['data']['list'][3]['main']['temp']);
                        weatherdata.hour4 = Math.round(result['data']['list'][4]['main']['temp']);
                        weatherdata.hour5 = Math.round(result['data']['list'][5]['main']['temp']);

                        // fetching daily weather data
                        weatherdata.tomorrowTemp = Math.round(result['data']['list'][7]['main']['temp']);
                        weatherdata.dayAfterTomorrowTemp = Math.round(result['data']['list'][15]['main']['temp']);
                        weatherdata.tomorrowMain = result['data']['list'][7]['weather'][0]['main'];
                        weatherdata.dayAfterTomorrowMain = result['data']['list'][15]['weather'][0]['main'];

                        // fetching icon codes
                        weatherdata.iconToday = result['data']['list'][0]['weather'][0]['icon'];
                        weatherdata.iconTomorrow = result['data']['list'][7]['weather'][0]['icon'];
                        weatherdata.iconDayAfterTomorrow = result['data']['list'][15]['weather'][0]['icon'];
                        weatherdata.iconHourNow = result['data']['list'][0]['weather'][0]['icon'];
                        weatherdata.iconHour1 = result['data']['list'][1]['weather'][0]['icon'];
                        weatherdata.iconHour2 = result['data']['list'][2]['weather'][0]['icon'];
                        weatherdata.iconHour3 = result['data']['list'][3]['weather'][0]['icon'];
                        weatherdata.iconHour4 = result['data']['list'][4]['weather'][0]['icon'];
                        weatherdata.iconHour5 = result['data']['list'][5]['weather'][0]['icon'];

                        // ---------------- Populating Modal with data --------------------
                        // Populating today's weather data
                        document.getElementById("wrapper-description").innerHTML = weatherdata.description;
                        document.getElementById("wrapper-pressure").innerHTML = weatherdata.pressure + " " + "hPa";
                        document.getElementById("wrapper-humidity").innerHTML = weatherdata.humidity + "%";
                        document.getElementById("wrapper-name").innerHTML = weatherdata.name;
                        document.getElementById("wrapper-temp").innerHTML = Math.round(weatherdata.temp) + '°C';

                        // Populating hourly weather data
                        document.getElementById("wrapper-hour-now").innerHTML = Math.round(weatherdata.hourNow) + '°c';
                        document.getElementById("wrapper-hour1").innerHTML = Math.round(weatherdata.hour1) + '°c';
                        document.getElementById("wrapper-hour2").innerHTML = Math.round(weatherdata.hour2) + '°c';
                        document.getElementById("wrapper-hour3").innerHTML = Math.round(weatherdata.hour3) + '°c';
                        document.getElementById("wrapper-hour4").innerHTML = Math.round(weatherdata.hour4) + '°c';
                        document.getElementById("wrapper-hour5").innerHTML = Math.round(weatherdata.hour5) + '°c';

                        // hourly forecast variables
                        let currentTime = new Date().getHours();
                        let time1 = currentTime + 1;
                        let time2 = time1 + 1;
                        let time3 = time2 + 1;
                        let time4 = time3 + 1;
                        let time5 = time4 + 1;

                        // Populating hourly forecast
                        document.getElementById("wrapper-time1").innerHTML = time1;
                        document.getElementById("wrapper-time2").innerHTML = time2;
                        document.getElementById("wrapper-time3").innerHTML = time3;
                        document.getElementById("wrapper-time4").innerHTML = time4;
                        document.getElementById("wrapper-time5").innerHTML = time5;

                        // Populating daily forecast
                        document.getElementById("wrapper-forecast-temp-today").innerHTML = Math.round(weatherdata.temp) + '°c';
                        document.getElementById("wrapper-forecast-temp-tomorrow").innerHTML = Math.round(weatherdata.tomorrowTemp) + '°c';
                        document.getElementById("wrapper-forecast-temp-dAT").innerHTML = Math.round(weatherdata.dayAfterTomorrowTemp) + '°c';

                        //icons 
                        let iconBaseUrl = "http://openweathermap.org/img/wn/";
                        let iconFormat = ".png";

                        // Today's weather icon
                        let iconImgToday = iconBaseUrl + weatherdata.iconToday + iconFormat;
                        document.getElementById("wrapper-icon-today").src = iconImgToday;

                        // Tomorrow's weather icon
                        let iconImgTomorrow = iconBaseUrl + weatherdata.iconTomorrow + iconFormat;
                        document.getElementById("wrapper-icon-tomorrow").src = iconImgTomorrow;

                        // Day after tomorrow's weather icon
                        let iconDayAfterTomorrow = iconBaseUrl + weatherdata.iconDayAfterTomorrow + iconFormat;
                        document.getElementById("wrapper-icon-dAT").src = iconDayAfterTomorrow;

                        // hour now's weather icon
                        let iconHourNow = iconBaseUrl + weatherdata.iconHourNow + iconFormat;
                        document.getElementById("wrapper-icon-hour-now").src = iconHourNow;

                        // hour 1 weather icon
                        let iconHour1 = iconBaseUrl + weatherdata.iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour1").src = iconHour1;

                        // hour 2 weather icon
                        let iconHour2 = iconBaseUrl + weatherdata.iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour2").src = iconHour2;

                        // hour 3 weather icon
                        let iconHour3 = iconBaseUrl + weatherdata.iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour3").src = iconHour3;

                        // hour 4 weather icon
                        let iconHour4 = iconBaseUrl + weatherdata.iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour4").src = iconHour4;

                        // hour 5 weather icon
                        let iconHour5 = iconBaseUrl + weatherdata.iconHour1 + iconFormat;
                        document.getElementById("wrapper-icon-hour5").src = iconHour5;

                        // switch statement that changes background image of weather card based on weather condition
                        switch (weatherdata.main) {
                            case "Snow":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/snow.gif')";
                                break;
                            case "Fog":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/fog.gif')";
                                break;
                            case "Clear":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/clear.gif')";
                                break;
                            case "Thunderstorm":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/thunderstorm.gif')";
                                break;
                            case "Rain":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/rain.gif')";
                                break;
                            case "Clouds":
                                document.getElementById("wrapper-bg").style.backgroundImage = "url('assets/weather-animations/clouds.gif')";
                                break;
                        }
                    }
                },
                error: (error) => {
                    console.log(error);
                    
                }
            });
        }
    });
};

// ajax call to display News Information
const getNewsInfo = (country) => {

    $.ajax({
        url: 'libs/php/displayNews.php',
        type: 'POST',
        datatype: 'json',
        data: {
            country: country
        },
        success: (result) => {
            if (result.status.name == "ok") {

                for (let i = 0; i < result['data']['articles'].length; i++) {
                    // break out of the loop once we have 8 articles
                    if (i >= 8) {
                        break;
                    }
                    // initialise news articles
                    let newsData = new newsInfo();
                    newsData.urlToImage = result['data']['articles'][i]['urlToImage'];
                    newsData.title = result['data']['articles'][i]['title'];
                    newsData.url = result['data']['articles'][i]['url'];
                    newsData.source = result['data']['articles'][i]['source']['name'];
                    newsData.publishedAt = result['data']['articles'][i]['publishedAt'];
                    newsData.countryName = $("#selCountry option:checked").text();

                    //push new articles into array
                    newsDataContainer.push(newsData);
                }

                if (newsDataContainer.length != 0) {
                
                    document.getElementById('newModal').innerHTML = `News Stories for ${$("#selCountry option:checked").text()}`;

                    for (let i = 0; i < newsDataContainer.length; i++) {
                        let currentLink = 'article' + (i + 1) + 'Link';
                        let currentImg = 'article' + (i + 1) + 'Img';
                        let currentTitle = 'article' + (i + 1) + 'Title';
                        let currentSource = 'article' + (i + 1) + 'Source';

                        document.getElementById(currentLink).href = newsDataContainer[i].url;

                        if (newsDataContainer[i].urlToImage) {
                            document.getElementById(currentImg).src = newsDataContainer[i].urlToImage;
                            document.getElementById(currentImg).style.width = "110px";
                            document.getElementById(currentImg).style.height = "75px";
                        } else {
                            document.getElementById(currentImg).src = 'assets/icons/placeholder.png';
                        }

                        document.getElementById(currentTitle).innerHTML = newsDataContainer[i].title;
                        document.getElementById(currentSource).innerHTML = `<em>Source: ${newsDataContainer[i].source}</em>`;

                    }
                } 
            }
        },
        error: (error) => {
            console.log(error);
        }
    });

};

// ajax call to to display exchange rates
const getExchangeRate = () => {
$.ajax({
    url: "libs/php/getExchangeRate.php",
    type: 'POST',
    dataType: 'json',
    data: {},
    success: (result) => {

        if (result.status.name == "ok") {
            countryData.exchangeRate = result['data']['rates'][countryData.currencyCode];

            // adding exchange rate data
            document.getElementById('countryInfoExchange').innerHTML = countryData.exchangeRate;
        }
    },
    error: (error) => {
        console.log(error);
    }
});
};

// -------------------------------- Modal Buttons --------------------------------

// Modal 1: Create a button for modal to display country information
L.easyButton({
id: 'countryBtn',
states: [{
    stateName: 'country info',
    icon: 'fa-solid fa-circle-info fa-2xl',
    title: 'display country info button',
    onClick: () => {
        $("#staticBackdrop").modal("show");

        $(".close").click(() => {
                $("#staticBackdrop").modal('hide');
            });
    }
}]
}).addTo(map);

// Modal 2: Create a button for modal to display weather forecast
L.easyButton({
id: 'weatherBtn',
states: [{
    icon: 'fa-solid fa-cloud-sun fa-2xl',
    title: 'Weather Forecast',
    onClick: () => {
        $("#staticBackdrop2").modal("show");

        $(".close").click(() => {
                $("#staticBackdrop2").modal('hide');
            });
    }
}]
}).addTo(map);

// Modal 3: Create a button for modal to display news information
L.easyButton({
id: 'newsBtn',
states: [{
    icon: 'fa-solid fa-newspaper fa-2xl',
    title: 'Display Country Headlines',
    onClick: () => {


        if (newsDataContainer.length != 0) {
            $('#staticBackdrop3').modal('show');

            $(".close").click(() => {
              $("#staticBackdrop3").modal('hide');
            });

        }else {
            $("#newsError").modal("show");

            $(".close").click(() => {
                    $("#newsError").modal('hide');
                });
    
            document.getElementById('errorCountry').innerHTML = $("#selCountry option:checked").text();

        }
        newsDataContainer = []; // clear the array before calling to ensure the same news isn't displayed.
    }
}]
}).addTo(map);

// -------------------------------- Ajax calls for markers --------------------------------

// capital cities marker ajax call
const getCapital = (country) => new Promise((resolve, reject) => {


$.ajax({
    url: "libs/php/markers/capitalMarker.php",
    type: 'POST',
    dataType: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {

        if (result.status.name == "ok") {
            let lat = parseFloat(result['data']['geonames']['0']['lat']);
            let lng = parseFloat(result['data']['geonames']['0']['lng']);

            markers.capital = [
                result['data']['geonames']['0']['name'],
                result['data']['geonames']['0']['population'],
                lat,
                lng
            ];
        }
        resolve();
    },
    error: (error) => {
        console.log(error);
        reject();
    }
});

});

// airport markers ajax call
const getAirports = (country) => new Promise((resolve, reject) => {
$.ajax({
    url: "libs/php/markers/airportMarker.php",
    type: 'POST',
    dataType: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {

        if (result.status.name == "ok") {

            for (let i = 0; i < result['data']['geonames'].length; i++) {

                markers.airports.push([
                    result['data']['geonames'][i]['name'],
                    parseFloat(result['data']['geonames'][i]['lat']),
                    parseFloat(result['data']['geonames'][i]['lng'])
                ]);
            }

            resolve();
        }
    },
    error: (error) => {
        console.log(error);
        reject();
    }
});


});

// universities ajax call
const getUniversities = (country) => new Promise((resolve, reject) => {


$.ajax({
    url: "libs/php/markers/universityMarker.php",
    type: 'POST',
    dataType: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {

        if (result.status.name == "ok") {

            for (let i = 0; i < result['data']['geonames'].length; i++) {

                markers.universities.push([
                    result['data']['geonames'][i]['name'],
                    parseFloat(result['data']['geonames'][i]['lat']),
                    parseFloat(result['data']['geonames'][i]['lng'])
                ]);
            }
            resolve();
        }
    },

    error: (error) => {
        console.log(error);
        reject();
    }
});

});

// cities ajax call
const getCities = (country) => new Promise((resolve, reject) => {

$.ajax({
    url: "libs/php/markers/cityMarker.php",
    type: 'POST',
    dataType: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {

        if (result.status.name == "ok") {

            for (let i = 0; i < result['data']['geonames'].length; i++) {

                markers.cities.push([
                    result['data']['geonames'][i]['name'],
                    result['data']['geonames'][i]['population'],
                    parseFloat(result['data']['geonames'][i]['lat']),
                    parseFloat(result['data']['geonames'][i]['lng'])
                ]);
            }
            resolve();
        }

    },

    error: (error) => {
        console.log(error);
        reject();
    }
});

});

// webcam ajax call
const getWebcams = (country) => new Promise((resolve, reject) => {
$.ajax({
    url: 'libs/php/markers/webcamMarker.php',
    type: 'POST',
    dataType: 'json',
    data: {
        isoCode: country
    },
    success: (result) => {
        if (result.status.name == "ok") {
            for (let i = 0; i < result['data']['result']['webcams'].length; i++) {

                markers.webcamID.push(result['data']['result']['webcams'][i]); // pushes each webcam id into an array
            }
            resolve();
        }
    },
    error: (error) => {
        console.log(error);
        reject();
    }
})
});

// -------------------------------- Map Markers --------------------------------

// ------- Display Capital Marker  ----------

const capitalMarker = async () => {

capitalMarkerClusters = L.markerClusterGroup({

    chunkedLoading: true,
    maxClusterRadius: () => capitalClusterRadius,
});

markers.capital = [];
await getCapital($("#selCountry option:checked").val());

let capitalCityIcon = L.ExtraMarkers.icon({
    icon: 'fa-solid fa-landmark-flag',
    markerColor: 'yellow',
    prefix: 'fa',
    shape: 'penta'
});

let capitalMarker = L.marker(new L.LatLng(markers.capital[2], markers.capital[3]), {icon: capitalCityIcon});

capitalMarker.bindPopup(`
<b>Capital City: </b> ${markers.capital[0]} <br>
<b>Population: </b> ${(markers.capital[1] / 1000000).toFixed(1)} Million
`);

capitalMarkerClusters.addLayer( capitalMarker );
capitalGroup.addLayer(capitalMarkerClusters);
}

// ------- Display Cities Marker  ----------
const citiesMarker = async () => {

citiesMarkerClusters = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: () => cityClusterRadius,
});
markers.cities = [];

let currentCountry = $("#selCountry option:checked").val();
await getCities(currentCountry);

let cityIcon = L.ExtraMarkers.icon({
    icon: 'fa-solid fa-city',
    markerColor: 'green',
    prefix: 'fa'
});

    for(let i=0;i<markers.cities.length;i++){
        
        let cityMarker = L.marker(new L.LatLng(markers.cities[i][2], markers.cities[i][3]), {icon: cityIcon})
        .bindPopup(`
            <b>City:</b> ${markers.cities[i][0]} <br> 
            <b>Population: </b> ${markers.cities[i][1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} 
        `);
        citiesMarkerClusters.addLayer( cityMarker );
    }

    cityGroup.addLayer(citiesMarkerClusters);
}

// ------- Display Airports Marker  ----------
const airportMarker = async () => {
airportsMarkerClusters = L.markerClusterGroup({

    chunkedLoading: true,
    maxClusterRadius: () => airportClusterRadius,
});

markers.airports = [];
let currentCountry = $("#selCountry option:checked").val();
await getAirports(currentCountry);

var planeIcon = L.ExtraMarkers.icon({
    icon: 'fa-solid fa-plane-arrival',
    markerColor: 'red',
    prefix: 'fa'
  });


for(let i=0; i<markers.airports.length; i++){
    
    let planeMarker = L.marker(new L.LatLng(markers.airports[i][1], markers.airports[i][2]), {icon: planeIcon})
    .bindPopup(
        `${markers.airports[i][0]}`
    );
    
    airportsMarkerClusters.addLayer( planeMarker );
    
}

airportGroup.addLayer(airportsMarkerClusters);
}

// ------- Display Universities Marker  ----------
const universitiesMarker = async () => {
universitiesMarkerClusters = L.markerClusterGroup({
    chunkedLoading: true,
    maxClusterRadius: () => universitiesClusterRadius,
});
markers.universities = [];
let currentCountry = $("#selCountry option:checked").val();
await getUniversities(currentCountry);
       
let universityIcon = L.ExtraMarkers.icon({
    icon: 'fa-solid fa-graduation-cap',
    markerColor: 'blue',
    prefix: 'fa'
});

for(let i=0;i<markers.universities.length;i++){

    let universityMarker = L.marker(new L.LatLng(markers.universities[i][1], markers.universities[i][2]), 
    {icon: universityIcon})
    .bindPopup(
        `${markers.universities[i][0]}`);
    
        universitiesMarkerClusters.addLayer( universityMarker );
}


universitiesGroup.addLayer(universitiesMarkerClusters);
}

// ------- Display Webcams Marker  ----------
const webcamMarker = async () => {
webcamMarkerClusters = L.markerClusterGroup({

    chunkedLoading: true,
    maxClusterRadius: () => webcamClusterRadius,
});

markers.webcamID = [];
let currentCountry = $("#selCountry option:checked").val();

// program must await here for the webcam id's to be available
await getWebcams(currentCountry);

// web marker icons
let webcamMarkerIcon = L.ExtraMarkers.icon({
    
    icon: 'fa-solid fa-video',
    markerColor: 'purple',
    prefix: 'fa',
    shape: 'square'
});

// loop through retrieved webcam array
for(let i = 0; i < markers.webcamID.length; i++) {     
    
    let webcamMarker = L.marker(new L.LatLng(markers.webcamID[i].location.latitude, markers.webcamID[i].location.longitude), 
        {icon: webcamMarkerIcon})
    .bindPopup(
        `<iframe src="${markers.webcamID[i].player.day.embed}?autoplay=1" loading="auto" allowfullscreen="false" style="width:300px; height:140px;border-radius:10px;"></iframe><br><br>
        <h6>${markers.webcamID[i].location.city}</h6>
        <h6 class="fineText">Viewed: ${markers.webcamID[i].statistics.views}</h6>`
    );

    webcamMarkerClusters.addLayer( webcamMarker );
}

webcamGroup.addLayer(webcamMarkerClusters);
}

// ------- Display All Markers ----------
const displayAllMarkers = () => {
capitalMarker();
citiesMarker();
airportMarker();
universitiesMarker();
webcamMarker();
}

// -------------------------------- Document Ready Call --------------------------------
$('document').ready( () => {
 // populating the select form and displaying user location
 populateSelectForm();

// Event handler for displaying a selected country's borders resetting markers to display for selected country
$("#selCountry").change(async () => {
        newsDataContainer = []; // clear the array before calling to ensure the same news isn't displayed.
        displayBorders($('#selCountry').val());
        // clears the layered marker clusters
        airportGroup.clearLayers();
        cityGroup.clearLayers();
        capitalGroup.clearLayers();
        universitiesGroup.clearLayers();
        webcamGroup.clearLayers();

        await getCountryInfo($('#selCountry').val());
        getExchangeRate();
        getNewsInfo($('#selCountry').val());
        getWeatherInfo();

        // displays markers for a given country
        displayAllMarkers();
    });
});