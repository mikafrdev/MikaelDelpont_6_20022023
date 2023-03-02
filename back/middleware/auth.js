const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        //Pour récupérer le token on split à la 2ème position la chaine de caractère au format <Bearer Token>
        const token = req.headers.authorization.split(" ")[1]
        //console.log("req.headers.authorization : ", req.headers.authorization)
        //On décode le token pour bien le récupérer afin de le vérifier. Si pb pour décoder ça part dans le error
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET")
        //console.log("decodedToken : ", decodedToken)
        const userId = decodedToken.userId
        //console.log("userId : ", userId)
        //L'objet req sera transmis aux routes par la suite, on va donc lui passer l'id
        req.auth = {
            userId: userId,
        }
        next()
    } catch (error) {
        res.status(401).json({ error })
    }
}