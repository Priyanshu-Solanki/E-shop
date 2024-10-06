const mongoose = require("mongoose")

const CartSchema = new mongoose.Schema(
    {
      userId: { type: String, required: true },
      products: [
        {
          productId: { type: String, required: true },  // Reference to the product
          title: { type: String, required: true },  // Store relevant details at purchase time
          price: { type: Number, required: true },  // Store price snapshot
          quantity: {
            type: Number,
            default: 1,
          },
          size: { type: String },  // Store selected size
          color: { type: String }, 
          img : {type : String} // Store selected color
        },
      ],
      amount: {
        type: Number,
        default: 0,
      },
    },
    { timestamps: true }
  );
  
  module.exports = mongoose.model("Cart", CartSchema);