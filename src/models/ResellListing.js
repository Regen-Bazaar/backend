const mongoose = require("mongoose");

const ResellListingSchema = new mongoose.Schema(
  {
    purchase_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["listed", "sold", "cancelled"],
      default: "listed",
    },
    transaction_hash: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ResellListing", ResellListingSchema);
