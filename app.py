from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.')
app.static_url_path = '' # Racine pour les fichiers statiques

# Servir index.html (ou home.html dans ton cas) à la racine
@app.route('/')
def serve_home():
    return send_from_directory('.', 'home.html')

# Servir tous les autres fichiers statiques (css, js, icons, etc.) à partir du dossier racine
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    # Pour HTTPS local, tu as besoin de certificats. Pour commencer, on utilise HTTP.
    # Pour générer des certificats auto-signés : openssl req -x509 -newkey rsa:4096 -nodes -out cert.pem -keyout key.pem -days 365
    # Puis, utilise app.run(ssl_context=('cert.pem', 'key.pem'), ...) à la place de app.run()
    app.run(debug=True, port=5000)