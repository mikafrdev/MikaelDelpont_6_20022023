const express = require('express')
const router = express.Router()

//ATTENTION, on place multer après auth sinon les images des requêtes non authentifiées seront enregistrées dans le serveur
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')

const saucesCtrl = require('../controllers/sauces')

router.get('/', auth, saucesCtrl.getAllSauces)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.post('/:id/like/', auth, saucesCtrl.likeOrDislikeSauce)

module.exports = router