#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envLocalPath = path.join(__dirname, '..', '.env.local');

function setupEnvironment() {
  console.log('🔧 Configuration des variables d\'environnement...\n');

  // Vérifier si .env.local existe déjà
  if (fs.existsSync(envLocalPath)) {
    console.log('⚠️  Le fichier .env.local existe déjà.');
    console.log('   Si vous voulez le recréer, supprimez-le d\'abord.\n');
    return;
  }

  // Lire le fichier d'exemple
  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ Fichier env.example non trouvé');
    return;
  }

  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Créer .env.local
  fs.writeFileSync(envLocalPath, envContent);
  
  console.log('✅ Fichier .env.local créé avec succès !');
  console.log('📝 Vous pouvez maintenant modifier les valeurs selon vos besoins.\n');
  
  console.log('📋 Prochaines étapes :');
  console.log('   1. Modifiez .env.local avec vos URLs');
  console.log('   2. Pour le développement : NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3100');
  console.log('   3. Pour la production : NEXT_PUBLIC_API_BASE_URL=https://votre-backend-url.com');
}

function showHelp() {
  console.log('Usage: node scripts/setup-env.js');
  console.log('');
  console.log('Ce script crée un fichier .env.local basé sur env.example');
  console.log('pour configurer les variables d\'environnement de votre application.');
}

// Gestion des arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  setupEnvironment();
} 