const express = require("express")
const app = express()
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const userRoute = require("./routes/user")
const authRoute = require("./routes/auth")
const cartRoute = require("./routes/cart")
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order")
const wishlistRoute = require("./routes/wishlist")
const cors = require("cors")

dotenv.config()

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Database Connected")
}).catch((e) => {
    console.log(e);
})

app.use(cors());
app.use(express.json())
app.use("/api/users", userRoute)
app.use("/api/auth", authRoute)
app.use("/api/products", productRoute)
app.use("/api/orders", orderRoute)
app.use("/api/cart", cartRoute)
app.use("/api/wishlist", wishlistRoute)


app.listen(process.env.PORT || 5000, () => {
    console.log("Port 5000")
})