const mongoose = require("mongoose")
const Schema =  mongoose.Schema

const HomeSchema = new Schema ({
    titulo: { type: String, required: true },
    fotos: { type: Array, required: true, default: []}
})

module.exports = mongoose.model("Home", HomeSchema)