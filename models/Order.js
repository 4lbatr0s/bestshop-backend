const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, unique: true },
        products: [ //INFO:how to create an array of object in mongoose Schema.
            {
                productId: {
                    type: String
                },
                quantity: {
                    type: Number,
                    default: 1,
                }
            }
        ],
        amount:{type:Number, required: true},
        address:{type:Object, required:true}, //INFO: an address can have multiple properties, therefore we declare it as an object.
        status: {type:String, default:"pending"}
    },
    { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema);