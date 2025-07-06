const mongoose = require("mongoose");

const StakeSchema = new mongoose.Schema(
  {
    purchase_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Purchase",
      required: true,
    },
    voting_power: { type: Number, required: true },
    apr: { type: Number, required: true },
    lock_end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["locked", "unlocked", "withdrawn"],
      default: "locked",
    },
    rewards_earned: { type: Number, default: 0 },
    transaction_hash: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Stake", StakeSchema);
