const Provider = require("../models/provider");
const { Business } = require("../models/business");
const Otp = require("../models/otp");
const { success, error } = require("../lib/response");
module.exports = {
  isProviderEmailExist: async (req, res, next) => {
    try {
      let { email } = req.body;
      const results = await Provider.find({ email });
      console.log(results);
      if (results.length) {
        return res
          .status(200)
          .json(await error("Email is already in use.", {}));
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(await error(err.message, err));
    }
  },
  verifyProviderOTP: async (req, res, next) => {
    try {
      let { email, otp } = req.body;
      const results = await Otp.findOne({ email, otptype: 2 }).exec();
      console.log(results);
      if (results && results.otpcode == otp) {
        next();
      } else {
        return res.status(200).json(await error("OTP is not correct", {}));
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(await error(err.message, err));
    }
  },
  checkDocumentStatus: async (req, res, next) => {
    try {
      let providerId = req.decoded.providerId;
      let data = await Business.findOne({ provider: providerId });
      if (data.isVerified === "SUBMITTED") {
        return res
          .status(200)
          .json(await error("Documents Already Submitted", {}));
      } else if (data.isVerified === "VERIFIED") {
        return res
          .status(200)
          .json(await error("Business Already Verified", {}));
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      res.status(500).json(await error(err.message, err));
    }
  },
};
