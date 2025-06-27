# Guide de dépannage - Configuration API

## Problème : L'application utilise encore l'URL locale en production

### 🔍 Diagnostic

1. **Ouvrez la console du navigateur** (F12) sur votre site en production
2. **Cherchez les logs de debug** qui commencent par 🔧
3. **Vérifiez l'URL utilisée** dans les requêtes réseau

### 🛠️ Solutions

#### Solution 1 : Modifier l'URL de production dans le code

Si la variable d'environnement ne fonctionne pas, modifiez directement le fichier `src/lib/config.ts` :

```typescript
// Ligne 18, remplacez par votre vraie URL de backend
return 'https://votre-vraie-backend-url.com';
```

#### Solution 2 : Forcer la reconstruction Back4App

1. **Supprimez le cache de build** sur Back4App
2. **Redéployez** avec les variables d'environnement configurées
3. **Vérifiez** que `NEXT_PUBLIC_API_BASE_URL` est bien défini

#### Solution 3 : Configuration Back4App

Dans votre dashboard Back4App :

1. **App Settings** > **Environment Variables**
2. **Ajoutez** : `NEXT_PUBLIC_API_BASE_URL` = `https://votre-backend-url.com`
3. **Redéployez** l'application

### 🔧 Vérification

Après modification, vérifiez que :

1. **En développement** : `http://127.0.0.1:3100` est utilisé
2. **En production** : Votre URL de production est utilisée
3. **Les APIs fonctionnent** correctement

### 📝 Logs de debug

Les logs suivants apparaissent en développement :
```
🔧 Configuration API: {
  apiBaseUrl: "https://votre-backend-url.com",
  envVar: "https://votre-backend-url.com",
  nodeEnv: "production",
  isProduction: true,
  hostname: "votre-app.back4app.io"
}
```

### 🚨 Problèmes courants

1. **Variable d'environnement non prise en compte** : Redéployez après configuration
2. **Cache du navigateur** : Videz le cache (Ctrl+F5)
3. **URL incorrecte** : Vérifiez que votre backend est accessible
4. **CORS** : Assurez-vous que votre backend autorise les requêtes depuis votre domaine

### 📞 Support

Si le problème persiste :
1. Vérifiez les logs Back4App
2. Testez l'URL de votre backend directement
3. Vérifiez la configuration CORS de votre backend 