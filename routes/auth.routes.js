const express = require('express');
const { isAuth, login, register } = require('../services/user.services');

const router = express.Router();

router.get('/isValid', async (req, res, next) => {
  try {
    const isValidToken = await isAuth(req.headers["x-token"])
    console.log('isValidToken :>> ', isValidToken);
    res.status(isValidToken ? 200 : 500).json({data: isValidToken})
  } catch (error) {
    res.status(500).json({message: "Hubo un error al traer la data"})
  }
})

router.post("/login", async (req, res) => {
    try {
    const token = await login(req.body)
    if(!token) {
        return res.status(404).json({ message: 'Credenciales invalidas'})
    }
    return res.status(200).json({token})

    } catch (error) {
    res.status(500).json({message: "Credenciales invalidas"})
        
    }
})


router.post('/register', async (req, res) => {
    try {
      const token = await register(req.body);
  
      if (!token) {
        return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
      }
  
      return res.status(201).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error en el servidor.' });
    }
  });


module.exports = router;
