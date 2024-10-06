const router = require("express").Router()
const User = require("../models/User")
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken")

router.post("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        const productExists = user.wishlist.some(item => item._id === req.body._id);

        if (productExists) {
            return res.status(400).json("Product already in wishlist");
        }

        user.wishlist.push(req.body)
        await user.save()
        res.status(200).json("Done")
    } catch (e) {
        res.status(500).json(e)
    }
})

router.post("/:id/remove", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const productIndex = user.wishlist.findIndex(item => (
            item._id === req.body._id 
        ));

        // console.log(productIndex)
        if (productIndex > -1) {
            // console.log("......" + user.wishlist.length)
            user.wishlist.splice(productIndex, 1);  
            // console.log("......" + user.wishlist.length)
            await user.save();  
            res.status(200).json("Product removed from wishlist");
        } else {
            res.status(404).json("Product not found in wishlist");
        }

    } catch (e) {
        res.status(500).json(e)
    }
})

//get user wishlist
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        
        if (user)
            res.status(200).json(user.wishlist)
        else
            res.status(200).json(null)

    } catch (e) {
        res.status(500).json(e)
    }
})

//get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const wishlists = await wishlist.find()
        res.status(200).json(wishlists)
    } catch (e) {
        res.status(500).json(e)
    }
})

module.exports = router