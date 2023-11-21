import express from 'express';
import { jsonResponse } from '../lib/jsonResponse.js';
import User from '../schema/user.js';
const router = express.Router();

router.post("/", async (req, res) => {
  
  const {aliasUser, email, pass, name, avatar} = req.body;

  const jsonv = JSON.stringify(req.body);

  if(!!!aliasUser || !!!email || !!!pass || !!!name){
    console.log(req.body)
    return res.status(400).json(jsonResponse(400, {
      error:"Fields are required req.body:" + jsonv,
    })
    );
    
  }

  try{
    const updatedUser = await User.findOneAndUpdate(
        { email: email }, // Condición de búsqueda
        { aliasUser, pass, name, avatar }, // Datos de actualización
        { new: true, runValidators: true } // Opciones: new devuelve el documento actualizado, runValidators ejecuta validadores del esquema
      );
  
      if (!updatedUser) {
        console.log('Usuario no encontrado');
        return res.status(404).json({ message: 'No se encontró el usuario.' });
      }
  
      console.log('Usuario actualizado');
      return res.status(200).json("Usuario actualizado");
  }
  catch(error){
    console.error('Error al procesar la solicitud:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }


});

export default router;