import mongoose, { Mongoose } from "mongoose";

const AdminSchema = new mongoose.Schema({
    id:{type: Object},
    email:{type:String, required: true, unique: true},
    pass:{type:String, required: true},
})

const AdminModel = mongoose.model('Admin', AdminSchema,"admin");

export default AdminModel;