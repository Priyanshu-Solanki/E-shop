const router = require("express").Router()

const Cart = require("../models/Cart")
const User = require("../models/User")
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken")

//create
// router.post("/", verifyToken, async (req, res) => {
//     try {
//         const newCart = new Cart({
//             userId: req.body.id
//         });

//         const savedCart = await newCart.save();
//         res.status(200).json(savedCart);
//     } catch (e) {
//         console.error("Error creating cart:", e);
//         res.status(500).json(e);
//     }
// });

router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const productIndex = user.cart.findIndex(
            item => item._id === req.body.product._id
                && item.color[0] == req.body.product.color
                && item.size[0] == req.body.product.size
        );

        if (productIndex != -1) {
            user.cart[productIndex].quantity[0] += req.body.product.quantity
            user.cartAmount += req.body.amount
            await user.save()
            res.status(200).json("Done")
        }
        else {
            user.cart.push(req.body.product)
            user.cartAmount += req.body.amount
            await user.save()
            res.status(200).json("Done")
        }

    } catch (e) {
        res.status(500).json(e)
    }
})

//update
// router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
//     try {
//         const cart = await Cart.findOne({ userId: req.params.id });
//         if (!cart) {
//             return res.status(404).json("Cart not found");
//         }

//         const { product } = req.body;
//         const existingProductIndex = cart.products.findIndex(
//             (p) => p.productId === product._id && p.size === product.size && p.color === product.color
//         );

//         if (existingProductIndex !== -1) {
//             // Product exists in cart, update quantity
//             cart.products[existingProductIndex].quantity += product.quantity;
//         } else {
//             // New product, push it to the cart
//             cart.products.push({
//                 productId: product._id,
//                 title: product.title,
//                 price: product.price,
//                 size: product.size,
//                 color: product.color,
//                 quantity: product.quantity,
//                 img: product.img,
//             });
//         }

//         // Update the total amount
//         cart.amount += product.price * product.quantity;

//         // Save the updated cart
//         const updatedCart = await cart.save();
//         res.status(200).json(updatedCart);

//     } catch (e) {
//         console.error("Error updating cart:", e);
//         res.status(500).json(e);
//     }
// });

//delete
// router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
//     try {
//         await Cart.findByIdAndDelete(req.params.id)
//         res.status(200).json("Cart Deleted Successfully")
//     } catch (e) {
//         res.status(500).json(e)
//     }
// })

//removeFromCart
router.post("/:id/remove", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const productIndex = user.cart.findIndex(
            item => item._id === req.body._id
                && item.color[0] == req.body.color
                && item.size[0] == req.body.size
        );

        console.log(productIndex)

        if (productIndex != -1) {
            user.cart.splice(productIndex, 1);
            user.cartAmount = Math.max(0, user.cartAmount - (req.body.price * req.body.quantity));
            await user.save();
            res.status(200).json("Product removed from cart");
        } else {
            res.status(404).json("Product not found in cart");
        }

    } catch (e) {
        res.status(500).json(e)
    }
})

//get user cart
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (user)
            res.status(200).json(user.cart)
        else
            res.status(200).json(null)

    } catch (e) {
        res.status(500).json(e)
    }
})

//get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router