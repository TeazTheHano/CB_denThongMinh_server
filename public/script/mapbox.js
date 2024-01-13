const magDisplay = document.getElementById('mag');
const locDisplay = document.getElementById('loc');
const dateDisplay = document.getElementById('date');

const today = new Date();
// Use JavaScript to get the date a week ago
const priorDate = new Date().setDate(today.getDate() - 7);
// Set that to an ISO8601 timestamp as required by the USGS earthquake API
const priorDateTs = new Date(priorDate);
const sevenDaysAgo = priorDateTs.toISOString();

const flyToStore = (currentFeature) => {
    map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
    });
};

// TODO: CHECK POPUP WHEN CLICK ON MARKER
const createPopUp = (currentFeature) => {
    const popUps = document.getElementsByClassName('mapboxgl-popup');
    if (popUps[0]) popUps[0].remove();

    const popup = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
            `<h3>${currentFeature.properties.id}</h3>
            <ul>
                <li>Địa chỉ: ${currentFeature.properties.locationDetail}</li>
                <li>Nhiệt độ: ${currentFeature.properties.sensorData.temperature}</li>
                <li>Độ ẩm: ${currentFeature.properties.sensorData.humidity}</li>
            </ul>`
        )
        .addTo(map);

    const mapTemp = document.getElementById('mapTemp');
    const mapHumid = document.getElementById('mapHumid');
    const mapAq = document.getElementById('mapAq');

    mapTemp.innerHTML = currentFeature.properties.sensorData.temperature;
    mapHumid.innerHTML = currentFeature.properties.sensorData.humidity;
    mapAq.innerHTML = currentFeature.properties.sensorData.dust;
};


mapboxgl.accessToken = 'pk.eyJ1Ijoib2N0b2JvdDEyMyIsImEiOiJjbHFkbnZveWswMWFyMmlueWVyN25iZ3loIn0.6CqAe087-lQUxgsE5rb7FA';
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL

    center: [106.2350, 22.6890], // starting position [lng, lat]
    zoom: 12, // starting zoom

});


