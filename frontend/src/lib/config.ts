// Configuration centralisée pour les URLs d'API

// Détection automatique de l'environnement
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname !== 'localhost' && 
   window.location.hostname !== '127.0.0.1');

// URL de base selon l'environnement
const getApiBaseUrl = () => {
  // Priorité 1: Variable d'environnement
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Priorité 2: Détection automatique en production
  if (isProduction) {
    // ⚠️ MODIFIEZ CETTE URL AVEC VOTRE VRAIE URL DE BACKEND
    return 'https://probastatbackend-69c6deiv.b4a.run'; // ← Remplacez par votre URL
  }
  
  // Priorité 3: Développement local
  return 'http://127.0.0.1:3100';
};

export const config = {
  // URL de l'API backend
  apiBaseUrl: getApiBaseUrl(),
  
  // Endpoints spécifiques
  endpoints: {
    calculReserves: '/api/calcul-reserves/',
    importCsv: '/api/import-csv/',
  }
};

// Debug: Afficher la configuration en développement
if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  console.log('🔧 Configuration API:', {
    apiBaseUrl: config.apiBaseUrl,
    envVar: process.env.NEXT_PUBLIC_API_BASE_URL,
    nodeEnv: process.env.NODE_ENV,
    isProduction: isProduction,
    hostname: window.location.hostname
  });
}

// Fonction utilitaire pour construire les URLs complètes
export const getApiUrl = (endpoint: string): string => {
  const url = `${config.apiBaseUrl}${endpoint}`;
  
  // Debug en développement
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    console.log(`🔗 URL générée pour ${endpoint}:`, url);
  }
  
  return url;
};

// URLs prêtes à l'emploi
export const apiUrls = {
  calculReserves: getApiUrl(config.endpoints.calculReserves),
  importCsv: getApiUrl(config.endpoints.importCsv),
}; 