var map; // Mapbox map
var marker;

mapboxgl.accessToken = "pk.eyJ1IjoibmhhdGhvYTE0IiwiYSI6ImNscDZjMnZ2cDBkY3AybHNoaTk4cnZ2eHMifQ.KhkP2ZxWJQ5CwtdIr8c_IA";

navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
    enableHighAccuracy: true,
});

function successLocation(position) {
    setupMap([position.coords.longitude, position.coords.latitude]);
}

function errorLocation() {
    setupMap([106.68247638583301, 10.77121635650299]);
}

function bottomController() {
    const toggleableLayerIds = ["billboard", "report-violation"];

    for (const id of toggleableLayerIds) {
        if (document.getElementById(id)) {
            continue;
        }

        const link = document.createElement("div");
        link.id = id;

        link.innerHTML = `
    <label class="switch">
      <input type="checkbox" id="${id}-checkbox" checked/>
      <span class="slider"></span>
    </label>
    <p>${id === "billboard" ? "BẢNG QUẢNG CÁO" : "BÁO CÁO VI PHẠM"}</p>
  `;

        // Append the link element to the document body or any desired container
        document.body.appendChild(link);
        const layers = document.getElementById("bottom-bar");
        layers.appendChild(link);

        link.onclick = function (e) {
            const clickedLayer = this.id;

            e.preventDefault();
            e.stopPropagation();

            const checkbox = document.getElementById(`${clickedLayer}-checkbox`);
            const visibility = map.getLayoutProperty(clickedLayer, "visibility");

            if ((visibility === "visible" || visibility === undefined) && checkbox.checked) {
                map.setLayoutProperty(clickedLayer, "visibility", "none");
                checkbox.checked = false; // Uncheck the checkbox
                toggleUnclusteredPointVisibility(clickedLayer, "none");
            } else {
                map.setLayoutProperty(clickedLayer, "visibility", "visible");
                checkbox.checked = true; // Check the checkbox
                toggleUnclusteredPointVisibility(clickedLayer, "visible");
            }

            map.triggerRepaint();
        };
    }
}

function toggleUnclusteredPointVisibility(clickedLayer, visibility) {
    if (clickedLayer === "billboard") {
        map.setLayoutProperty("unclustered-point-label", "visibility", visibility);
        map.setLayoutProperty("unclustered-point", "visibility", visibility);
    } else {
        map.setLayoutProperty("unclustered-point-label-reported", "visibility", visibility);
        map.setLayoutProperty("unclustered-point-reported", "visibility", visibility);
    }
}

