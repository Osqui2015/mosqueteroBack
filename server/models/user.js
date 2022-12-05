// Configuro el schema de mongoose
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 4,
    max: 12,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 128,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tokens: {
    type: String,
    default: '',
  },
});

export default mongoose.model('appuser', userSchema)