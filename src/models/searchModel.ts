import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  word: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Search = mongoose.models.Search || mongoose.model('Search', searchSchema);

export default Search;