async function loadPoints() {
    return fetch("http://localhost:3500/api/point/getAllPoint")
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
            if (marker) {
                marker.remove();
            }

            marker = new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map);

            var features = map.queryRenderedFeatures(e.point);

            if (features[0] !== undefined && features[0].properties.name !== undefined) {
                if (features[0].layer.id == "unclustered-point" || features[0].layer.id == "unclustered-point-label") {
                    return;
                }

                var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${features[0].properties.name}.json?access_token=${mapboxgl.accessToken}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features && data.features.length > 0) {
                            const address = data.features[0].place_name;
                            const placeInfoPaneHeader = '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                            const reportButton = '<button type="button" class="btn btn-outline-danger"><i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</button>';

                            document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br><strong>${features[0].properties.name}</strong><br>${address}<br><br>${reportButton}`;

                            map.easeTo({
                                center: e.lngLat,
                            });
                        } else {
                            console.log("No address found");
                        }
                    })
                    .catch((error) => {
                        console.log("Error:", error);
                    });
            }
            else {
                const placeInfoPaneHeader = '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}Chưa có dữ liệu.`;
            }
        });
    });

    map.on("load", () => {
        //add bottomController
        bottomController();

        let pointJson;
        (async () => {
            let data = await loadPoints();

            pointJson = {
                features: [],
            };

            for (let i = 0; i < data.length; i++) {
                let point = {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [data[i].locate[0], data[i].locate[1]],
                    },
                    properties: {
                        id: data[i]._id,
                        name: data[i].name,
                        billboardType: data[i].formAdvertising,
                        positionType: data[i].positionType,
                        address: data[i].address,
                        area: {
                            ward: data[i].area.ward,
                            district: data[i].area.district,
                        },
                        isZoning: data[i].isZoning,
                        picturePoint: data[i].picturePoint
                    },
                };

                pointJson.features.push(point);
            }

            map.addSource("billboardPos", {
                type: "geojson",
                data: pointJson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            });

            map.addLayer({
                id: "clusters",
                type: "circle",
                source: "billboardPos",
                filter: ["has", "point_count"],
                paint: {
                    "circle-color": ["step", ["get", "point_count"], "#51bbd6", 3, "#f1f075", 6, "#f28cb1"],
                    "circle-radius": ["step", ["get", "point_count"], 20, 3, 30, 6, 40],
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                },
            });

            map.addLayer({
                id: "cluster-count",
                type: "symbol",
                source: "billboardPos",
                filter: ["has", "point_count"],
                layout: {
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": 12,
                },
            });

            // unclustered-point-label
            map.addLayer({
                id: "unclustered-point-label",
                type: "symbol",
                source: "billboardPos",
                // filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 1]],
                filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "isZoning"], true]],
                // filter: ["!", ["has", "point_count"]],
                layout: {
                    "text-field": "QC",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
                    "text-size": 10,
                },
                paint: {
                    "text-color": "#ffffff",
                },
            });

            // unclustered-point-label-reported
            // map.addLayer({
            //     id: "unclustered-point-label-reported",
            //     type: "symbol",
            //     source: "billboardPos",
            //     filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 0]],
            //     layout: {
            //         "text-field": "QC",
            //         "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
            //         "text-size": 10,
            //     },
            //     paint: {
            //         "text-color": "#ffffff",
            //     },
            // });

            map.addLayer(
                {
                    id: "unclustered-point",
                    type: "circle",
                    source: "billboardPos",
                    //filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 1]],
                    filter: ["!", ["has", "point_count"]],
                    paint: {
                        // "circle-color": ["match", ["get", "reported"], 1, "#0000ff", "#ffffff"],
                        "circle-color": "#0000ff",
                        "circle-radius": 10,
                        "circle-stroke-width": 1,
                        "circle-stroke-color": "#ffffff",
                    },
                },

                "unclustered-point-label"
            );

            // map.addLayer(
            //     {
            //         id: "unclustered-point-reported",
            //         type: "circle",
            //         source: "billboardPos",
            //         filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 0]],
            //         paint: {
            //             "circle-color": ["match", ["get", "reported"], 0, "#ff0000", "#ffffff"],
            //             "circle-radius": 10,
            //             "circle-stroke-width": 1,
            //             "circle-stroke-color": "#ffffff",
            //         },
            //     },
            //     "unclustered-point-label-reported"
            // );

            map.addLayer(
                {
                    id: "billboard",
                    type: "circle",
                    source: "billboardPos",
                    filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 1]],
                },
                "unclustered-point"
            );

            // map.addLayer(
            //     {
            //         id: "report-violation",
            //         type: "circle",
            //         source: "billboardPos",
            //         filter: ["all", ["!", ["has", "point_count"]], ["==", ["get", "reported"], 0]],
            //     },
            //     "unclustered-point-reported"
            // );

            // inspect a cluster on click
            map.on("click", "clusters", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
                });
                const clusterId = features[0].properties.cluster_id;
                map.getSource("billboardPos").getClusterExpansionZoom(clusterId, (err, zoom) => {
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

            // map.on("mouseenter", ["unclustered-point", "unclustered-point-reported"], (e) => {
            map.on("mouseenter", "unclustered-point", (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const isZoning = e.features[0].properties.isZoning === true ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH";
                const description = `<strong>${e.features[0].properties.billboardType}</strong><br>
                              ${e.features[0].properties.positionType}<br>
                              ${e.features[0].properties.address}<br>
                              ${JSON.parse(e.features[0].properties.area).ward}, ${JSON.parse(e.features[0].properties.area).district}<br>
                              <strong><em>${isZoning}</em></strong>`;

                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                popup.setLngLat(coordinates).setHTML(description).addTo(map);
            });

            map.on("click", "unclustered-point", (e) => {
                const pointId = e.features[0].properties.id;
                const coordinates = e.features[0].geometry.coordinates.slice();
                const address = `${e.features[0].properties.address}<br>${JSON.parse(e.features[0].properties.area).ward}, ${JSON.parse(e.features[0].properties.area).district}`;
                const imgUrl = `https://drive.google.com/uc?id=${e.features[0].properties.picturePoint}`;
                const placeInfoPaneHeader = '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                const reportButton = '<button type="button" class="btn btn-outline-danger"><i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</button>';

                document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br><strong>${e.features[0].properties.name}</strong><br>${address}<br><br><img class="img-fluid" src=${imgUrl} alt=""><br><br>${reportButton}`;

                map.easeTo({
                    center: coordinates,
                });

                fetch(`http://localhost:3500/api/panel/getListPanel/${pointId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                    });
            });

            // map.on("mouseleave", ["unclustered-point", "unclustered-point-reported"], () => {
            map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
                popup.remove();
            });

            map.on("click", (e) => {
                const feature = map.queryRenderedFeatures(e.point);
        
                feature.forEach((f) => {
                  console.log(f.layer.source);
                });
        
                if (
                  feature.length === 0 ||
                  feature[0].layer.source !== "billboardPos"
                ) {
                  const placeInfoPaneHeader =
                    '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                  document.getElementById(
                    "place-info-pane"
                  ).innerHTML = `${placeInfoPaneHeader}Chưa có dữ liệu.`;
                }
              });
        })();
    });
}
