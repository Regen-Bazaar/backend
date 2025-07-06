const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    category: String,
    funding_goal: { type: Number, required: true },
    current_funding: { type: Number, default: 0 },
    impact_value: { type: Number, default: 0 },
    image_url: String,
    seller_address: { type: String, required: true, lowercase: true }, // wallet address of seller
    organization_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    date_listed: { type: Date, default: Date.now },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Project", ProjectSchema);
