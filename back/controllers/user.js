/*
npm install bcrypt
npm install --save jsonwebtoken
*/

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')   //Permet de créer des TOKEN et de les vérifier
const User = require('../models/User')


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            })
            user.save()
                .then(() => res.status(201).json({ message : 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) //On récupère la valeur saisie par le client
        .then(user => {
            if (!user) {    //Si l'utilisateur n'existe pas dans la BDD
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            } else {
                bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    } else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(    //On indique les données à encoder
                                { userId: user._id },  
                                'RANDOM_TOKEN_SECRET',  //Pour le dev mais utiliser une chaine de caractère complexe pour la prod
                                { expiresIn: '24h' }
                            )
                        })
                    }
                })
                .catch(error => {
                    res.status(510).json({ error }) //Erreur provenant de la BDD uniquement
                })
            }
        })
        .catch(error => res.status(500).json({ error }));
 };

/*
Nous utilisons la fonction sign de jsonwebtoken pour chiffrer un nouveau token.
Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token).
Nous utilisons une chaîne secrète de développement temporaire RANDOM_SECRET_KEY pour crypter notre token (à remplacer par une chaîne aléatoire beaucoup plus longue pour la production). Puisque cette chaîne sert de clé pour le chiffrement et le déchiffrement du token, elle doit être difficile à deviner, sinon n’importe qui pourrait générer un token en se faisant passer pour notre serveur.
Nous définissons la durée de validité du token à 24 heures. L'utilisateur devra donc se reconnecter au bout de 24 heures.
Nous renvoyons le token au front-end avec notre réponse.
Vous pouvez désormais utiliser l'onglet « Réseau » de Chrome DevTools pour vérifier qu’une fois l’utilisateur connecté, chaque requête provenant du front-end contient bien un en-tête « Authorization » avec le mot-clé « Bearer » et une longue chaîne chiffrée. Il s'agit de notre token !
*/