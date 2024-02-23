import mongoose, { Schema } from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    category:{
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    }

})

export default mongoose.model('product', productSchema)
