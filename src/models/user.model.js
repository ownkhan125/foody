import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
 
    authProvider: {
        type: String,
        default: null,
    },

    image: {
        type: String,
        required: false
    },

});

export const User = mongoose.models.users || mongoose.model('users', UserSchema)