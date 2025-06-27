# Guide de déploiement Frontend

## Configuration des URLs d'API

Ce projet utilise des variables d'environnement pour gérer les URLs d'API selon l'environnement (développement vs production).

### Configuration locale (développement)

1. Créez un fichier `.env.local` dans le dossier `frontend/` :
```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:3100
```

### Configuration production (Back4App)

Pour déployer sur Back4App, vous devez configurer la variable d'environnement avec l'URL de votre backend en production.

#### Option 1 : Variables d'environnement Back4App

1. Dans votre dashboard Back4App, allez dans **App Settings** > **Environment Variables**
2. Ajoutez la variable :
   - **Key**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://votre-backend-url.com` (remplacez par l'URL de votre backend)

#### Option 2 : Configuration dans le code (temporaire)

Si vous ne pouvez pas utiliser les variables d'environnement Back4App, modifiez temporairement le fichier `src/lib/config.ts` :

```typescript
export const config = {
  // Remplacez par votre URL de production
  apiBaseUrl: 'https://votre-backend-url.com',
  // ... reste du code
};
```

### URLs supportées

Le système gère automatiquement les endpoints suivants :
- `/api/calcul-reserves/` - Calcul des réserves
- `/api/import-csv/` - Import de fichiers CSV

### Vérification

Pour vérifier que la configuration fonctionne :
1. En développement : `npm run dev`
2. En production : déployez et testez les fonctionnalités

### Avantages de cette approche

✅ **Pas de modification de code** : Changez juste la variable d'environnement  
✅ **Environnements multiples** : Facile de switcher entre dev/prod  
✅ **Sécurité** : Les URLs ne sont pas hardcodées  
✅ **Maintenance** : Configuration centralisée dans un seul fichier 