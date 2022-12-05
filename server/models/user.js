// Configuro el schema de mongoose
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

// min y max pone limite al largo del dato, required lo hace obligatorio y unique que no se repita nunca. A su vez, default me da la opción de tener un valor por defecto en caso de que no envien nada.
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