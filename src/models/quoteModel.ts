import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
  },
  quoteText: {
    type: String,
    required: true,
  },
  author: String,
}, {
  timestamps: true,
});

const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);

export default Quote;
