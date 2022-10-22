const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema(
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
        ]
    },
    { timestamps: true }
)

module.exports = mongoose.model("Cart", CartSchema);