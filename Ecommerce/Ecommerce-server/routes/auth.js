const router = require("express").Router()
const User = require("../models/User")
const CryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken")
const Cart = require("../models/Cart")

//Register
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASSWORD_SEC).toString(),
        mobile: req.body.mobile
    })

    try {
        const user = await User.findOne({ username: req.body.username })
        user && res.status(401).json("Invalid Credentials!!!")
        
        const savedUser = await newUser.save()

        res.status(200).json(savedUser)
    } catch (e) {
        res.status(500).json(e)
    }
})

//Login
router.post("/login", async (req, res) => {
    try {
        console.log('1')
        const user = await User.findOne({ email: req.body.email })
        console.log('2')
        !user && res.status(401).json("Invalid Credentials!!!")
        console.log('3')
        console.log(user)
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASSWORD_SEC)
        const pword = hashedPassword.toString(CryptoJS.enc.Utf8)
        console.log('4')
        if(pword != req.body.password) return res.status(401).json("Invalid Credentials!!!")
            console.log('5')
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
        },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );
        console.log('6')

        const { password, ...others } = user._doc;
        return res.status(200).json({...others, accessToken})
    } catch (e) {
        res.status(500).json(e)
    }
})
//Logout
router.post("/logout", (req,res)=>{
    res.status(200).json("Successfully logout")
})


module.exports = router