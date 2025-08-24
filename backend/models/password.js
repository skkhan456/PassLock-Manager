const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  site: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

const PasswordModel = mongoose.model('password', passwordSchema);
module.exports = PasswordModel;
