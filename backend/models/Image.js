const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const imageSchema = mongoose.Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      maxlength: 10,
    },
    description: {
      type: String,
      maxlength: 150,
    },
    filepath: {
      type: String,
    },
    articleUrl: {
      type: String,
      maxlength: 300,
    },
    media: {
      type: String,
    },
    filter: {
      type: String,
    },
  },
  { timestamps: true },
  { versionKey: false }
);

imageSchema.index(
  { title: "text", description: "text" },
  {
    weights: {
      title: 1,
      description: 5,
    },
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = { Image };
