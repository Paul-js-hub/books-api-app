import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true
    }
});

const user = mongoose.model('User', userSchema);
export default user;