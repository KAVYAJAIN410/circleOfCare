const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: false,
    },
    mobNo: {
      type: Number,
      required: false,
    },
    gender: {
        type: String,
        required: false,
      },
   hasFilledDetails: {
      type: Boolean,
      default: false,
    },
    DailyTask:{
        type: Array,
        default: []
    },
    JournalId:{
        type:Schema.Types.ObjectId
    }
  },
  { collection: "Users" }
);

const Users = mongoose.models.Users || mongoose.model("Users", userSchema);

module.exports = Users;
