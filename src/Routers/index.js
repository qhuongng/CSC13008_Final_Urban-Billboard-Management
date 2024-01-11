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
const OtpRouter = require('./otp.routes');
const controlWardDistrictRouter = require('./controlward_district.routes');

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
  app.use('/api/otp', OtpRouter);
  app.use('/api/controlWardDistrict', controlWardDistrictRouter);
  //


  app.get("/", (req, res) => {
    const navItemDepartment = [
      { link: "/api/controlWardDistrict", label: "Quản lí Phường, Quận" },
      { link: "#", label: "Quản lí loại hình quảng cáo" },
      { link: "#", label: "Quản lí hình thức báo cáo" },
      { link: "#", label: "Quản lí điểm đặt quảng cáo" },
      { link: "#", label: "Quản lí bảng quảng cáo" },
      { link: "#", label: "Xét duyệt yêu cầu chỉnh sửa" },
      { link: "#", label: "Xét duyệt yêu cầu cấp phép" },
      { link: "#", label: "Thống kê báo cáo" },
      { link: "#", label: "Tạo tài khoản cán bộ" },
      { link: "#", label: "Phân công khu vực" },
    ];
    const navItemAnother = [
      { link: "#", label: "Thống kê điểm đặt, biển quảng cáo" },
      { link: "#", label: "Gửi yêu cầu chỉnh sửa" },
      { link: "#", label: "Xử lí báo cáo" },
      { link: "#", label: "Tạo yêu cầu cấp phép quảng cáo" },
    ];
    if (res.locals.auth == false) {
      res.render("viewUser/login", {
        layout: false
      });
    } else {
      res.render("index", {
        authUserRole: JSON.stringify(res.locals.authUser)
      });
    }
  });
};

module.exports = routes;
