const PointRouter = require("./point.routes");
const WardRouter = require("./ward.routes");
const DistrictRouter = require("./district.routes");
const PositionTypeRouter = require("./positionType.routes");
const AdsFormRouter = require("./adsForm.routes");

const routes = (app) => {
    // đường dẫn dùng cho citizen
    app.use("/api/point", PointRouter);
    app.use("/api/ward", WardRouter);
    app.use("/api/district", DistrictRouter);
    app.use("/api/positionType", PositionTypeRouter);
    app.use("/api/adsForm", AdsFormRouter);
};

module.exports = routes;
