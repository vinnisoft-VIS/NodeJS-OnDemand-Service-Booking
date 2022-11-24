const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    default: [0, 0],
  },
});
const businessSchema = new Schema({
  businessName: {
    type: String,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: [true, "providerId is required"],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "categoryId is required"],
  },
  countryCode: {
    type: String,
    required: [true, "Country code is required"],
  },
  mobile: {
    type: String,
    required: [true, "mobile number is required"],
  },
  workType: {
    type: String,
    enum: ["MY_LOCATION", "CLIENT_LOCATION", "BOTH"],
    required: [true, "Work type is required"],
  },
  timings: {
    type: [
      {
        weekDay: {
          type: String,
          default: "null",
        },
        isClosed: {
          type: Boolean,
          default: false,
        },
        startTime: {
          type: String,
          default: null,
        },
        endTime: {
          type: String,
          default: null,
        },
        breakStartTime: {
          type: String,
          default: null,
        },
        breakEndTime: {
          type: String,
          default: null,
        },
      },
    ],
    default: [
      {
        weekDay: "0",
        isClosed: true,
        startTime: "10:00",
        endTime: "18:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "1",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "2",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "3",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "4",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "5",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
      {
        weekDay: "6",
        isClosed: false,
        startTime: "09:00",
        endTime: "17:00",
        breakStartTime: "13:00",
        breakEndTime: "14:00",
      },
    ],
  },
  image: {
    type: String,
    default: null,
  },
  location: {
    type: pointSchema,
  },
  address: {
    line1: {
      type: String,
      default: null,
    },
    line2: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    zipCode: {
      type: String,
      default: null,
    },
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  startingPrice: {
    type: Number,
    default: 0,
  },
  about: {
    type: String,
    default: null,
  },
  instagram: {
    type: String,
    default: null,
  },
  facebook: {
    type: String,
    default: null,
  },
  website: {
    type: String,
    default: null,
  },
  workplace: [
    {
      workPlaceURL: {
        type: String,
      },
    },
  ],
  safetyRules: [
    {
      rule: {
        type: String,
      },
    },
  ],
  venueAmenities: [
    {
      image: {
        type: String,
      },
      amenity: {
        type: String,
      },
    },
  ],
  isPromoted: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: String,
    enum: ["VERIFIED", "SUBMITTED", "NOT_VERIFIED", "REJECTED"],
    default: "NOT_VERIFIED",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isReported: {
    type: Boolean,
    default: false,
  },
  time: { type: Date, default: Date.now },
});
businessSchema.index({ location: "2dsphere" });

const serviceSchema = new Schema({
  serviceName: {
    type: String,
  },
  provider: {
    type: Schema.Types.ObjectId,
    ref: "Provider",
    required: [true, "providerId is required"],
  },
  business: {
    type: Schema.Types.ObjectId,
    ref: "Business",
    required: [true, "businessId is required"],
  },
  priceType: {
    type: String,
    enum: ["FIXED"],
    required: [true, "Price type is required"],
  },
  price: {
    type: Number,
    default: null,
  },
  durationTime: {
    type: Number,
    default: null,
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  time: { type: Date, default: Date.now },
});

const Service = mongoose.model("Service", serviceSchema);
const Business = mongoose.model("Business", businessSchema);

module.exports = { Business, Service };
