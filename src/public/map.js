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
    const toggleableLayerIds = ["unclustered-point", "unclustered-point-zoned", "reported-point"];

    for (const id of toggleableLayerIds) {
        if (document.getElementById(id)) {
            continue;
        }

        const link = document.createElement("div");
        link.id = id;

        link.innerHTML = `<label class="switch"><input type="checkbox" id="${id}-checkbox" checked/><span class="slider"></span></label><p>${id === "unclustered-point-zoned" ? "ĐIỂM ĐẶT ĐÃ QUY HOẠCH" : id === "unclustered-point" ? "ĐIỂM ĐẶT CHƯA QUY HOẠCH" : "BÁO CÁO VI PHẠM"}</p>`;

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
                checkbox.checked = false; // Uncheck the checkbox
                toggleLayerVisibility(clickedLayer, "none");
            } else {
                checkbox.checked = true; // Check the checkbox
                toggleLayerVisibility(clickedLayer, "visible");
            }

            map.triggerRepaint();
        };
    }
}

function toggleLayerVisibility(clickedLayer, visibility) {
    if (clickedLayer === "unclustered-point") {
        map.setLayoutProperty("unclustered-point-label", "visibility", visibility);
        map.setLayoutProperty("unclustered-point", "visibility", visibility);
        map.setLayoutProperty("clusters", "visibility", visibility);
        map.setLayoutProperty("cluster-count", "visibility", visibility);
    } else if (clickedLayer === "unclustered-point-zoned") {
        map.setLayoutProperty("unclustered-point-zoned-label", "visibility", visibility);
        map.setLayoutProperty("unclustered-point-zoned", "visibility", visibility);
        map.setLayoutProperty("clusters", "visibility", visibility);
        map.setLayoutProperty("cluster-count", "visibility", visibility);
    }
    else {
        map.setLayoutProperty("reported-point", "visibility", visibility);
        map.setLayoutProperty("free-point", "visibility", visibility);
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

    geocoder.on('result', (e) => {
        // clear all the info panes if they exist
        document.getElementById("billboard-container").innerHTML = "";

        if (marker) {
            marker.remove();
        }

        var billboardInfoPaneExists = document.getElementById("billboard-info-pane");

        if (!billboardInfoPaneExists) {
            const div = document.createElement("div");
            div.setAttribute("id", "billboard-info-pane");
            div.setAttribute("class", "card border-info text-info mb-3");

            document.getElementById("billboard-container").appendChild(div);
        }

        document.getElementById("billboard-info-pane").innerHTML = `<div class="card-body">
                                                                                        <h5 class="card-title">
                                                                                        <i class="bi bi-info-circle"></i>
                                                                                         Thông tin bảng quảng cáo
                                                                                        </h5>
                                                                                        <p class="card-text">Chưa có dữ liệu.</p>
                                                                                    </div>`;

        reverseGeocode({ lng: e.result.center[0], lat: e.result.center[1] }, false);
    });

    map.on("style.load", () => {
        map.on("click", (e) => {
            // clear all the info panes if they exist
            document.getElementById("billboard-container").innerHTML = "";

            if (marker) {
                marker.remove();
            }

            marker = new mapboxgl.Marker({ color: "#0000ff" })
                .setLngLat(e.lngLat)
                .addTo(map);

            map.easeTo({
                center: e.lngLat,
            });

            var billboardInfoPaneExists = document.getElementById("billboard-info-pane");

            if (!billboardInfoPaneExists) {
                const div = document.createElement("div");
                div.setAttribute("id", "billboard-info-pane");
                div.setAttribute("class", "card border-info text-info mb-3");

                document.getElementById("billboard-container").appendChild(div);
            }

            document.getElementById("billboard-info-pane").innerHTML = `<div class="card-body">
                                                                                            <h5 class="card-title">
                                                                                            <i class="bi bi-info-circle"></i>
                                                                                             Thông tin bảng quảng cáo
                                                                                            </h5>
                                                                                            <p class="card-text">Chưa có dữ liệu.</p>
                                                                                        </div>`;

            var features = map.queryRenderedFeatures(e.point);
            var isFreeReportedPoint = false;

            if (features[0] !== undefined && features[0].properties.name !== undefined) {
                if (features[0].layer.id == "unclustered-point" || features[0].layer.id == "unclustered-point-label" || features[0].layer.id == "reported-point" || features[0].layer.id == "unclustered-point-zoned" || features[0].layer.id == "unclustered-point-zoned-label") {
                    return;
                }

                if (features[0].layer.id == "free-point") {
                    isFreeReportedPoint = true;
                }

                reverseGeocode(e.lngLat, isFreeReportedPoint);
            } else {
                document.getElementById("place-info-pane").innerHTML = `<div class="card-body">
                                                                            <h5 class="card-title">
                                                                            <i class="bi bi-info-circle"></i>
                                                                             Thông tin địa điểm
                                                                            </h5>
                                                                            <p class="card-text">Chưa có dữ liệu.</p>
                                                                        </div>`;
            }
        });
    });

    map.on("load", () => {
        //add bottomController
        bottomController();

        let dbPointJson;
        let freePointJson;
        let localReports = [];

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
                let report = null;
                let isReportedAtPanelLevel = false;
                let coords = [pointData[i].locate[0], pointData[i].locate[1]];

                for (let j = 0; j < reportData.length; j++) {
                    if (reportData[j]) {
                        report = localStorage.getItem(reportData[j]._id);
                        localReports.push(reportData[j]._id);

                        if (report) {
                            if (JSON.parse(report).locate[0] == coords[0] && JSON.parse(report).locate[1] == coords[1]) {
                                // nếu là report của ĐỊA ĐIỂM thì add
                                if (JSON.parse(report).idPanel === "1") {
                                    // update tình trạng xử lí                            
                                    localStorage.setItem(JSON.parse(report)._id, report);
                                    break;
                                }
                                else {
                                    // report là của biển quảng cáo
                                    isReportedAtPanelLevel = true;
                                }
                            }
                        }
                    }

                    report = null;
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
                        isReportedAtPanelLevel: isReportedAtPanelLevel,
                        pointReport: (report !== null) ? report : 0,
                        havePanel: pointData[i].havePanel
                    },
                };

                dbPointJson.features.push(point);
            }

            // hide the loading panel and display info panels
            document.getElementById("loading-pane").style.display = "none";
            document.getElementById("place-container").style.display = "block";
            document.getElementById("billboard-container").style.display = "block";

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
                                actionHandler: reportJson.actionHandler,
                                address: reportJson.address,
                                district: reportJson.district,
                                ward: reportJson.ward,
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
                            "visibility": "visible"
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
                layout: {
                    "visibility": "visible"
                },
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
                    "visibility": "visible",
                    "text-field": ["get", "point_count_abbreviated"],
                    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
                    "text-size": ["step", ["get", "point_count"], 12, 3, 16, 6, 20]
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
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "#0000ff",
                    "circle-radius": 10,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
            },
            );

            map.addLayer({
                id: "unclustered-point",
                type: "circle",
                source: "billboardPos",
                filter: [
                    "all",
                    ["!", ["has", "point_count"]],
                    ["==", ["get", "isZoning"], false],
                ],
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "#8f8f8f",
                    "circle-radius": 10,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
            },
            );

            map.addLayer({
                id: "reported-point",
                type: "circle",
                source: "billboardPos",
                filter: ["all", ["!", ["has", "point_count"]], ["any", ["!=", ["get", "pointReport"], 0], ["==", ["get", "isReportedAtPanelLevel"], true]]],
                layout: {
                    "visibility": "visible"
                },
                paint: {
                    "circle-color": "#ff0000",
                    "circle-radius": 10,
                    "circle-stroke-width": 1,
                    "circle-stroke-color": "#ffffff",
                },
            },
            );

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
                    "visibility": "visible",
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
                    "visibility": "visible",
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

            map.on("mouseenter", ["unclustered-point", "unclustered-point-zoned", "reported-point"], (e) => {
                const coordinates = e.features[0].geometry.coordinates.slice();
                const long = e.features[0].properties.long;
                const lat = e.features[0].properties.lat;
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

            map.on("click", ["unclustered-point", "unclustered-point-zoned", "reported-point"], (e) => {
                const props = e.features[0].properties;

                const pointId = props.id;
                const billboardType = props.billboardType;
                const positionType = props.positionType;
                const long = props.long;
                const lat = props.lat;
                const district = JSON.parse(props.area).district;
                const ward = JSON.parse(props.area).ward;
                const address = `${props.address}<br>${ward}, ${district}`;
                const addressURL = `${props.address.trim()}, ${ward}, ${district}`;
                const imgUrl = `https://drive.google.com/uc?id=${props.picturePoint}`;
                const placeInfoPaneHeader = `<div class="card-body">
                                                <h5 class="card-title">
                                                    <i class="bi bi-info-circle"></i>
                                                     Thông tin địa điểm
                                                </h5>`

                if (e.features[0].properties.pointReport === 0) {
                    const reportButton =
                        `<a class="btn btn-outline-danger float-right" href="/api/report/${1}?address=${addressURL}&lng=${long}&lat=${lat}&district=${district}&ward=${ward}">
                            <i class="bi bi-exclamation-octagon-fill"></i>
                            BÁO CÁO VI PHẠM
                         </a>`;

                    document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}
                                                                            <p class="card-text">
                                                                                <strong>${props.name}</strong><br>
                                                                                ${address}<br><br>
                                                                                <img class="img-fluid" src=${imgUrl} alt=""><br><br>
                                                                                ${reportButton}
                                                                            </p>`;

                }
                else {
                    // lấy report
                    let pointReport = JSON.parse(props.pointReport);

                    const reportInfo = {
                        name: pointReport.name,
                        email: pointReport.email,
                        phone: pointReport.phone,
                        reportType: pointReport.reportType,
                        reportImgId: pointReport.reportPicture,
                        content: pointReport.content,
                        address: pointReport.address,
                        state: pointReport.state,
                        actionHandler: pointReport.actionHandler
                    };

                    const viewReportButton =
                        `<button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#report-info-modal" onclick="loadReportDetail('${JSON.stringify(reportInfo).replace(/"/g, '&quot;')}', false)">
                            <i class="bi bi-exclamation-octagon-fill"></i>
                            XEM BÁO CÁO
                        </button>`;

                    document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}<br>
                                                                        <strong>${props.name}</strong><br>
                                                                        ${address}<br><br>
                                                                        <img class="img-fluid" src=${imgUrl} alt=""><br><br>
                                                                        <p style="color:red"><em>Điểm này đã được báo cáo.</em></p>
                                                                        ${viewReportButton}`;
                }


                map.easeTo({
                    center: [long, lat],
                });

                fetch(`http://localhost:3500/api/panel/getListPanel/${pointId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.data && data.data.length > 0) {
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
                                    lat: lat,
                                    panelReport: 0
                                };

                                for (let i = 0; i < localReports.length; i++) {
                                    const report = localStorage.getItem(localReports[i]);

                                    if (report) {
                                        if (JSON.parse(report).idPanel == info.panelId) {
                                            info.panelReport = report;
                                        }
                                    }
                                }

                                if (info.panelReport === 0) {
                                    if (!(map.getLayoutProperty("unclustered-point", "visibility") !== "visible" && map.getLayoutProperty("unclustered-point-zoned", "visibility") !== "visible")) {
                                        const reportButton = `<a id="panel-report-button" class="btn btn-outline-danger float-right" href="/api/report/${panelId}?address=${addressURL}&lng=${long}&lat=${lat}&district=${district}&ward=${ward}">
                                                                <i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM
                                                                </a>`;

                                        cardHtml += `<div class="card mb-3" id="billboard-info" key=${index}>
                                            <div class="card-body">
                                                <h5 class="card-title">${item.Paneltype}</h5>
                                                <h6 class="card-subtitle mb-2 text-muted">${address}</h6>
                                                <p class="card-text">Kích thước: ${item.size}<br>
                                                    Số lượng: ${item.amount}<br>
                                                    Hình thức: <b>${billboardType}</b><br>
                                                    Phân loại: <b>${positionType}</b></p>
                                                <a href="#" data-toggle="modal" data-target="#billboard-info-modal" onclick="loadPanelDetail('${JSON.stringify(info).replace(/"/g, '&quot;')}')">
                                                    <i class="bi bi-info-circle"></i>
                                                </a>
                                                ${reportButton}
                                            </div>
                                        </div>`
                                    }
                                }
                                else {
                                    if (map.getLayoutProperty("reported-point", "visibility") == "visible") {                                   // lấy report
                                        let panelReport = JSON.parse(info.panelReport);

                                        const reportInfo = {
                                            name: panelReport.name,
                                            email: panelReport.email,
                                            phone: panelReport.phone,
                                            reportType: panelReport.reportType,
                                            reportImgId: panelReport.reportPicture,
                                            content: panelReport.content,
                                            address: panelReport.address,
                                            state: panelReport.state,
                                            actionHandler: panelReport.actionHandler
                                        };

                                        const viewReportButton =
                                            `<button class="btn btn-outline-primary float-right" data-toggle="modal" data-target="#report-info-modal" onclick="loadReportDetail('${JSON.stringify(reportInfo).replace(/"/g, '&quot;')}', false)">
                                                <i class="bi bi-exclamation-octagon-fill"></i>
                                                XEM BÁO CÁO
                                            </button>`;

                                        cardHtml += `<div class="card mb-3" id="billboard-info" key=${index}>
                                                        <div class="card-body">
                                                            <h5 class="card-title">${item.Paneltype}</h5>
                                                            <h6 class="card-subtitle mb-2 text-muted">${address}</h6>
                                                            <p class="card-text">Kích thước: ${item.size}<br>
                                                                Số lượng: ${item.amount}<br>
                                                                Hình thức: <b>${billboardType}</b><br>
                                                                Phân loại: <b>${positionType}</b></p>
                                                                <p style="color:red"><em>Bảng quảng cáo này đã được báo cáo.</em></p>
                                                            <a href="#" data-toggle="modal" data-target="#billboard-info-modal" onclick="loadPanelDetail('${JSON.stringify(info).replace(/"/g, '&quot;')}')">
                                                                <i class="bi bi-info-circle"></i>
                                                            </a>
                                                            ${viewReportButton}
                                                        </div>
                                                    </div>`}
                                }
                            });

                            document.getElementById("billboard-container").innerHTML = cardHtml;
                        }
                        else {
                            // clear all the info panes if they exist
                            document.getElementById("billboard-container").innerHTML = "";

                            var billboardInfoPaneExists = document.getElementById("billboard-info-pane");

                            if (!billboardInfoPaneExists) {
                                const div = document.createElement("div");
                                div.setAttribute("id", "billboard-info-pane");
                                div.setAttribute("class", "card border-info text-info mb-3");

                                document.getElementById("billboard-container").appendChild(div);
                            }

                            document.getElementById("billboard-info-pane").innerHTML = `<div class="card-body">
                                                                                            <h5 class="card-title">
                                                                                            <i class="bi bi-info-circle"></i>
                                                                                             Thông tin bảng quảng cáo
                                                                                            </h5>
                                                                                            <p class="card-text">Chưa có dữ liệu.</p>
                                                                                        </div>`;
                        }
                    });
            });

            map.on("mouseleave", ["unclustered-point", "unclustered-point-zoned", "reported-point"], () => {
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

            map.on("click", "free-point", (e) => {
                const props = e.features[0].properties;

                const reportInfo = {
                    name: props.name,
                    email: props.email,
                    phone: props.phone,
                    reportType: props.reportType,
                    reportImgId: JSON.parse(props.reportPicture),
                    content: props.content,
                    address: props.address,
                    state: props.state,
                    actionHandler: props.actionHandler
                };

                $('#free-report-info-modal').on('shown.bs.modal', function () {
                    loadReportDetail(JSON.stringify(reportInfo).replace(/"/g, '&quot;'), true);
                });

                $('#free-report-info-modal').modal('show');
            });

            map.on("mouseleave", "free-point", () => {
                map.getCanvas().style.cursor = "";
                popup.remove();
            });
        })();
    });
}

function reverseGeocode(lngLat, isFreeReportedPoint) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lngLat.lng},${lngLat.lat}.json?access_token=${mapboxgl.accessToken}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            if (data.features && data.features.length > 0) {
                const [name, ...addressParts] = data.features[0].place_name.split(",");
                const address = addressParts.join(",").trim();
                const placeInfoPaneHeader = `<div class="card-body">
                                                <h5 class="card-title">
                                                    <i class="bi bi-info-circle"></i>
                                                    Thông tin địa điểm
                                                </h5>`;

                if (!isFreeReportedPoint) {
                    const reportButton = `<a id="free-point-report-button float-right" class="btn btn-outline-danger float-right" href="/api/report/${0}?address=${data.features[0].place_name}&lng=${lngLat.lng}&lat=${lngLat.lat}&district=${data.features[0].context[2].text}&ward=${data.features[0].context[0].text}">
                                            <i class="bi bi-exclamation-octagon-fill"></i> BÁO CÁO VI PHẠM</a>`;

                    document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}
                                                                            <p class="card-text">
                                                                                <strong>${name}</strong><br>
                                                                                ${address}<br><br>
                                                                                ${reportButton}
                                                                            </p>
                                                                            `;
                } else {
                    document.getElementById("place-info-pane").innerHTML = `${placeInfoPaneHeader}
                                                                                <p class="card-text">
                                                                                <strong>${name}</strong><br>
                                                                                ${address}<br><br>
                                                                                <em style="color:red">Điểm này đã được báo cáo.</em>
                                                                            </p>`;
                }

            } else {
                console.log("No address found");
            }
        })
        .catch((error) => {
            console.log("Error:", error);
        });
}
