const express = require("express")
const { connectDB } = require("./config/db")
const app = express()
require("dotenv").config()

const cookieParser = require("cookie-parser")
app.use(cookieParser())
app.use(express.json())

connectDB()

const userRoutes = require("./routes/userRoutes")

app.use("/api/v1", userRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Your server is up and running at ${process.env.PORT}`)
})
