import mongoose from "mongoose";


const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minLength: 2,
        maxLength: 100,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        git
    }
})