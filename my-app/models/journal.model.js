const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const journalSchema = new Schema(
  {
    createdAt: {
        type: Date,
        default: Date.now,
      },
      description:{
        type:String,
        
      },
      userId: {
  type: Schema.Types.ObjectId,
  ref: "User", // Assuming "User" is your user model's name
  required: true
}

  },
  { collection: "Journal" }
);

const Journal = mongoose.models.Journal || mongoose.model("Journal", journalSchema);

module.exports = Journal;
