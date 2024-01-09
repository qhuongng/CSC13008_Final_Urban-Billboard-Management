const PointRouter = require("./point.routes");
const WardRouter = require("./ward.routes");
const DistrictRouter = require("./district.routes");
const PositionTypeRouter = require("./positionType.routes");
const PanelTypeRouter = require("./panelType.routes");
const AdsFormRouter = require("./adsForm.routes");
const PanelRouter = require("./panel.routes");
const ReportTypeRouter = require("./reportType.routes");
const ReportRouter = require("./report.routes");
const ReportImgRouter = require("./reportImg.routes");
const UserRouter = require("./user.routes");
const { authLogin } = require("../Middleware/authLogin");

const routes = (app) => {
  // đường dẫn dùng cho citizen
  app.use("/api/point", PointRouter);
  app.use("/api/ward", WardRouter);
  app.use("/api/district", DistrictRouter);
  app.use("/api/positionType", PositionTypeRouter);
  app.use("/api/adsForm", AdsFormRouter);
  app.use("/api/panel", PanelRouter);
  app.use("/api/panelType", PanelTypeRouter);
  app.use("/api/reportType", ReportTypeRouter);
  app.use("/api/report", ReportRouter);
  app.use("/api/reportImg", ReportImgRouter);
  app.use('/api/user', UserRouter);
  // dùng để render
  app.use('/api/demo', authLogin, (req, res) => {
    res.render('demo')
  });


};

module.exports = routes;
