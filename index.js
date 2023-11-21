import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from 'dotenv';
import Admin from './schema/admin.js';
import User from './schema/user.js';
import Event from './schema/event.js';
import { jsonResponse } from './lib/jsonResponse.js';

//routes
import registerRouter from './routes/Register.js';
import loginRouter from './routes/Login.js';
import updatedUserRouter from './routes/updateUser.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// Aumentar el límite del cuerpo de la solicitud
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
dotenv.config();

async function main(){
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log('Connected to mongodb');
}

main().catch(console.error);

app.use("/api/Register", registerRouter);
app.use("/api/Login", loginRouter);
app.use("/api/updateUser", updatedUserRouter);

app.get("/", (req, res) => {
    res.send("conectado")
})

app.get("/api/getUser", (req, res) => {
 
  const email = req.query.searchTerm;

  User.findOne({ email: email })
  .then(user => {
    if (user) {
      res.status(200).json(user);
    } else {
      // El usuario no fue encontrado
      console.log('Usuario no encontrado');
      return res.status(404).json(jsonResponse(404, {
        error:"No se encontró el usuario",
        
      })
      );
    }
  })
  
})

app.post("/api/loginAdmin", (req, res) => {
    const {email, pass} = req.body;

    console.log(email + ' ' + pass)
    if(email.length === 0 || pass.length === 0 ){
      return res.status(400).json(jsonResponse(400, {
        error:"Fields are required",
      })
      );
    }

    Admin.findOne({ email: email })
    .then(admin => {
      if (admin) {
        
        if(admin.pass == pass){
          res.status(200).json(jsonResponse(200,{message: "Se inició sesión correctamente"}));
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
    
})

app.post("/api/Event", (req, res) => {
  const {hora, fecha, duelo, juego, desc, image} = req.body;

  if(hora.length === 0 || fecha.length === 0 || duelo.length === 0 || juego.length === 0 || desc.length === 0 || image.length === 0){
    return res.status(400).json(jsonResponse(400, {
      error:"Fields are required",
    })
    );
  }
  
  const event = new Event(req.body);

  event.save()
  .then(() => {
    console.log("Usuario guardado exitosamente");
    res.status(200).json(jsonResponse(200,{message: "User created successfully"}));
  })
  .catch((error) => {
    console.error("Error al guardar el usuario:", error);

    return res.status(400).json(jsonResponse(400, {
      error:"Error al guardar Evento",
    })
    );
  });

})

app.get("/api/Event", async (req, res) => {
  /*const fechaActual = new Date();
  const dia = fechaActual.getDate().toString().padStart(2, '0');
  const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Nota: Los meses en JavaScript comienzan desde 0
  const anio = fechaActual.getFullYear();

  const fechaEnFormatoDeseado = `${anio}-${mes}-${dia}`;*/

  try {

    /*const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Realiza la consulta en la base de datos
    const registros = await Event.find({ fecha: { $gte: formattedDate } });
    //const registros = await Event.find({ duelo: "T1 vs EC" });*/

    //console.log(JSON.stringify(registros));

    const currentDateTime = new Date();

    // Obtén la fecha en formato "YYYY-MM-DD"
    const currentDateString = currentDateTime.toISOString().split('T')[0];
    
    // Obtén la hora en formato "HH:mm"
    const currentHour = currentDateTime.getHours();
    const currentMinute = currentDateTime.getMinutes();
    const currentHourMinute = `${currentHour}:${currentMinute}`;
    
    // Realiza la consulta en MongoDB
    const registros = await Event.find({
      $or: [
        {
          fecha: { $gt: currentDateString },
        },
        {
          fecha: currentDateString,
          hora: { $gte: currentHourMinute },
        },
      ],
    });
    if (registros.length === 0) {
      console.log(JSON.stringify(registros))
      return res.status(404).json({ message: 'No se encontraron registros desde la fecha especificada.' });
    }

    res.status(200).json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en la consulta.' });
  }

})

app.get("/api/EventFiltered", async (req, res) => {

  const keyword = req.query.searchTerm;
  try {

    // Realiza la consulta en la base de datos
    const registros = await Event.find({
      $or: [
        { duelo: { $regex: keyword, $options: "i" } }, // Busca en el atributo title
        { juego: { $regex: keyword, $options: "i" } }, // Busca en el atributo content
      ],
    })

    if (registros.length === 0) {
      console.log(JSON.stringify(registros))
      return res.status(404).json({ message: 'No se encontraron registros desde la fecha especificada.' });
    }

    res.status(200).json(registros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en la consulta.' });
  }

})

app.get("/api/EventTracking", async (req, res) => {

  const email = req.query.idUser;

  try {
    const user = await User.findOne({ email: email }).populate('eventosSeguidos');
    
    if (user) {
      const eventosSeguidos = user.eventosSeguidos;
      res.status(200).json({ eventosSeguidos });
    } else {
      console.log('Usuario no encontrado');
      res.status(404).json({ message: 'No se encontró el usuario.' });
    }
  } catch (err) {
    console.error('Error al buscar usuario:', err);
    res.status(500).json({ message: 'Error en la consulta.' });
  }

})

app.post("/api/EventTracking", async (req, res) => {

  const {email, event} = req.body;

  User.findOneAndUpdate(
    { email: email },
    { $push: { eventosSeguidos: event } },
    { new: true },
  )
    .then(updatedUser => {
      if (updatedUser) {
        // El usuario fue encontrado y el evento se agregó a eventosSeguidos
        console.log('Usuario encontrado y evento agregado: ' + updatedUser);
        res.status(200).json("Evento seguido");
      } else {
        // El usuario no fue encontrado
        console.log('Usuario no encontrado');
        res.status(402).json({ message: 'No se encontró el usuario o el evento' });
      }
    })
    .catch(error => {
      // Manejo de errores
      console.error('Error al agregar evento:', error);
      res.status(500).json({ message: 'Error en la consulta.' });
    });

})

app.listen(port, () =>{
    console.log("Server is listinig the port 5000")
});
