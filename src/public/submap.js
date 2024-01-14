var map; // Mapbox map
var marker;
var locate;

mapboxgl.accessToken =
  "pk.eyJ1IjoibmhhdGhvYTE0IiwiYSI6ImNscDZjMnZ2cDBkY3AybHNoaTk4cnZ2eHMifQ.KhkP2ZxWJQ5CwtdIr8c_IA";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([106.67908367285673, 10.75305989852285]);
}

function setupMap(center) {
  const bounds = [
    [106.38, 10.39], // Southwest coordinates
    [107.04, 11.17], // Northeast coordinates
  ];

  map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: center,
    zoom: 13,
    maxBounds: bounds,
    language: "vi-VN",
  });

  map.addControl(new mapboxgl.NavigationControl());

  const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    reverseGeocode: true,
    language: "en-US, vi-VN",
  });

  map.addControl(geocoder, "top-left");
  map.addControl(new mapboxgl.GeolocateControl());

  map.on("style.load", () => {
    map.on("click", (e) => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${e.lngLat.lng},${e.lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.features && data.features.length > 0) {
            console.log(data.features[0])
            const [name, ...addressParts] =
              data.features[0].place_name.split(",");
            const address = addressParts.join(",");
            const ward = data.features[0].context[0].text;
            const district = data.features[0].context[2].text;
            console.log(name, address, ward, district);
            if (window.opener) {
              window.opener.updateInputLnglat(e.lngLat.lng, e.lngLat.lat);
              window.opener.updateInputAddress(name, address);
              window.opener.updateInputWardDistrict(ward, district);
            }
          }
        });

      if (marker) {
        marker.remove();
      }

      marker = new mapboxgl.Marker({ color: "#0000ff" })
        .setLngLat(e.lngLat)
        .addTo(map);

      map.easeTo({
        center: e.lngLat,
      });
    });
  });
}

function showAlert() {
  alert("Bạn phải chọn vị trí trên bản đồ");
}
