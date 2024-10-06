const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, require: true, unique: true },
        mobile: { type: Number, require: true, unique: true },
        password: { type: String, require: true, },
        isAdmin: { type: Boolean, default: false },
        cart: [
            {
                _id: { type: String },
                title: { type: String, required: true},
                desc: { type: String, require: true},
                img: { type: String, require: true, },
                categories: { type: Array },
                quantity: { type: Array },
                size: { type: Array },
                color: { type: Array },
                price: { type: Number, require: true, },
                inStock: { type: Boolean, default: true }
            },
        ],
        cartAmount: { type: Number, default: 0, min: 0 },
        wishlist: [
            {
                _id: { type: String },
                title: { type: String, required: true, unique: true },
                desc: { type: String, require: true, unique: true },
                img: { type: String, require: true, },
                categories: { type: Array },
                quantity: { type: Array },
                size: { type: Array },
                color: { type: Array },
                price: { type: Number, require: true, },
                inStock: { type: Boolean, default: true }
            },
        ],
        orders: { type: Array, default: null },
        img: { type: String }
    }, { timestamps: true }
)

module.exports = mongoose.model("User", UserSchema)