var map; // Mapbox map
var marker;

mapboxgl.accessToken =
  "pk.eyJ1IjoibmhhdGhvYTE0IiwiYSI6ImNscDZjMnZ2cDBkY3AybHNoaTk4cnZ2eHMifQ.KhkP2ZxWJQ5CwtdIr8c_IA";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
  enableHighAccuracy: true,
});

function successLocation(position) {
  setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
  setupMap([106.68169391422435, 10.770296180382417]);
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadPoints() {
  return fetch("https://officer-mapapp.vercel.app/api/point/getAllPoint")
    .then((response) => response.json())
    .then((data) => data.data);
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
  map.addControl(new mapboxgl.GeolocateControl());

  map.on("style.load", function () {
    map.setCenter([106.68169391422435, 10.770296180382417]);
  });

  map.on("load", async () => {
    let dbPointJson;
    let dbZonedPointJson;

    (async () => {
      let pointData = await loadPoints();

      dbPointJson = {
        features: [],
      };

      dbZonedPointJson = {
        features: [],
      };

      for (let i = 0; i < pointData.length; i++) {
        let ward = pointData[i].area.ward;
        let district = pointData[i].area.district;
        let coords = [pointData[i].locate[0], pointData[i].locate[1]];

        let point = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: coords,
          },
          properties: {
            id: pointData[i]._id,
            name: pointData[i].name,
            billboardType: pointData[i].formAdvertising,
            positionType: pointData[i].positionType,
            address: pointData[i].address,
            area: {
              ward: ward,
              district: district,
            },
            isZoning: pointData[i].isZoning,
            picturePoint: pointData[i].picturePoint,
            long: pointData[i].locate[0],
            lat: pointData[i].locate[1],
            havePanel: pointData[i].havePanel,
          },
        };

        if (point.properties.isZoning === true) {
          dbZonedPointJson.features.push(point);
        } else {
          dbPointJson.features.push(point);
        }
      }

      map.addSource("billboardPos", {
        type: "geojson",
        data: dbZonedPointJson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addSource("unzonedPos", {
        type: "geojson",
        data: dbPointJson,
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 40, // Radius of each cluster when clustering points (defaults to 50)
      });

      map.addLayer({
        id: "unclustered-point",
        type: "circle",
        source: "unzonedPos",
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "isZoning"], false],
        ],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": "#8f8f8f",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point-zoned",
        type: "circle",
        source: "billboardPos",
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "isZoning"], true],
        ],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": "#0000ff",
          "circle-radius": 10,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "clusters",
        type: "circle",
        source: "unzonedPos",
        filter: ["has", "point_count"],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": "#8f8f8f",
          "circle-radius": ["step", ["get", "point_count"], 20, 3, 30, 6, 40],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "cluster-count",
        type: "symbol",
        source: "unzonedPos",
        filter: ["has", "point_count"],
        layout: {
          visibility: "visible",
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": ["step", ["get", "point_count"], 12, 3, 16, 6, 20],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "clusters-zoned",
        type: "circle",
        source: "billboardPos",
        filter: ["has", "point_count"],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-color": "#0000ff",
          "circle-radius": ["step", ["get", "point_count"], 20, 3, 30, 6, 40],
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "cluster-zoned-count",
        type: "symbol",
        source: "billboardPos",
        filter: ["has", "point_count"],
        layout: {
          visibility: "visible",
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": ["step", ["get", "point_count"], 12, 3, 16, 6, 20],
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point-label",
        type: "symbol",
        source: "billboardPos",
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "isZoning"], false],
          ["==", ["get", "havePanel"], true],
        ],
        layout: {
          visibility: "visible",
          "text-field": "QC",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 10,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      map.addLayer({
        id: "unclustered-point-zoned-label",
        type: "symbol",
        source: "billboardPos",
        filter: [
          "all",
          ["!", ["has", "point_count"]],
          ["==", ["get", "isZoning"], true],
          ["==", ["get", "havePanel"], true],
        ],
        layout: {
          visibility: "visible",
          "text-field": "QC",
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
          "text-size": 10,
        },
        paint: {
          "text-color": "#ffffff",
        },
      });

      // inspect a cluster on click
      map.on("click", "clusters", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters"],
        });

        const clusterId = features[0].properties.cluster_id;
        map
          .getSource("unzonedPos")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      map.on("click", "clusters-zoned", (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ["clusters-zoned"],
        });

        const clusterId = features[0].properties.cluster_id;

        map
          .getSource("billboardPos")
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            map.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on(
        "mouseenter",
        ["unclustered-point", "unclustered-point-zoned"],
        (e) => {
          const coordinates = e.features[0].geometry.coordinates.slice();
          const long = e.features[0].properties.long;
          const lat = e.features[0].properties.lat;
          const isZoning =
            e.features[0].properties.isZoning === true
              ? "ĐÃ QUY HOẠCH"
              : "CHƯA QUY HOẠCH";
          const description = `<strong>${e.features[0].properties.billboardType
            }</strong><br>
                                        ${e.features[0].properties.positionType
            }<br>
                                        ${e.features[0].properties.address}<br>
                                        ${JSON.parse(
              e.features[0].properties.area
            ).ward
            }, ${JSON.parse(e.features[0].properties.area).district
            }<br>
                                        <strong><em>${isZoning}</em></strong>`;

          // Ensure that if the map is zoomed out such that
          // multiple copies of the feature are visible, the
          // popup appears over the copy being pointed to.
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          popup.setLngLat(coordinates).setHTML(description).addTo(map);
        }
      );

      map.on("click", ["unclustered-point", "unclustered-point-zoned"], (e) => {
        const props = e.features[0].properties;

        const pointId = props.id;
        const pointName = props.name;
        const long = props.long;
        const lat = props.lat;
        const district = JSON.parse(props.area).district;
        const ward = JSON.parse(props.area).ward;
        const addressURL = `${props.address.trim()}, ${ward}, ${district}`;

        if (window.opener) {
          window.opener.updateInput(pointId, pointName, long, lat, addressURL);
        }

        if (marker) {
          marker.remove();
        }

        marker = new mapboxgl.Marker({ color: "#0000ff" })
          .setLngLat(e.lngLat)
          .addTo(map);

        map.easeTo({
          center: [long, lat],
        });
      });

      map.on(
        "mouseleave",
        ["unclustered-point", "unclustered-point-zoned", "reported-point"],
        () => {
          map.getCanvas().style.cursor = "";
          popup.remove();
        }
      );
    })();
  });
}
