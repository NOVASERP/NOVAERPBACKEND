const mongoose = require('mongoose');
mongoose.pluralize(null);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['Admin', 'Teacher', 'Student', 'Parent'] },
  associatedId: mongoose.Schema.Types.ObjectId, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
