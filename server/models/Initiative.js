const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const initiativeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    enum: ["training", "collection", "challenge", "awareness", "reduction"],
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  targetParticipants: {
    type: Number,
    default: 0,
  },
  actualParticipants: {
    type: Number,
    default: 0,
  },
  wasteCollected: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["planning", "active", "completed", "cancelled"],
    default: "planning",
  },
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  reportDetails: {
    challenges: {
      type: String,
      default: "",
    },
    lessons: {
      type: String,
      default: "",
    },
    nextSteps: {
      type: String,
      default: "",
    },
    additionalNotes: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Initiative", initiativeSchema);
