const mongoose = require('mongoose')
const panelSchema = new mongoose.Schema(
    {
        panId: { type: String, required: true },
        panName: { type: String, required: true },
    }
);

const PanelType = mongoose.model("PanelType", panelSchema);
module.exports = PanelType;