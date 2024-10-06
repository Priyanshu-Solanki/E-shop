const mongoose = require("mongoose")

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                _id: { type: String, required: true },
                title: { type: String, required: true, },
                desc: { type: String, require: true, },
                img: { type: String, require: true, },
                categories: { type: Array },
                size: { type: Array },
                color: { type: Array },
                price: { type: Number, require: true, },
                inStock: { type: Boolean, default: true },
                quantity: { type: Number, default: 1 }
            }
        ],
        date : {type : String},
        amount: { type: Number, required: true },
        address: { type: Object, default: "IND" },
        status: { type: String, default: "pending" },
    }, { timestamps: true }
)

module.exports = mongoose.model("Order", OrderSchema)