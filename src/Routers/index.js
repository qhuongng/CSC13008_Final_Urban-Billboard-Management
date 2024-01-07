const ReportRouter = require("./report.routes");

const routes = (app) => {
  app.use("/api/report", ReportRouter);
};

module.exports = routes;
