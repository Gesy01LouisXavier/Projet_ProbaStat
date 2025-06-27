# Configuration Back4App

## Déploiement du Frontend sur Back4App

### 1. Préparation du projet

1. Assurez-vous que votre projet est prêt pour la production :
```bash
npm run build
```

2. Configurez les variables d'environnement Back4App :
   - Allez dans votre dashboard Back4App
   - **App Settings** > **Environment Variables**
   - Ajoutez : `NEXT_PUBLIC_API_BASE_URL` = `https://votre-backend-url.com`

### 2. Configuration Back4App

#### Variables d'environnement requises :
```
NEXT_PUBLIC_API_BASE_URL=https://votre-backend-url.com
```

#### Configuration du build :
- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Install Command** : `npm install`

### 3. Déploiement

1. Connectez votre repository GitHub à Back4App
2. Configurez les variables d'environnement
3. Déployez

### 4. Vérification

Après le déploiement, vérifiez que :
- Les APIs fonctionnent correctement
- Les imports CSV marchent
- Le dashboard affiche les données

### 5. Troubleshooting

Si les APIs ne fonctionnent pas :
1. Vérifiez l'URL dans `NEXT_PUBLIC_API_BASE_URL`
2. Assurez-vous que votre backend est accessible
3. Vérifiez les logs Back4App

### 6. URLs de test

Testez ces endpoints après déploiement :
- Dashboard : `https://votre-app.back4app.io/dashboard`
- Import CSV : `https://votre-app.back4app.io/import-csv` 