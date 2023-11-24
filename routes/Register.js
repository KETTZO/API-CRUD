import express from 'express';
import { jsonResponse } from '../lib/jsonResponse.js';
import User from '../schema/user.js';
const router = express.Router();

router.post("/", (req, res) => {
  
  const {aliasUser, email, pass} = req.body;

  const jsonv = JSON.stringify(req.body);

  if(!!!aliasUser || !!!email || !!!pass){
    console.log(req.body)
    return res.status(400).json(jsonResponse(400, {
      error:"Fields are required req.body:" + jsonv,
    })
    );
    
  }

    // Verificar si el email ya existe en la base de datos
    const existingUser = User.findOne({ email });

    if (existingUser) {
      console.log("Email already exists: " + email);
      return res.status(409).json(
        jsonResponse(409, {
          error: "Email already exists: " + email,
        })
      );
    }

  const usuario = new User(req.body);

  usuario.save()
  .then(() => {
    console.log("Usuario guardado exitosamente");
    //crear usuario
    res.status(200).json(jsonResponse(200,{message: "User created successfully"}));
  })
  .catch((error) => {
    console.error("Error al guardar el usuario:", error);
  });

});

export default router;