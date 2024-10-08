const mongoose = require("mongoose")

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, require: true, unique: true },
        img: { type: String, require: true, },
        categories: { type: Array},
        size: { type: Array },
        color: { type: Array },
        price: { type: Number, require: true, },
        inStock : {type: Boolean, default : true}
    }, { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema)