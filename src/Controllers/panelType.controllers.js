const PanelService = require("../Services/panelType.services");

const createTypePanel = async (req, res) => {
  try {
    const panName = req.body.panName;
    const response = await PanelService.createTypePan(panName);
    if (response.status === "ERR") {
      return res.status(205).json(response);
    }
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
    const { id, panName } = req.body;
    const response = await PanelService.updatePanelType(id, panName);
    if (response.status === "OK") {
      return res.status(200).json(response);
    } else {
      return res.status(205).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deletePanelType = async (req, res) => {
  try {
    const id = req.body.id;
    const response = await PanelService.deletePanelType(id);
    console.log(response);
    if (response.status === "OK") {
      return res.status(200).json(response);
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
}

module.exports = {
  createTypePanel,
  getAllPanelType,
  updatePanelType,
  deletePanelType
};
