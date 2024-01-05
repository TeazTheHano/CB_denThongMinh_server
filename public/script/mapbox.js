mapboxgl.accessToken = 'pk.eyJ1Ijoib2N0b2JvdDEyMyIsImEiOiJjbHFkbnZveWswMWFyMmlueWVyN25iZ3loIn0.6CqAe087-lQUxgsE5rb7FA';
const map = new mapboxgl.Map({
    container: 'mapFrame', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 9 // starting zoom
});