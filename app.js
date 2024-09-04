const express = require("express")
const app = express()
const PORT = 3000

const index = require("./index.js")

index()

//app.use("/", index)

// app.listen(PORT, () => {
//     console.log(`http://localhost${PORT}`)
// })