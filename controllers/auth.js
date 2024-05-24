const bcrypt = require("bcrypt")
const User = require("../models/userModels")
const jwt = require("jsonwebtoken")
require("dotenv").config()
exports.register = async (req, res) => {
  try {
    // get data
    const { name, email, password, role } = req.body

    // existing user
    const isExists = await User.findOne({ email })
    if (isExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      })
    }

    // password ko secure karo
    let hashedPassword
    try {
      hashedPassword = await bcypt.hash(password, 10)
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error in hashing in password",
      })
    }

    // create the entry in User
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    })

    return res.status(200).json({
      success: true,
      message: "Registration Done!!",
      user: user,
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error while registering user.",
    })
  }
}

exports.login = async (req, res) => {
  try {
    // get data
    const { email, password } = req.body

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all the fields",
      })
    }

    // check if user exists
    let user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      })
    }

    // verify password and generate JWT token
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role,
    }

    if (await bcrypt.compare(password, user.password)) {
      let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2h" })
      user = user.toObject()
      user.token = token
      user.password = undefined
      console.log("token: ",token)
      const options = {
        expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true, // we can't access it on the client side
      }

      // passing the token into the cookie and accessing with the help of cookie-parser in the middleware
      // res.cookie("token", token, options).status(200).json({
      //   success: true,
      //   token,
      //   user,
      //   message: "A user logged in successfully.",
      // })
    } else {
      res.status(403).json({
        success: false,
        message: "Password incorrect",
      })
    }
  } catch (err) {
    console.log("Error:", err)
    res.status(500).json({
      success: false,
      message: "Login failed",
    })
  }
}
