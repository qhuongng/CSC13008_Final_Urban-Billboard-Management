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

        link.innerHTML = `<label class="switch"><input type="checkbox" id="${id}-checkbox" checked/><span class="slider"></span></label><p>${id === "billboard" ? "BẢNG QUẢNG CÁO" : "BÁO CÁO VI PHẠM"}</p>`;

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
        map.setLayoutProperty(
            "unclustered-point-label-reported",
            "visibility",
            visibility
        );
        map.setLayoutProperty(
            "unclustered-point-reported",
            "visibility",
            visibility
        );
    }
}

async function loadPoints() {
    return fetch("http://localhost:3500/api/point/getAllPoint")
        .then((response) => response.json())
        .then((data) => data.data)
}

async function loadReports() {
    return fetch("http://localhost:3500/api/report/getAllReport")
        .then((response) => response.json())
        .then((data) => data.data)
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
            // clear all the info panes if they exist
            document.getElementById("billboard-container").innerHTML = "";

            var features = map.queryRenderedFeatures(e.point);

            if (features[0] !== undefined && features[0].properties.name !== undefined) {
                if (features[0].layer.id == "unclustered-point" || features[0].layer.id == "unclustered-point-label" || features[0].layer.id == "free-point") {
                    return;
                }

                var url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${features[0].properties.name}.json?access_token=${mapboxgl.accessToken}`;

                fetch(url)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.features && data.features.length > 0) {
                            const address = data.features[0].place_name;
                            const placeInfoPaneHeader = '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                            const reportButton = `<a href="/api/report?address=${encodeURIComponent(address)}" class="btn btn-sm btn-outline-danger"><i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</a>`;

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
            } else {
                const placeInfoPaneHeader =
                    '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                document.getElementById(
                    "place-info-pane"
                ).innerHTML = `${placeInfoPaneHeader}Chưa có dữ liệu.`;
            }
        });
    });

    map.on("load", () => {
        //add bottomController
        bottomController();

        let dbPointJson;
        let freePointJson;

        (async () => {
            let pointData = await loadPoints();
            let reportData = await loadReports();

            dbPointJson = {
                features: [],
            };

            freePointJson = {
                features: [],
            };

            for (let i = 0; i < pointData.length; i++) {
                let reported = false;
                let coords = [pointData[i].locate[0], pointData[i].locate[1]];

                for (let j = 0; j < reportData.length; j++) {
                    if (reportData[j]) {
                        let report = localStorage.getItem(reportData[j]._id);

                        if (report) {
                            if (JSON.parse(report).locate[0] == coords[0] && JSON.parse(report).locate[1] == coords[1]) {
                                reported = true;

                                // update tình trạng xử lí                            
                                localStorage.setItem(report._id, JSON.stringify(report));
                                break;
                            }
                        }
                    }
                }

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
                            ward: pointData[i].area.ward,
                            district: pointData[i].area.district,
                        },
                        isZoning: pointData[i].isZoning,
                        picturePoint: pointData[i].picturePoint,
                        long: pointData[i].locate[0],
                        lat: pointData[i].locate[1],
                        isReported: (reported === true) ? 1 : 0
                    },
                };

                dbPointJson.features.push(point);
            }

            for (let i = 0; i < reportData.length; i++) {
                if (reportData[i]) {
                    let report = localStorage.getItem(reportData[i]._id);

                    if (report && JSON.parse(report).idPanel == 0) {
                        let reportJson = JSON.parse(report);

                        let point = {
                            type: "Feature",
                            geometry: {
                                type: "Point",
                                coordinates: reportJson.locate,
                            },
                            properties: {
                                long: reportJson.locate[0],
                                lat: reportJson.locate[1],
                                reportId: reportJson._id,
                                reportType: reportJson.reportType,
                                name: reportJson.name,
                                email: reportJson.email,
                                phone: reportJson.phone,
                                content: reportJson.content,
                                reportPicture: reportJson.reportPicture,
                                state: reportJson.state,
                                actionHandler: reportJson.actionHandler
                            },
                        };

                        freePointJson.features.push(point);
                    }
                }
            }

            map.addSource("billboardPos", {
                type: "geojson",
                data: dbPointJson,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
            });

            map.loadImage(
                "/free-point.png",
                (error, image) => {
                    if (error) throw error;

                    // Add the image to the map style.
                    map.addImage('free-point', image);

                    // Add a data source containing one point feature.
                    map.addSource("freePos", {
                        type: "geojson",
                        data: freePointJson,
                        cluster: true,
                        clusterMaxZoom: 14, // Max zoom to cluster points on
                        clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
                    });

                    // Add a layer to use the image to represent the data.
                    map.addLayer({
                        id: "free-point",
                        type: "symbol",
                        source: "freePos",
                        layout: {
                            "icon-image": 'free-point',
                        }
                    },
                        "clusters"
                    );
                }
            );

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
                filter: [
                    "all",
                    ["!", ["has", "point_count"]],
                    ["==", ["get", "isZoning"], true],
                ],
                layout: {
                    "text-field": "QC",
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Regular"],
                    "text-size": 10,
                },
                paint: {
                    "text-color": "#ffffff",
                },
            });

            map.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "billboardPos",
                filter: ["!", ["has", "point_count"]],
                paint: {
                    "circle-color": ["match", ["get", "isReported"], 0, "#0000ff", "#ff0000"],
                    "circle-radius": 10,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
            },
                "unclustered-point-label"
            );

            map.addLayer({
                id: "billboard",
                type: "circle",
                source: "billboardPos",
                filter: [
                    "all",
                    ["!", ["has", "point_count"]],
                    ["==", ["get", "reported"], 1],
                ],
            },
                "unclustered-point"
            );

            // inspect a cluster on click
            map.on("click", "clusters", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["clusters"],
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

            map.on("mouseenter", "unclustered-point", (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const long = e.features[0].properties.long;
                const lat = e.features[0].properties.lat;
                const isZoning = e.features[0].properties.isZoning === true ? "ĐÃ QUY HOẠCH" : "CHƯA QUY HOẠCH";
                const description = `<strong>${e.features[0].properties.billboardType}</strong><br>
                                        ${e.features[0].properties.positionType}<br>
                                        ${e.features[0].properties.address}<br>
                                        ${JSON.parse(e.features[0].properties.area).ward}, ${JSON.parse(e.features[0].properties.area).district}<br>
                                        <strong><em>${isZoning}</em></strong><br>${long}, ${lat}`;

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
                const billboardType = e.features[0].properties.billboardType;
                const positionType = e.features[0].properties.positionType;
                const long = e.features[0].properties.long;
                const lat = e.features[0].properties.lat;
                const district = JSON.parse(e.features[0].properties.area).district;
                const ward = JSON.parse(e.features[0].properties.area).ward;
                const address = `${e.features[0].properties.address}<br>${ward}, ${district}`;
                const addressURL = `${e.features[0].properties.address.trim()}, ${ward}, ${district}`;
                const imgUrl = `https://drive.google.com/uc?id=${e.features[0].properties.picturePoint}`;
                const placeInfoPaneHeader =
                    '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';

                const reportButton =
                    `<a class="btn btn-outline-danger" href="/api/report/${1}?address=${addressURL}&lng=${long}&lat=${lat}&district=${district}&ward=${ward}"><i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</a>`;

                document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br>
                                                                        <strong>${e.features[0].properties.name}</strong><br>
                                                                        ${address}<br><br>
                                                                        <img class="img-fluid" src=${imgUrl} alt=""><br><br>
                                                                        ${reportButton}`;

                map.easeTo({
                    center: [long, lat],
                });

                fetch(`http://localhost:3500/api/panel/getListPanel/${pointId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.data && data.data.length > 0) {
                            console.log(data.data);

                            // check if default info pane ("chưa có dữ liệu") exists
                            var billboardInfoPaneExists = document.getElementById("billboard-info-pane");

                            // remove it
                            if (billboardInfoPaneExists) {
                                document.getElementById("billboard-info-pane").remove();
                            }

                            // clear all the info panes if they exist
                            document.getElementById("billboard-container").innerHTML = "";


                            let cardHtml = "";

                            data.data.map((item, index) => {
                                const panelId = item._id;
                                const reportButton = `<a class="btn btn-outline-danger float-right" href="/api/report/${panelId}?address=${addressURL}&lng=${long}&lat=${lat}&district=${district}&ward=${ward}">
                                                        <i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM
                                                        </a>`;

                                const info = {
                                    Paneltype: item.Paneltype,
                                    address: addressURL,
                                    size: item.size,
                                    amount: item.amount,
                                    billboardType: billboardType,
                                    positionType: positionType,
                                    expDate: item.expDate,
                                    picturePanel: item.picturePanel,
                                    panelId: item._id,
                                    long: long,
                                    lat: lat
                                };

                                cardHtml += `<div class="card mb-3" id="billboard-info" key=${index}>
                                            <div class="card-body">
                                                <h5 class="card-title">${item.Paneltype}</h5>
                                                <h6 class="card-subtitle mb-2 text-muted">${address}</h6>
                                                <p class="card-text">Kích thước: ${item.size}<br>
                                                    Số lượng: ${item.amount}<br>
                                                    Hình thức: <b>${billboardType}</b><br>
                                                    Phân loại: <b>${positionType}</b></p>
                                                <a href="#" data-toggle="modal" data-target="#info-modal" onclick="loadPanelDetail('${JSON.stringify(info).replace(/"/g, '&quot;')}')">
                                                    <i class="bi bi-info-circle"></i>
                                                </a>
                                                ${reportButton}
                                            </div>
                                        </div>`
                            })

                            document.getElementById("billboard-container").innerHTML = cardHtml;
                        }
                        else {
                            // clear all the info panes if they exist
                            document.getElementById("billboard-container").innerHTML = "";
                            var billboardInfoPaneExists = document.getElementById("billboard-info-pane");

                            if (!billboardInfoPaneExists) {
                                const div = document.createElement("div");
                                div.setAttribute("id", "billboard-info-pane");
                                div.setAttribute("class", "alert alert-info");
                                div.setAttribute("role", "alert");

                                document.getElementById("billboard-container").appendChild(div);
                            }

                            document.getElementById("billboard-info-pane").innerHTML = `<h5 class="alert-heading">
                                                                                            <i class="bi bi-info-circle"></i>
                                                                                            Thông tin bảng quảng cáo
                                                                                        </h5>
                                                                                        Chưa có dữ liệu.`
                        }
                    });
            });

            map.on("mouseleave", "unclustered-point", () => {
                map.getCanvas().style.cursor = "";
                popup.remove();
            });

            map.on("mouseenter", "free-point", (e) => {
                map.getCanvas().style.cursor = "pointer";
                const coordinates = e.features[0].geometry.coordinates.slice();
                const long = e.features[0].properties.long;
                const lat = e.features[0].properties.lat;
                const description = `<strong>Điểm được bạn báo cáo</strong><br>
                                                Tình trạng: <b>${e.features[0].properties.actionHandler}</b><br><br>
                                                <em>Bấm để xem chi tiết</em>`;

                // Ensure that if the map is zoomed out such that
                // multiple copies of the feature are visible, the
                // popup appears over the copy being pointed to.
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }

                popup.setLngLat(coordinates).setHTML(description).addTo(map);
            });

            map.on("mouseleave", "free-point", () => {
                map.getCanvas().style.cursor = "";
                popup.remove();
            });

            map.on("click", (e) => {
                const feature = map.queryRenderedFeatures(e.point);

                if (feature.length === 0 || feature[0].layer.source !== "billboardPos") {
                    if (marker) {
                        marker.remove();
                    }

                    marker = new mapboxgl.Marker({ color: "#0000ff" })
                        .setLngLat(e.lngLat)
                        .addTo(map);

                    reverseGeocode(e.lngLat);
                }
            });
        })();
    });
}

function reverseGeocode(lngLat) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(lngLat.lng);
            if (data.features && data.features.length > 0) {
                const [name, ...addressParts] = data.features[0].place_name.split(",");
                const address = addressParts.join(",").trim();
                const placeInfoPaneHeader = '<h5 class="alert-heading"><i class="bi bi-check2-circle"></i> Thông tin địa điểm</h5>';
                const reportButton = `<a class="btn btn-outline-danger" href="/api/report/${0}?address=${data.features[0].place_name}&lng=${lngLat.lng}&lat=${lngLat.lat}&district=${data.features[0].context[2].text}&ward=${data.features[0].context[0].text}"><i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</a>`;

                document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br><strong>${address}</strong><br><br>${reportButton}`;
                document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br><strong>${name}</strong><br>${address}<br><br>${reportButton}`;
            } else {
                console.log("No address found");
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}
