const mongoose = require("mongoose");

const DonationSchema = new mongoose.Schema(
  {
    donor_address: { type: String, required: true, lowercase: true },
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    amount: { type: Number, required: true },
    transaction_hash: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("Donation", DonationSchema);
