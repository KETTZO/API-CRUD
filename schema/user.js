import mongoose, { Mongoose } from "mongoose";
import Event from './event.js';

const { Schema } = mongoose;

const UserSchema = new mongoose.Schema({
    id:{type: Object},
    aliasUser:{type:String, required: true},
    email:{type:String, required: true, unique: true},
    pass:{type:String, required: true},
    name:{type:String, required: true},
    avatar:Buffer,
    eventosSeguidos: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
})


const UserModel = mongoose.model('User', UserSchema);

export default UserModel;