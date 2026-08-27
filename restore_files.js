// restore_files.js
import fs from 'fs'; // Module pour la manipulation de fichiers
import path from 'path'; // Module pour la manipulation de chemins
import { fileURLToPath } from 'url'; // Pour obtenir le chemin du fichier courant en ES Modules

// Obtenir le chemin absolu du dossier courant (__dirname n'est pas disponible par défaut en ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Définition des contenus corrects
const homeHtmlContent = `<!DOCTYPE html>