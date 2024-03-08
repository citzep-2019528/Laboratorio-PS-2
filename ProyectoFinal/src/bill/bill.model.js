import { Schema, model } from "mongoose"

const billSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now
    },
    cart: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cart'
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'product'
        },
        quantity: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            //required: true
        }
    }],
    total: {
        type: Number,
        required: true
    }

})

export default model('bill', billSchema)