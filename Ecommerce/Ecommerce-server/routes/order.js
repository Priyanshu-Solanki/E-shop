const router = require("express").Router()
const Order = require("../models/Order")
const { verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
} = require("./verifyToken")

//create
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body)

    try {
        const savedOrder = await newOrder.save()
        res.status(200).json(savedOrder)
    } catch (e) {
        res.status(500).json(e)
    }
})

//update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true })

        res.status(200).json(updatedOrder)

    } catch (e) {
        res.status(500).json(e)
    }
})

//delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id)
        res.status(200).json("Order Deleted Successfully")
    } catch (e) {
        res.status(500).json(e)
    }
})

//get user Order
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const order = await Order.find({ userId: req.params.id })
        res.status(200).json(order)
    } catch (e) {
        res.status(500).json(e)
    }
})

//get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const Orders = await Order.find()
        res.status(200).json(Orders)
    } catch (e) {
        res.status(500).json(e)
    }
})

//get monthly income
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const productId = req.query.pId
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: previousMonth }, ...(productId && {
                        products: { $elemMatch: { productId } }
                    })
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router