let quakeID = null;
map.on('load', () => {

    // >>> EARHQUAKE SECTION <<<
    map.addSource('earthquakes', {
        type: 'geojson',
        data: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1&starttime=${sevenDaysAgo}`,
        generateId: true // This ensures that all features have unique IDs
    });

    map.addLayer({
        id: 'earthquakes-viz',
        type: 'circle',
        source: 'earthquakes',
        paint: {
            // The feature-state dependent circle-radius expression will render
            // the radius size according to its magnitude when
            // a feature's hover state is set to true
            'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    1,
                    8,
                    1.5,
                    10,
                    2,
                    12,
                    2.5,
                    14,
                    3,
                    16,
                    3.5,
                    18,
                    4.5,
                    20,
                    6.5,
                    22,
                    8.5,
                    24,
                    10.5,
                    26
                ],
                5
            ],
            'circle-stroke-color': '#000',
            'circle-stroke-width': 1,
            // The feature-state dependent circle-color expression will render
            // the color according to its magnitude when
            // a feature's hover state is set to true
            'circle-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    1,
                    '#fff7ec',
                    1.5,
                    '#fee8c8',
                    2,
                    '#fdd49e',
                    2.5,
                    '#fdbb84',
                    3,
                    'yellow',
                    3.5,
                    'rgb(255, 165, 0)',
                    4.5,
                    'rgb(255, 140, 0)',
                    6.5,
                    '#b30000',
                    8.5,
                    '#7f0000',
                    10.5,
                    '#000'
                ],
                '#000'
            ]
        }
    });
    // >>> END of EARHQUAKE SECTION <<<
});


// >>> EARHQUAKE SECTION <<<
map.on('mousemove', 'earthquakes-viz', (event) => {
    map.getCanvas().style.cursor = 'pointer';
    // Set constants equal to the current feature's magnitude, location, and time
    const quakeMagnitude = event.features[0].properties.mag;
    const quakeLocation = event.features[0].properties.place;
    const quakeDate = new Date(event.features[0].properties.time);

    // Check whether features exist
    if (event.features.length === 0) return;
    // Display the magnitude, location, and time in the sidebar
    magDisplay.textContent = quakeMagnitude;
    locDisplay.textContent = quakeLocation;
    dateDisplay.textContent = quakeDate;

    // If quakeID for the hovered feature is not null,
    // use removeFeatureState to reset to the default behavior
    if (quakeID) {
        map.removeFeatureState({
            source: 'earthquakes',
            id: quakeID
        });
    }

    quakeID = event.features[0].id;

    // When the mouse moves over the earthquakes-viz layer, update the
    // feature state for the feature under the mouse
    map.setFeatureState(
        {
            source: 'earthquakes',
            id: quakeID
        },
        {
            hover: true
        }
    );
});

map.on('mouseleave', 'earthquakes-viz', () => {
    if (quakeID) {
        map.setFeatureState(
            {
                source: 'earthquakes',
                id: quakeID
            },
            {
                hover: false
            }
        );
    }

    quakeID = null;
    // Remove the information from the previously hovered feature from the sidebar
    magDisplay.textContent = '';
    locDisplay.textContent = '';
    dateDisplay.textContent = '';
    // Reset the cursor style
    map.getCanvas().style.cursor = '';
});

// >>> END of EARHQUAKE SECTION <<<



// >>> ADD POINTS OF DEVICES SECTION <<<

// TODO: get data from database

function getDeviceData() {
    fetch("/web/api/getData")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.forEach(device => {
                if (device.deviceID == 0) return;
                devices.push({
                    id: device.deviceID,
                    lat: device.location.lat,
                    lng: device.location.long,
                    locationDetail: device.location.address,
                    sensorData: {
                        temperature: device.measure[device.measure.length - 1].temp,
                        humidity: device.measure[device.measure.length - 1].humi,
                        dust: device.measure[device.measure.length - 1].dust,
                        gas: device.measure[device.measure.length - 1].mq7,
                    },
                })
            })
            addDataToGeojson();
            addMarkers();
        })
}

let devices = [
    // {
    //     id: 1,
    //     lat: 22.6861,
    //     lng: 106.2349,
    //     locationDetail: '05, Yen Bai, Viet Nam',
    //     sensorData: {
    //         temperature: 30,
    //         humidity: 50,
    //         dust: 100,
    //         gas: 200,
    //         windSpeed: 10,
    //     },
    // },
];


let geojsonDevice = {
    type: 'FeatureCollection',
    features: []
};

function addDataToGeojson() {
    devices.forEach(device => {
        geojsonDevice.features.push({
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [device.lng, device.lat]
            },
            properties: {
                id: device.id,
                name: device.name,
                locationDetail: device.locationDetail,
                sensorData: device.sensorData
            }
        });
    });
}


// add markers to map
function addMarkers() {
    geojsonDevice.features.forEach(function (marker) {

        // create a HTML element for each feature
        var el = document.createElement('div');
        el.className = 'marker';
        el.id = 'marker-' + marker.properties.id;
        el.innerText = marker.properties.sensorData.temperature;

        // make a marker for each feature and add to the map
        new mapboxgl.Marker(el)
            .setLngLat(marker.geometry.coordinates)
            .addTo(map);

        el.addEventListener('click', function () {
            // 1. Fly to the point
            flyToStore(marker);
            // 2. Close all other popups and display popup for clicked store
            createPopUp(marker);
            // 3. Highlight listing in sidebar (and remove highlight for all other listings)
            var activeItem = document.getElementsByClassName('active');
            if (activeItem[0]) {
                activeItem[0].classList.remove('active');
            }
            // Find the index of the store.features that corresponds to the clicked marker id.
            // Match the correct listing using the function that we created earlier.
            var listing = document.getElementById('listing-' + marker.properties.id);
            listing.classList.add('active');
        });


        // color and size of marker
        if (marker.properties.sensorData.temperature > 40) {
            el.style.backgroundColor = 'rgba(255, 0, 0, 1)';
            el.style.width = '3vw';
            el.style.height = '3vw';
        } else if (marker.properties.sensorData.temperature > 30) {
            el.style.backgroundColor = 'rgba(255, 165, 0, 0.8)';
            el.style.width = '2.5vw';
            el.style.height = '2.5vw';
        } else {
            el.style.backgroundColor = 'rgba(0, 255, 0, 0.6)';
            el.style.width = '2vw';
            el.style.height = '2vw';
        }

    });
}

// >>> END of ADD POINTS OF DEVICES SECTION <<<