import mongoose, { Types } from "mongoose";


const ProductSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },

    name: {
        type: String,
        unique: true,
        required: true,
        set: (value) => value.trim(),
    },

    price: {
        type: Number,
        required: true,
        set: (value) => value.trim(),
    },


    image: {
        type: String,
        required: false,
        default: null,
    },

    ingredients: [
        {
            name: { type: String, required: true },
            quantity: { type: String, required: true }
        }
    ],

    time: {
        hours: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 },
    },



    deletedAt: {
        type: Date,
        expires: "1m",
        default: null
    }

}, { timestamps: true });

export const Product = mongoose.models.products || mongoose.model('products', ProductSchema)