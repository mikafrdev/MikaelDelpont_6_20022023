const express = require('express')
const mongoose = require('mongoose')
//const path = require('path')
//const Thing = require('./models/Thing')
const stuffRoutes = require('./routes/stuff')
const userRoutes = require('./routes/user')

const mongoDB = 'mongodb+srv://mikadevfr:Titounis@cluster0.svheaeg.mongodb.net/piquante'

mongoose.connect(mongoDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    next()
})

app.use('/api/auth', userRoutes);

module.exports = app