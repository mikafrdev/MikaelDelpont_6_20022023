//Besoin d'express pour créer un routeur
const express = require('express')
const router = express.Router()
//Pour associer le controlleur aux différentes routes
const userCtrl = require('../controllers/user')

//Routes POST car le frontend va aussi envoyer des informations (email + mdp)
router.post('/signup', userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router