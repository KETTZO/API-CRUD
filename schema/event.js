import mongoose, { Mongoose } from "mongoose";

const EventSchema = new mongoose.Schema({
    id:{type: Object},
    hora:{type:String, required: true},
    fecha:{type:String, required: true},
    duelo:{type:String, required: true},
    juego:{type:String, required: true},
    desc:{type:String, required: true},
    image:Buffer,
})


const EventModel = mongoose.model('Event', EventSchema);

export default EventModel;