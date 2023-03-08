const express = require('express')
const mongoose = require('mongoose')
const path = require('path')  //Permet d'accéder au path du serveur
const Thing = require('./models/ModelsSauce')
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')

//Suppress mongoose warning
mongoose.set('strictQuery', true)

mongoose.connect(process.env.mongoDB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

const app = express()
app.use(express.json())


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')

  //Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  
  //Permet d'envoyer des requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

app.use('/api/sauces', saucesRoutes)
app.use('/api/auth', userRoutes)

//Génère la ressource images de manière statique(un sous-répertoire de notre répertoire de base, __dirname) à chaque fois qu'elle reçoit une requête vers la route /images
app.use('/images', express.static(path.join(__dirname, 'images')))

module.exports = app