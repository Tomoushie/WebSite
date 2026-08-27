// sw.js

const CACHE_NAME = 'tomnowak-portfolio-v1';
const urlsToCache = [
  '/',
  '/home.html', // Si ton fichier s'appelle home.html
  '/css/style.css',
  '/manifest.json',
  // Ajoute d'autres fichiers statiques nécessaires pour le mode hors ligne
  // Ex: '/offline.html' (page personnalisée pour le mode hors ligne)
];

self.addEventListener('install', event => {
  // Attend que le cache soit ouvert et que les fichiers soient ajoutés
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert et fichiers ajoutés');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Erreur pendant l\'installation du cache:', error);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    // Essaye de récupérer la ressource dans le cache
    caches.match(event.request)
      .then(response => {
        // Si trouvée dans le cache, la retourner
        if (response) {
          return response;
        }
        // Sinon, faire une requête réseau
        return fetch(event.request);
      })
      // Gestion d'erreur si la requête réseau échoue
      .catch(error => {
        console.error(`Fetch échoué pour: ${event.request.url}`, error);
        // Optionnel: retourner une page hors ligne personnalisée
        // return caches.match('/offline.html');
        // Pour l'instant, on laisse échouer silencieusement ou retourne une erreur générique
        // Selon ton besoin, tu peux personnaliser ce comportement
      })
  );
});

// Optionnel: Nettoyer les anciennes versions du cache lors de l'activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});