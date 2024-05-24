const jwt = require("jsonwebtoken")
require("dotenv").config()

exports.auth = (req, res, next) => {
  try {
    // extract jwt token
    const token =
      // req.cookies.token
      // || req.body.token ||
      req.header("Authorization").replace("Bearer ", "")

    console.log("body", req.body.token)
    console.log("cookie", req.cookies.token)
    console.log("Header: ", req.header)
    if (!token) {
      return res.status(401).json({
        successfull: false,
        message: "Token not found",
      })
    }

    // verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET)

      req.user = decode
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid",
      })
    }

    next()
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while verifying the token.",
    })
  }
}

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students",
      })
    }
    next()
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}

exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin",
      })
    }
    next()
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "User role cannot be verified",
    })
  }
}
