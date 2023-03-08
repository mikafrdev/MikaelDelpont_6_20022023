/*
Installation du plugin mongoose-unique-validator permettant de ne pas avoir plusieurs utilisateurs avec la meme adresse email
Commande : npm install --save mongoose-unique-validator
*/

const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

//La méthode Schema de Mongoose vous permet de créer un schéma de données pour votre base de données MongoDB
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

//mongoose-unique-validator passé comme plug-in, s'assurera que deux utilisateurs ne puissent partager la même adresse e-mail.
userSchema.plugin(uniqueValidator)

//La méthode model transforme ce modèle en un modèle utilisable.
module.exports = mongoose.model("User", userSchema)
