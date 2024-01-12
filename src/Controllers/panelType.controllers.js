const PanelService = require("../Services/panelType.services");

const createTypePan = async (req, res) => {
  try {
    const { panId, panName } = req.body;

    if (!panId || !panName) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await PanelService.createTypePan(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getAllPanelType = async (req, res) => {
  try {
    const response = await PanelService.getAllPanelType();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const updatePanelType = async (req, res) => {
  try {
    const { id, editedData } = req.body;
    console.log(id, editedData);
    return res.status(200).json({
      message: "OK",
    });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
module.exports = {
  createTypePan,
  getAllPanelType,
  updatePanelType,
};
