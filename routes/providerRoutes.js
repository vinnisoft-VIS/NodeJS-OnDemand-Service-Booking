const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
// const upload = require("../middleware/fileUploadAws");
const provider = require("../controller/providerControllers");
const { isProvider } = require("../middleware/auth");
const {
  isProviderEmailExist,
  verifyProviderOTP,
  checkDocumentStatus,
} = require("../middleware/providerHelper");

// Provider Routes..............................
router.post("/check-email", provider.checkEmailExist);
router.post("/request-otp", isProviderEmailExist, provider.requestOTP);
router.post(
  "/signup",
  isProviderEmailExist,
  verifyProviderOTP,
  provider.createProvider
);
router.post("/login", provider.login);
router.get("/logout", isProvider, provider.logout);
router.get("/my-profile", isProvider, provider.myProfile);
router.put(
  "/update",
  isProvider,
  upload.single("image"),
  provider.updateProvider
);
router.post("/change-password", isProvider, provider.changePassword);

//forget password
router.post("/forget-password", provider.providerForgotPassword);
router.post("/change-forget-password", provider.changeForgetPassword);

//Categories...............
const category = require("../controller/categoryControllers");
router.get("/categories", isProvider, category.Categories);

//Business Setup..........................
const business = require("../controller/businessControllers");
router.post("/create-business", isProvider, business.create);
router.post("/create-business-timings", isProvider, business.addTiming);
router.post(
  "/upload-portfolio",
  isProvider,
  upload.array("files"),
  business.uploadPortFolio
);
router.post(
  "/upload-workplace",
  isProvider,
  upload.array("files"),
  business.uploadWorkplace
);
// ...Services..
router.get("/services", isProvider, business.getMyServices);
router.post("/create-service", isProvider, business.addService);
router.delete("/service/:id", isProvider, business.deleteService);
router.put("/service/:id", isProvider, business.updateService);

router.post(
  "/upload-verification",
  isProvider,
  checkDocumentStatus,
  upload.fields([
    {
      name: "front",
      maxCount: 1,
    },
    {
      name: "back",
      maxCount: 1,
    },
    {
      name: "selfie",
      maxCount: 1,
    },
  ]),
  business.uploadVerification
);

//FeedBack

router.post("/add-feedback", isProvider, provider.AddFeedback)

//Client Routes

router.post("/create-client", isProvider, provider.addClient)
router.get("/get-all-clients", isProvider, provider.getAllClients)
router.get("/client/:id", isProvider, provider.getClient);
router.put("/client/:id", isProvider, provider.updateClient);
router.post(
  "/upload-client-images/:clientId",
  isProvider,
  upload.array("files"),
  provider.uploadImages
);
router.delete("/delete-client/:id", isProvider, provider.deleteClient)




module.exports = router;
