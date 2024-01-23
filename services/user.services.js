const { Types } = require("mongoose");
const User = require("../models/user.model");
const { verifyToken, generateToken } = require("./jwt.service");

const isAuth = async (token) => {
  try {
    const {id} = verifyToken(token);
    const user = await User.findById(id);
    return !!user;
  } catch (error) {
    console.error(error);
  }
};

const login = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return null;
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return null;

    return generateToken({ id: user._id }, "24h");
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const register = async ({ avatar, name, lastname, email, password }) => {
    try {
  
      const newUser = new User({
        avatar,
        name,
        lastname,
        email,
        password,
      });
  
      await newUser.save();
  
      const token = generateToken({ id: newUser._id }, '24h');
  
      return token;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addMedia = async (userId, mediaIds) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { media: { $each: mediaIds.map((mediaId) => new Types.ObjectId(mediaId)) } } },
        { new: true }
      );
  
      if (!updatedUser) {
        throw new Error('Usuario no encontrado');
      }
  
      return updatedUser;
    } catch (error) {
      console.error('Error al agregar media al usuario:', error);
      throw error;
    }
  };

  const getUserData = async (id) => {
    try {
        return await User.findById(id, { password: 0 });
    } catch (error) {
        throw new Error (error)
    }
  }

module.exports = {
  isAuth,
  login,
  register,
  addMedia,
  getUserData
};
