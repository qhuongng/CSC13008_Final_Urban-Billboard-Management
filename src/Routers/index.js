const PointRouter = require("./point.routes");
const WardRouter = require("./ward.routes");
const DistrictRouter = require("./district.routes");
const PositionTypeRouter = require("./positionType.routes");
const PanelTypeRouter = require("./panelType.routes");
const AdsFormRouter = require("./adsForm.routes");
const PanelRouter = require("./panel.routes");
const ReportTypeRouter = require("./reportType.routes");
const reportRouter = require("./report.routes");

const routes = (app) => {
    // đường dẫn dùng cho citizen
    app.use("/api/point", PointRouter);
    app.use("/api/ward", WardRouter);
    app.use("/api/district", DistrictRouter);
    app.use("/api/positionType", PositionTypeRouter);
    app.use("/api/panelType", PanelTypeRouter);
    app.use("/api/adsForm", AdsFormRouter);
    app.use("/api/panel", PanelRouter);
    app.use("/api/reportType", ReportTypeRouter);
    app.use("/api/report", reportRouter);
};

module.exports = routes;
