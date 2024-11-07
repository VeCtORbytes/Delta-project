mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    container: 'map',
    center: listing.geometry.coordinates,
    style: 'mapbox://styles/mapbox/dark-v11',
    zoom: 10
});


// Make sure to pass the custom element 'el' to the Marker constructor
const marker = new mapboxgl.Marker({color:"red"})  // Use el here instead of {color:"red"}
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setHTML(
        `<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`
    ))
    .setLngLat(listing.geometry.coordinates)
    .addTo(map);
