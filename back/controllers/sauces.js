const ModelsSauce = require("../models/ModelsSauce");
const fs = require('fs')    //Gestionnaire de fichier natif de Node.js

exports.getAllSauces = (req, res, next) => {
    ModelsSauce.find()
        .then((sauce) => { res.status(200).json(sauce) })
        .catch((error) => { res.status(400).json({ error: error }) })
}

exports.createSauce = (req, res, next) => {
    //Le front-end envoie les données de la requête sous la forme form-data
    const sauceObject = JSON.parse(req.body.sauce);
    
    delete sauceObject._id;
    //Par sécurité on supprime _userId de la rquête par le _userId extrait du token
    delete sauceObject._userId;

    console.log("req.file : ", req.file)
    console.log("req.file.filename : ", req.file.filename)

    const sauce = new ModelsSauce({
        //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
        ...sauceObject,
        userId: req.auth.userId,
        /*
            req.protocol => http
            req.get("host") => localhost:3000
            req.file.filename => test.jpeg1678290614292.jpg

            http://localhost:3000/images/<image-name>.jpg
        */
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    })

    sauce.save()
        .then(() => { res.status(201).json({ message: "Sauce ajoutée !" }) })
        .catch((error) => { res.status(400).json({ error }) })
};

exports.getOneSauce = (req, res, next) => {
    
    ModelsSauce.findOne({_id: req.params.id})
        .then((sauce) => {  res.status(200).json(sauce) })
        .catch((error) => { res.status(404).json({ error: error }) })
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {    //Vérifie la présence d'un fichier
        ...JSON.parse(req.body.sauce),  //req.file est reçu au format form-data
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    } : { ...req.body }

    delete sauceObject._userId;
    
    ModelsSauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            
            if (sauce.userId != req.auth.userId) {  //Si l'id envoyé ne correspond pas à celui renvoyé par le token
                res.status(401).json({ message: "Not authorized" })

            } else {
                ModelsSauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id })  //Quel est l'enregistrement à mettre à jour et avec quel objet
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch(error => res.status(401).json({ error }))
            }

        })
        .catch((error) => { res.status(400).json({ error }) })
}

exports.deleteSauce = (req, res, next) => {
    
    ModelsSauce.findOne({ _id: req.params.id })
    .then( sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({message: 'Not authorized'});
        } else {
            const filename = sauce.imageUrl.split("/images/")[1]
            fs.unlink(`images/${filename}`, () => {     //Supprime l'image

                ModelsSauce.deleteOne({ _id: req.params.id })   //Supprime l'image dans la BDD mongoDB
                    .then(() => { res.status(200).json({ message: "Objet supprimé !"})})
                    .catch((error) => res.status(401).json({ error }))
            })
        }
    })
    .catch( error => { res.status(200).json({ message: "FAIL !", error }) })
}

exports.likeOrDislikeSauce = (req, res) => {

    ModelsSauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            if (req.body.like == 1) {   //Like

                ModelsSauce.updateOne( { _id: req.params.id }, { $inc: { likes: + 1 }, $push: { usersLiked: req.body.userId }} )
                    .then(() => res.status(200).json({ message: "Like = 1 !" }))
                    .catch((error) => res.status(401).json({ error }))

            }else if (req.body.like == -1) {    //Dislike
                
                ModelsSauce.updateOne( { _id: req.params.id }, { $inc: { dislikes: + 1 }, $push: { usersDisliked: req.body.userId }} )
                    .then(() => res.status(200).json({ message: "Like = -1 !" }))
                    .catch((error) => res.status(401).json({ error }))
            
            }else if (req.body.like == 0) {
                
                //Test si le userId se trouve dans le tableau usersLiked ou usersDisliked
                if ( sauce.usersLiked.includes(req.body.userId) ) {
                    ModelsSauce.updateOne( { _id: req.params.id }, { $inc: { likes: - 1 }, $pull: { usersLiked: req.body.userId }} )
                        .then(() => res.status(200).json({ message: "Like = 0 !" }))
                        .catch((error) => res.status(401).json({ error }))

                }else{
                    ModelsSauce.updateOne( { _id: req.params.id }, { $inc: { dislikes: - 1 }, $pull: { usersDisliked: req.body.userId }} )
                        .then(() => res.status(200).json({ message: "Like = 0 !" }))
                        .catch((error) => res.status(401).json({ error }))

                }
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}