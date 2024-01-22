const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  avatar: { type: String },
  name: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String }, 
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
});


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); 
  }

  try {
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
