const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    image: { type: String, required:true },
    categories: { type:Array},//INFO: Array type of schema.
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required:true },
    inStock: {type:Boolean, default:true}
    },
    {timestamps:true} 
)

module.exports = mongoose.model("Product", ProductSchema);