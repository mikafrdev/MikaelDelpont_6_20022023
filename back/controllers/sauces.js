const ModelsSauce = require("../models/ModelsSauce")

exports.createSauce = (req, res, next) => {
    console.log("test req.body.sauce : ", req.body.sauce)
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    delete sauceObject._userId
    const sauce = new ModelsSauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    })
  
    sauce.save()
    .then(() => { res.status(201).json({message: 'Sauce ajoutée !'})})
    .catch(error => { res.status(400).json( { error })})
 }

 exports.getOneSauce = (req, res, next) => {
    ModelsSauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(404).json({
                error: error,
            })
        })
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }
  
    delete sauceObject._userId
    ModelsSauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'})
            } else {
                ModelsSauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
 }

 exports.deleteSauce = (req, res, next) => {
    ModelsSauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'})
            } else {
                const filename = sauce.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    ModelsSauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch( error => {
            console.log("test error : ")
            res.status(500).json({ error })
        })
 }

exports.getAllSauces = (req, res, next) => {
    ModelsSauce.find()
        .then((sauce) => {
            res.status(200).json(sauce)
        })
        .catch((error) => {
            res.status(400).json({
                error: error,
            })
        })
}