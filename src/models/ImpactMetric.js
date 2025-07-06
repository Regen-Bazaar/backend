const mongoose = require("mongoose");

const ImpactMetricSchema = new mongoose.Schema(
  {
    project_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    metric_type: { type: String, required: true }, // e.g., 'CO2_saved', 'trees_planted'
    value: { type: Number, required: true },
    recorded_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

module.exports = mongoose.model("ImpactMetric", ImpactMetricSchema);
