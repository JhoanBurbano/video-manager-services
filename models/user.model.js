const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  avatar: { type: String },
  name: { type: String },
  lastname: { type: String },
  email: { type: String },
  password: { type: String }, // Cambiado a String para almacenar la contraseña encriptada
  media: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
});

// Antes de guardar el usuario en la base de datos, encripta la contraseña
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next(); // Si la contraseña no ha cambiado, no es necesario encriptarla nuevamente
  }

  try {
    // Genera un salt (valor aleatorio) y usa bcrypt para hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);

    // Reemplaza la contraseña sin encriptar con la encriptada
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Compara la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
