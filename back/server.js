const http = require('http');
const app = require('./app');

//Récupère la valeur numérique du port, ex sur un port = "2434sdfdf" sera converti en "2434"
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

//Ecoute le port renseigné dans .env sinon le 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const errorHandler = error => {
  //Regarde si l'erreur est bien liée à la connexion au socket
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();

  //Est-ce que l' "address" est de type "string" ? Si oui, alors on écrit "pipe " + address, si non, on écrit "port: "+port 
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  //voir les codes erreur sur https://nodejs.org/api/errors.html
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
