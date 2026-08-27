// server.js - Serveur Express local pour ton site statique

import express from 'express'; // Importation d'Express
import path from 'path'; // Pour manipuler les chemins
import { fileURLToPath } from 'url'; // Pour obtenir le chemin du fichier courant en ES Modules
import net from 'net'; // Pour vérifier la disponibilité du port

// Obtenir le chemin absolu du dossier courant (__dirname n'est pas disponible par défaut en ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Déterminer le port d'écoute (depuis une variable d'environnement ou un port par défaut)
let port = process.env.PORT || 8888;

// Middleware de base
// 1. Protection basique : Bloquer les requêtes contenant des balises potentiellement dangereuses dans l'URL
app.use((req, res, next) => {
  // Vérifie si l'URL brute contient des balises script ou iframe (insensible à la casse)
  if (/(<script|<iframe)/i.test(req.url)) {
    console.warn(`Requête bloquée pour injection potentielle: ${req.method} ${req.url}`);
    return res.status(403).send('Forbidden: Request blocked for security reasons.');
  }
  next(); // Passe à la suite si la requête est OK
});

// 2. Servir les fichiers statiques du site à partir du dossier courant
app.use(express.static('.')); // '.' signifie le dossier où ce script est exécuté

// Route spécifique pour le manifeste PWA
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'manifest.json'));
});

// Fonction pour trouver un port disponible
function findPort(startPort) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort); // Le port est disponible
      });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} occupé, tentative avec ${startPort + 1}...`);
        findPort(startPort + 1).then(resolve).catch(reject); // Récursion pour tester le port suivant
      } else {
        reject(err); // Une autre erreur est survenue
      }
    });
  });
}

// Trouver un port disponible et démarrer le serveur
findPort(port)
  .then(availablePort => {
    port = availablePort; // Mise à jour de la variable port avec le port trouvé
    app.listen(port, () => {
      console.log(`\x1b[32mServeur HTTP lancé sur http://localhost:${port}\x1b[0m`);
    });
  })
  .catch(err => {
    console.error("\x1b[31mErreur lors de la recherche d'un port disponible ou du démarrage du serveur:\x1b[0m", err);
  });

// Gestionnaire d'erreur global pour les exceptions non capturées
process.on('uncaughtException', (err) => {
  console.error('\x1b[31mErreur fatale non capturée:\x1b[0m', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('\x1b[31mRejet de promesse non géré:\x1b[0m', reason);
  process.exit(1);
});