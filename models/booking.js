const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var bookingSchema = new Schema({
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
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "userId is required"],
  },
  bookingDate: {
    type: Date,
    required: [true, "bookingDate is required"],
  },
  bookingTime: {
    type: {
      startTime: {
        type: String,
        default: null,
      },
      endTime: {
        type: String,
        default: null,
      },
    },
  },
  services: {
    type: [
      {
        serviceName: {
          type: String,
        },
        price: {
          type: Number,
          default: null,
        },
        durationTime: {
          type: Number,
          default: null,
        },
      },
    ],
  },
  address: {
    type: {
      line1: {
        type: String,
      },
      price: {
        type: Number,
        default: null,
      },
      durationTime: {
        type: Number,
        default: null,
      },
    },
  },
  totalAmount: {
    type: Number,
  },
  preBookFees: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["UNCONFIRMED", "CONFIRMED", "IN_PROGRESS", "CANCELLED", "COMPLETED"],
    default: "NOT_VERIFIED",
  },
  time: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
