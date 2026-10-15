// translate_strings.js
// Dependency‑free script that walks the workspace and replaces UI strings
// defined in `translationMap` with their Spanish equivalents.
// It skips large build/artifact directories to avoid overwhelming the process.

const fs = require('fs');
const path = require('path');

// Map of English UI literals to Spanish translations.
const translationMap = {
  'Submit': 'Enviar',
  'Cancel': 'Cancelar',
  'Loading': 'Cargando',
  'Save': 'Guardar',
  'Edit': 'Editar',
  'Delete': 'Eliminar',
  'Update': 'Actualizar',
  'Add': 'Agregar',
  'Remove': 'Quitar',
  'Next': 'Siguiente',
  'Previous': 'Anterior',
  'Back': 'Atrás',
  'Close': 'Cerrar',
  'Open': 'Abrir',
  'Search': 'Buscar',
  'Filter': 'Filtrar',
  'Settings': 'Configuración',
  'Profile': 'Perfil',
  'Logout': 'Cerrar sesión',
  'Login': 'Iniciar sesión',
  'Sign up': 'Registrarse',
  'Username': 'Nombre de usuario',
  'Password': 'Contraseña',
  'Email': 'Correo electrónico',
  'Welcome': 'Bienvenido',
  'Thank you': 'Gracias',
  'RSVP': 'Confirmar asistencia',
  'Submit RSVP': 'Enviar confirmación',
  'Date': 'Fecha',
  'Time': 'Hora',
  'Location': 'Ubicación',
  'Details': 'Detalles',
  'Guest': 'Invitado',
  'Guests': 'Invitados',
  'Menu': 'Menú',
  'Registry': 'Registro',
  'Thank you for joining us': 'Gracias por acompañarnos',
  'Primary': 'Principal',
  'Secondary': 'Secundario',
  // Add additional entries as needed
};

// Returns a new string where each map entry is replaced using word boundaries.
function translateText(text) {
  let result = text;
  for (const [en, es] of Object.entries(translationMap)) {
    // Escape special regex characters in the English phrase.
    const escapedEn = en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedEn}\\b`, 'g');
    result = result.replace(regex, es);
  }
  return result;
}

// Process a single file: read, translate, write back if changed.
function processFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.tsx', '.ts', '.js', '.jsx', '.md', '.json'].includes(ext)) return;
  const original = fs.readFileSync(filePath, 'utf8');
  const translated = translateText(original);
  if (translated !== original) {
    fs.writeFileSync(filePath, translated, 'utf8');
    console.log(`Translated ${filePath}`);
  }
}

// Recursively walk directories, skipping heavy folders.
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip directories that contain generated assets or dependencies.
      if (['node_modules', '.next', 'dist', 'build', '.git', 'out', 'coverage'].includes(entry.name)) continue;
      walk(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}

function main() {
  const cwd = process.cwd();
  walk(cwd);
}

main();
