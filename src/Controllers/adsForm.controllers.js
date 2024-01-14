const adsFormService = require("../Services/adsForm.services");

const createForm = async (req, res) => {
  try {
    const { formId, formName } = req.body;

    if (!formId || !formName) {
      return res.status(404).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await adsFormService.createForm(req.body);
    //sau khi lấy xong sẽ không return về data nữa mà chỉnh data cho phù hợp với FE rồi render và gắn data cho FE
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllForm = async (req, res) => {
  try {
    const response = await adsFormService.getAllForm();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createForm,
  getAllForm,
};
