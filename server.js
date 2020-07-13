const express = require("express")
const mongoose = require('mongoose')
const ejs = require("ejs")
const bodyParser = require("body-parser")
const morgan = require("morgan")
const cors = require("cors")
const compression = require("compression")


//START SERVIDOR
    const app = express()

//AMBIENTE 
    const isProduction = process.env.NODE_ENV === "production"
    const PORT = process.env.PORT || 3000

//ARQUIVOS ESTATICOS
app.use("/public", express.static(__dirname + "/public"))
app.use("/plublic/images", express.static(__dirname + "/public/images"))    

// SETUP ejs
    app.set("view engine", "ejs")    

//MOGOOSE
    const dbs = require("./config/database.json")
    const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest
    mongoose.connect(dbURI, {useNewUrlParser: true}).then(() => {
        console.log("Mongo conectado...")
    }).catch((err) => {
    console.log("Ocorreu um erro ao se conectar com mongo:  "+err)
    })
//MODELS
    require("./models")

//ROUTES
    //require("./routes")
//SETUP BODY PARSER    
    app.use(bodyParser.urlencoded({extended:false, limit: 1.5*1024*1024}))
    app.use(bodyParser.json({limit: 1.5*1024*1024}))

//ROTAS 404
    app.use((req, res, next) => {
        const err = new Error("Not Found")
        err.status = 404
        
        next(err)
    })

// Rotas 422, 500, 401 
    app.use((err, req, res, next) => {
        res.send(err.status || 500)
        if(err.status !== 404 ) console.warn("Error: ", err.message, new Date())
        res.json(err)
    })
// CONFIGURAÇÃO
    if(!isProduction) app.use(morgan("dev"))
    app.use(cors())
    app.disable('x-powered-by')
    app.use(compression())

// OUVINDO A PORTA PARA O SERVIDOR    
    app.listen(PORT, (err)=> {
        if(err) throw err
        console.log("Servidor rodando...")
    })