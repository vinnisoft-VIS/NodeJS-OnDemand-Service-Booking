const { ObjectId } = require("mongodb");
const router = {};
const { Business, Service } = require("../models/business");
const { Liked, LikedPortfolio } = require("../models/liked");
const RecentSearch = require("../models/search");
const Review = require("../models/review");
const Portfolio = require("../models/portfolio");
const Provider = require("../models/provider");
const Verification = require("../models/verification");
const { success, error } = require("../lib/response");
const Report = require("../models/reports");

//Provider controllers..............................................................................................
router.create = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let {
      businessName,
      provider,
      category,
      countryCode,
      mobile,
      workType,
      location,
      address,
    } = req.body;

    let info = {
      businessName,
      provider: providerId,
      category,
      countryCode,
      mobile,
      workType,
      location,
      address,
    };
    let data;
    data = await Business.findOneAndUpdate({ provider: providerId }, info, {
      new: true,
    });
    if (!data) {
      data = await Business.create(info);
    }
    if (data) {
      return res.json(await success("Business created successfully", data));
    } else {
      return res.status(400).json(await error("bad request", info));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.addTiming = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let { timings } = req.body;

    let data = await Business.findOneAndUpdate(
      { provider: providerId },
      { timings },
      {
        new: true,
      }
    );
    if (data) {
      return res.json(await success("Timings added successfully", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.uploadPortFolio = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let portfolio = [];
    let business = await Business.findOne({ provider: providerId });
    if (req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        portfolio.push({
          businessId: business._id,
          portfolioURL: req.files[i].path,
        });
      }
    }
    let data = await Portfolio.create(portfolio);
    return res.status(200).json(await success("PortFolio Uploaded", data));
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.uploadWorkplace = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let workplace = [];
    if (req.files.length) {
      for (let i = 0; i < req.files.length; i++) {
        workplace.push({ workPlaceURL: req.files[i].path });
      }
    }
    let data = await Business.findOneAndUpdate(
      { provider: providerId },
      { $push: { workplace: workplace } },
      {
        new: true,
      }
    );
    return res.status(200).json(await success("WorkPlace Uploaded", data));
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.uploadVerification = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let obj = {};
    if (req.files && req.files.front.length) {
      obj.front = req.files.front[0].path;
    }
    if (req.files && req.files.back.length) {
      obj.back = req.files.back[0].path;
    }
    if (req.files && req.files.selfie.length) {
      obj.selfie = req.files.selfie[0].path;
    }
    let data = await Verification.findOneAndUpdate({ providerId }, obj);
    if (!data) {
      obj.providerId = providerId;
      data = await Verification.create(obj);
    }
    if (data) {
      let info = await Business.findOneAndUpdate(
        { provider: providerId },
        { isVerified: "SUBMITTED" },
        { new: true }
      );
      return res
        .status(200)
        .json(await success("Verification Documents Uploaded", data));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.getMyServices = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;

    let data = await Service.find({
      provider: providerId,
      isDeleted: false,
      isBlocked: false,
    });
    if (data) {
      return res.json(await success("All Services", data));
    } else {
      return res.status(400).json(await error("bad request", {}));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.addService = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let obj = req.body;
    let business = await Business.findOne({ provider: providerId });
    if (business) {
      obj.provider = providerId;
      obj.business = business._id;
      let data = await Service.create(obj);
      if (data) {
        _upadateStartingPrice(obj.business);
        return res.json(await success("Service created successfully", data));
      } else {
        return res.status(400).json(await error("bad request", {}));
      }
    } else {
      return res
        .status(400)
        .json(await error("Please Create business First", {}));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.updateService = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let id = req.params.id;
    let obj = req.body;
    let data = await Service.updateOne({ _id: id, provider: providerId }, obj);

    if (data) {
      return res.json(await success("Service updated successfully", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.deleteService = async (req, res) => {
  try {
    let providerId = req.decoded.providerId;
    let id = req.params.id;
    let data = await Service.updateOne(
      { _id: id, provider: providerId },
      { isDeleted: true }
    );

    if (data) {
      return res.json(await success("Service deleted successfully", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
//User controllers..................................................................................................
// let userId = req.decoded.userId;
router.getBusinesses = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let minDis = 0;
    let maxDis = 10000;
    let {
      location,
      search,
      categoryId,
      isPromoted,
      isLatest,
      minDistance,
      maxDistance,
      minPrice,
      maxPrice,
      rating,
    } = req.body;
    // "search":"moh",
    // "isLatest":true,
    // "categoryId": "63311946b6a986286ba7cf24",
    // "isPromoted":true

    let loc = [];
    let distanceField = [];
    let conditions = [
      {
        $match: {
          isBlocked: false,
          // isVerified: "VERIFIED",
        },
      },
    ];
    // **********************Filter On Location***********************
    if (maxDistance) {
      maxDis = maxDistance;
    }
    if (minDistance) {
      minDis = minDistance;
    }
    if (location && location.lat && location.long) {
      loc.push({
        $geoNear: {
          near: { type: "Point", coordinates: [location.lat, location.long] },
          key: "location",
          maxDistance: maxDis * 1609.34,
          minDistance: minDis * 1609.34,
          distanceField: "distance",
          distanceMultiplier: 1 / 1609.34,
          spherical: true,
        },
      });
    } else {
      distanceField.push({
        $addFields: {
          distance: 0,
        },
      });
    }

    // *********************Search******************************
    if (search && search.length > 2) {
      conditions.push({
        $match: {
          businessName: { $regex: search, $options: "i" },
        },
      });
      // Add serached keyword in recent search
      let findInDB = await RecentSearch.find({ keyword: search, userId });
      if (!findInDB.length) {
        let addInDB = await RecentSearch.create({ keyword: search, userId });
      }
    }
    // **********************Filter On Rating*********************
    if (rating) {
      conditions.push({
        $match: {
          rating: { $gte: rating },
        },
      });
    }
    // **********************Filter On Price***********************
    if (minPrice) {
      conditions.push({
        $match: {
          startingPrice: { $gte: minPrice },
        },
      });
    }
    if (maxPrice) {
      conditions.push({
        $match: {
          startingPrice: { $lte: maxPrice },
        },
      });
    }
    // **********************Filter On Category***********************
    if (categoryId) {
      conditions.push({
        $match: {
          category: ObjectId(categoryId),
        },
      });
    }
    if (isPromoted) {
      conditions.push({
        $match: {
          isPromoted: true,
        },
      });
    }

    if (isLatest) {
      conditions.push({
        $sort: {
          time: -1,
        },
      });
    }
    // **********************Execute The final query**********************
    let data = await Business.aggregate([
      ...loc,
      {
        $lookup: {
          from: Liked.collection.name,
          localField: "_id",
          foreignField: "businessId",
          pipeline: [{ $match: { userId: ObjectId(userId) } }],
          as: "likes",
        },
      },
      {
        $addFields: {
          isLiked: { $size: "$likes" },
          image: { $first: "$workplace" },
        },
      },
      ...distanceField,
      ...conditions,
      {
        $project: {
          businessName: true,
          rating: true,
          startingPrice: true,
          image: true,
          category: true,
          address: true,
          isPromoted: true,
          distance: true,
          isLiked: true,
          reviewCount: true,
        },
      },
    ]);
    if (data) {
      return res.json(await success("All businesses", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
//****************Get One Business Details**************
router.getBusiness = async (req, res) => {
  false;
  try {
    let userId = req.decoded.userId;
    let businessId = req.params.id;

    let data = await Business.aggregate([
      {
        $match: {
          _id: ObjectId(businessId),
        },
      },
      {
        $lookup: {
          from: Service.collection.name,
          localField: "_id",
          foreignField: "business",
          pipeline: [{ $match: { isBlocked: false, isDeleted: false } }],
          as: "services",
        },
      },
      {
        $lookup: {
          from: Liked.collection.name,
          localField: "_id",
          foreignField: "businessId",
          pipeline: [{ $match: { userId: ObjectId(userId) } }],
          as: "likes",
        },
      },
      {
        $lookup: {
          from: Provider.collection.name,
          localField: "provider",
          foreignField: "_id",
          pipeline: [{ $project: { image: true } }],
          as: "provider",
        },
      },
      {
        $addFields: {
          isLiked: { $size: "$likes" },
          services: "$services",
          provider: { $first: "$provider" },
        },
      },
      {
        $project: {
          provider: true,
          businessName: true,
          rating: true,
          address: true,
          location: true,
          isPromoted: true,
          isLiked: true,
          reviewCount: true,
          services: true,
          about: true,
          instagram: true,
          facebook: true,
          website: true,
          workplace: true,
          timings: true,
          countryCode: true,
          mobile: true,
          safetyRules: true,
          venueAmenities: true,
        },
      },
    ]);

    if (data) {
      data = data[0];
      return res.json(await success("Business Info", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.addReview = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let obj = req.body;
    obj.user = userId;
    let data;
    data = await Review.findOneAndUpdate(
      {
        businessId: obj.businessId,
        user: userId,
      },
      obj,
      { new: true }
    );
    if (!data) {
      data = await Review.create(obj);
    }

    if (data) {
      await _updateRatings(obj.businessId);
      return res.json(await success("Review added successfully", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};

router.addBusinessReport = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let obj = req.body;
    obj.user = userId;
    let data;
    data = await Report.findOneAndUpdate(
      {
        businessId: obj.businessId,
        user: userId,
      },
      obj,
      { new: true }
    );
    if (!data) {
      data = await Report.create(obj);
    }

    if (data) {
      return res.json(await success("Report added successfully", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.getBusinessReport = async (req, res) => {
  try {
    let businessId = req.params.id;

    let report = await Report.find({
      businessId,
    }).populate("businessId", "businessName provider");

    if (report) {
      return res.json(
        await success("Bussiness Report", {
          report,
        })
      );
    } else {
      return res.status(400).json(await error("bad request", {}));
    }
  } catch (err) {
    res.status(500).json(await error(err.message, err));
  }
};

router.getAllBusinessReport = async (req, res) => {
  try {
    let userId = req.decoded.userId;

    let report = await Report.find({ userId }).populate(
      "businessId",
      "businessName provider"
    );

    if (report) {
      return res.json(
        await success(" All Bussiness Reports Info", {
          report,
        })
      );
    } else {
      return res.status(400).json(await error("bad request", {}));
    }
  } catch (err) {
    res.status(500).json(await error(err.message, err));
  }
};

router.getBusinessReview = async (req, res) => {
  try {
    let businessId = req.params.id;
    let reviews = await Review.find({ businessId }).populate(
      "user",
      "firstName lastName image"
    );
    let ratingCountByGroup = await Review.aggregate([
      {
        $match: {
          businessId: ObjectId(businessId),
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);
    let ratingCount = await Review.aggregate([
      {
        $match: {
          businessId: ObjectId(businessId),
        },
      },
      {
        $group: {
          _id: "$businessId",
          rating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (reviews) {
      return res.json(
        await success("Bussiness Review", {
          reviews,
          ratingCountByGroup,
          ratingCount,
        })
      );
    } else {
      return res.status(400).json(await error("bad request", {}));
    }
  } catch (err) {
    res.status(500).json(await error(err.message, err));
  }
};
router.getBusinessPortFolio = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let businessId = req.params.id;
    let data = await Portfolio.aggregate([
      {
        $lookup: {
          from: LikedPortfolio.collection.name,
          localField: "_id",
          foreignField: "portfolioId",
          pipeline: [{ $match: { userId: ObjectId(userId) } }],
          as: "isLiked",
        },
      },
      {
        $lookup: {
          from: LikedPortfolio.collection.name,
          localField: "_id",
          foreignField: "portfolioId",
          as: "likes",
        },
      },
      {
        $addFields: {
          isLiked: { $size: "$isLiked" },
          likesCount: { $size: "$likes" },
        },
      },
      {
        $project: {
          portfolioURL: true,
          isLiked: true,
          likesCount: true,
        },
      },
    ]);

    if (data) {
      return res.json(await success("Bussiness Portfolio", data));
    } else {
      return res.status(400).json(await error("bad request", timings));
    }
  } catch (err) {
    res.status(500).json(await error(err.message, err));
  }
};
router.likeUnlikePortfolio = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let portfolioId = req.params.id;

    //TRY_TO_REMOVE_FIRST if condition-matched means now unliked
    let removed = await LikedPortfolio.deleteOne({ userId, portfolioId });
    if (removed.deletedCount) {
      return res.status(200).json(
        await success("Unliked ", {
          isLiked: 0,
        })
      );
    }
    //if not removed means, add in liked
    else {
      let add = await LikedPortfolio.create({ userId, portfolioId });
      if (add) {
        return res.status(200).json(
          await success("Liked", {
            isLiked: 1,
          })
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
router.likeUnlike = async (req, res) => {
  try {
    let userId = req.decoded.userId;
    let businessId = req.params.id;

    //TRY_TO_REMOVE_FIRST if condition-matched means now unliked
    let removed = await Liked.deleteOne({ userId, businessId });
    console.log("removed", removed);
    if (removed.deletedCount) {
      return res.status(200).json(
        await success("Unliked ", {
          isLiked: 0,
        })
      );
    }
    //if not removed means, add in liked
    else {
      let add = await Liked.create({ userId, businessId });
      if (add) {
        return res.status(200).json(
          await success("Liked", {
            isLiked: 1,
          })
        );
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
//Admin controllers.................................................................................................
router.adminVerifyBusiness = async (req, res) => {
  try {
    let businessId = req.params.businessId;
    let isVerified = req.body.isVerified;
    let info = await Business.findOneAndUpdate(
      { _id: businessId },
      { isVerified },
      { new: true }
    );
    if (info) {
      //TODO:
      // if (info.isVerified === "REJECTED") {
      //  Send Push notification to provider.
      // }
      return res
        .status(200)
        .json(await success("Business verification status updated", info));
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(await error(err.message, err));
  }
};
module.exports = router;

_upadateStartingPrice = async (bussinessId) => {
  try {
    let data = await Service.aggregate([
      {
        $match: { business: ObjectId(bussinessId) },
      },
      {
        $group: {
          _id: "$business",
          startingPrice: { $min: "$price" },
        },
      },
    ]);
    if (data.length) {
      data = data[0];
      await Business.updateOne({ _id: data._id }, data);
    }
  } catch (err) {
    console.log(err);
  }
};
_updateRatings = async (businessId) => {
  try {
    let data = await Review.aggregate([
      {
        $match: { businessId: ObjectId(businessId) },
      },
      {
        $group: {
          _id: "$businessId",
          rating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);
    if (data.length) {
      data = data[0];
      await Business.updateOne({ _id: data._id }, data);
    }
  } catch (err) {
    console.log(err);
  }
};
