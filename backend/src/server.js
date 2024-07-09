const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const app = express()
const orgAuthRouter = require("./routes/organizations/authRouter")
const db_url = process.env.DB_URL
const port = process.env.PORT || 3000

app.use(express.json());
app.use("/accts", orgAuthRouter)


mongoose.connect(db_url)
    .then(() => {
        app.listen(port, () => {
            console.log("Server is running on port " + port)
        })
    })
    .catch((error) => {
        console.log(error)
    })

