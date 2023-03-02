const express = require('express')
const auth = require('../middleware/auth')
const router = express.Router()
const multer = require('../middleware/multer-config')
const saucesCtrl = require('../controllers/sauces')

router.get('/', auth, saucesCtrl.getAllSauces)
router.post('/', auth, multer, saucesCtrl.createSauce)
router.get('/:id', auth, saucesCtrl.getOneSauce)
router.put('/:id', auth, multer, saucesCtrl.modifySauce)
router.delete('/:id', auth, saucesCtrl.deleteSauce)
router.post('/:id/like/', auth, saucesCtrl.likeOrDislikeSauce)

module.exports = router