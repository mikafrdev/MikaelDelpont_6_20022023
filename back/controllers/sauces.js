const ModelsSauce = require("../models/ModelsSauce");
const fs = require('fs')

exports.getAllSauces = (req, res, next) => {
    
    ModelsSauce.find()
        .then((sauce) => { res.status(200).json(sauce) })
        .catch((error) => { res.status(400).json({ error: error }) })
}

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new ModelsSauce({
        ...sauceObject,
        userId: req.auth.userId,
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
    const sauceObject = req.file
        ? {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body }

    delete sauceObject._userId;
    
    ModelsSauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Not authorized" })

            } else {
                ModelsSauce.updateOne( { _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    
                    .then(() => res.status(200).json({ message: "Objet modifié!" }))
                    .catch((error) => res.status(401).json({ error }))
            }

        })
        .catch((error) => { res.status(400).json({ error }) })
}

exports.deleteSauce = (req, res, next) => {
    
    ModelsSauce.findOne({ _id: req.params.id })
    .then( sauce => {

        const filename = sauce.imageUrl.split("/images/")[1]
        //Supprime l'image
        fs.unlink(`images/${filename}`, () => {

            //Supprime l'image dans la BDD mongoDB
            ModelsSauce.deleteOne({ _id: req.params.id })

                .then(() => { res.status(200).json({ message: "Objet supprimé !"})})
                .catch((error) => res.status(401).json({ error }))
        })
    })
    .catch( error => { res.status(200).json({ message: "FAIL !", error }) })
}

exports.upThumbSauce = (req, res) => {

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