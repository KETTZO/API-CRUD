import express from 'express';
import { jsonResponse } from '../lib/jsonResponse.js';
import User from '../schema/user.js';
import mongoose from "mongoose"

const router = express.Router();

router.post("/", (req, res) => {
    const {email, pass} = req.body;

    if(email.length === 0 || pass.length === 0 ){
      return res.status(400).json(jsonResponse(400, {
        error:"Fields are required",
      })
      );
    }
    

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        
        if(user.pass == pass){
          res.status(200).json(jsonResponse(200,{message: user.eventosSeguidos}));
          console.log("Usuario loggeado exitosamente");
        }
        else{
          console.log("Credenciales incorrectas");
          return res.status(401).json(jsonResponse(401, {
            error:"Credenciales incorrectas",
          })
          );
          
        }
      } else {
        // El usuario no fue encontrado
        console.log('Usuario no encontrado');
        return res.status(404).json(jsonResponse(404, {
          error:"No se encontró el usuario",
          
        })
        );
      }
    })
    /*.catch(error => {
      // Manejar cualquier error que ocurra durante la búsqueda
      console.error('Error de búsqueda:', error);
    });
    /*
    try {
      const emailBSON = new mongoose.mongo.BSONPure.ObjectID(email);

      // Utiliza Mongoose para buscar un usuario por nombre de usuario en la base de datos
      const usuario = User.findOne({ "email":emailBSON });

      if(usuario == null){

        if(usuario.pass == pass){
          res.status(200).json(jsonResponse(200,{message: "Se inició sesión correctamente"}));
          res.send("Login");
          console.log("Usuario loggeado exitosamente");
        }
        else{
          console.log("Credenciales incorrectas");
          return res.status(401).json(jsonResponse(401, {
            error:"Credenciales incorrectas",
          })
          );
          
        }

      }
      else{
        console.log("No se encontró el usuario");
        return res.status(404).json(jsonResponse(404, {
          error:"No se encontró el usuario",
          
        })
        );
      }

      // Devuelve el usuario encontrado o null si no se encontró ningún usuario con ese nombre de usuario
      return usuario;
  } catch (error) {
      // Manejo de errores en caso de que ocurra un problema en la búsqueda
      console.error('Error al buscar el usuario:', error);
      return null;
  }*/

});

export default router;