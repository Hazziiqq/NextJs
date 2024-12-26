import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  quoteText: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, 
});

const Favorite = mongoose.models.Favorite || mongoose.model("Favorite", favSchema);

export default Favorite;
