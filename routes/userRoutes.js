const express = require("express")
const router = express.Router()

const { login, register } = require("../controllers/auth")
const { auth, isStudent, isAdmin } = require("../middleware/auth")

// public routes
router.post("/login", login)
router.post("/register", register)

// protected routes
router.get("/student", auth, isStudent, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected routes for Students",
  })
})

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcom to protected routes for Admin",
  })
})

router.get("/test", auth, (req, res) => {
  res.json({
    success: true,
    message: "Welcom to protected routes TEST",
  })
})

module.exports = router
