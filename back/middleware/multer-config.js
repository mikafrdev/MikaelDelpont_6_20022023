const multer = require('multer')

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

//configure le chemin et le nom de fichier pour les fichiers entrants
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images') //arg1 => si erreur | arg2 => nom du dossier
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_') //nouveau nom pour le fichier, on remplace les espaces par des _
    const extension = MIME_TYPES[file.mimetype] //Gestion des extensions
    callback(null, name + Date.now() + '.' + extension) //arg1 => si erreur | arg2 => timestamp pour rendre unique
  }
})

//crée un middleware qui capture les fichiers d'un certain type (passé en argument), et les enregistre au système de fichiers du serveur à l'aide du storage configuré. 
module.exports = multer({storage: storage}).single('image')